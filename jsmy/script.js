const ADD = 0;
const DELETE = 1;
const MOVE = 2;
const CONNECT = 3;
const EDIT = 4;

var hem = [1,2,3];


var edit_plain = document.getElementById('edit-plain');
var vehicle_id = 0;
var vehicle_node_id = 0;

var editing_line = 0;

var mode_info_state = 0;
var information_info_state = 0;
var node_id = 0;
var line_id = 0;
var vehicle_id = 0;

window.$map = [];
window.$line_map = [];
window.$node_map = [];
var map = window.$map;
var line_map = window.$line_map;
var node_map = window.$node_map

var deleting_node_arr = [];
var deleting_line_arr = [];
window.$deleting_line_arr = deleting_line_arr;
window.$deleting_node_arr = deleting_node_arr;

var drag_active = false;
var connect_active = false;

var cur_line;
var draging_line = [[]];      // [id, (x1 or x2), (y1 or y2)]

var pressed_node;
var clicked_element;
var offset = [0, 0];

var deleting_node_index_func = function(index){
	var delete_index = index;
	for(i = 0; i < index; i++){
		delete_index -= deleting_node_arr[i];
	}
	return delete_index;
}

var deleting_line_index_func = function(index){
	var delete_index = index;
	for(j=0; j<index; j++){
		delete_index -= deleting_line_arr[j];
	}
	return delete_index;
}

window.deleting_line_index_func = deleting_line_index_func;
window.deleting_node_index_func = deleting_node_index_func;

var pointer_event_none = function(classname){
	var line_list = document.querySelectorAll(classname);
	for(i = 0; i < line_list.length; i++){
		line_list[i].setAttribute('pointer-events', 'none');
	}
}

var pointer_event_visible = function(classname){
	var line_list = document.querySelectorAll(classname);
	for(i = 0; i < line_list.length; i++){
		line_list[i].setAttribute('pointer-events', 'visible');
	}
}

var get_mode = function(){
	var mode = document.getElementsByName('mode');
	for(i = 0; i < mode.length; i++){
		if(mode[i].checked){
			return mode[i].value;
		}
	}
}

var createsvg = function(posx, posy, id){
	posx = parseInt(posx.slice(0, posx.length - 2)) + 25;
	posy = parseInt(posy.slice(0, posy.length - 2)) + 25;

	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	// console.log(posx + ' ----- ' + posy);
	document.querySelector('#svg-plain').appendChild(line);
	line.setAttribute('class', 'line');
	pointer_event_none('line');
	line.setAttribute('x1', posx);
    line.setAttribute('y1', posy);	
	line.setAttribute('x2', posx);
    line.setAttribute('y2', posy);
	line.setAttribute('id', 'l' + id);
	cur_line = line;

	line.addEventListener("click", element_clicked);
	line.addEventListener("mouseenter", show_information);
	// line.addEventListener("mouseleave", hide_information);
}

var createnode = function(posx, posy, id){
	// var newnode = '<div class="node" id="n' + id + '" style="left: ' + posx + 'px; top: ' + posy + 'px;"></div>'
	// document.querySelector("#node-plain").innerHTML += newnode;
	var div = document.createElement('div');
	document.querySelector("#node-plain").appendChild(div);
	div.style.left = posx + 'px';
	div.style.top = posy + 'px';
	div.className = 'node';
	div.id = 'n' + id;
	div.textContent = id;
	
	node_id+= 1;	
	window.$map.push([]);
	node_map.push([])
	deleting_node_arr.push(0);

	div.addEventListener("click", element_clicked);
	div.addEventListener("mousedown", drag_start, true);
	div.addEventListener("mouseup", drag_end,true);
	// div.addEventListener("mouseenter", show_information);
	// div.addEventListener("mouseleave", hide_information);
}

var show_information = function(event){
	var element = document.getElementById(event.target.id);

	if(element.id.slice(0, 1) == 'n'){
		var node_information_html = "";
		if(node_map[parseInt(element.id.slice(1))][0] == undefined){
			node_information_html = "<p>No vehicles to show</p>";
		} else {
			var index = deleting_node_index_func(parseInt(element.id.slice(1)));
			for(i = 0; i < node_map[index].length; i++){
				node_information_html += "<p>Vehicle "+parseInt(i+1)+" : "+node_map[index][i].time+" sec</p>";
			}
		}
		document.getElementById('information-info-dialogue').innerHTML = node_information_html;
	} else if(element.id.slice(0, 1) == 'l'){
		var node_information_html = "";
		var index = deleting_line_index_func(parseInt(element.id.slice(1)));
		node_information_html += "<p>Length : " + line_map[index][2] + "</p>";
		document.getElementById('information-info-dialogue').innerHTML = node_information_html;
	}
}

// var hide_information = function(event){
// 	document.getElementById('information-info-dialogue').innerHTML = "<p>Hover cursor on element</p>";
// }

var newnode = function(event){
	// console.log(event.clientX + '??' + event.clientY);
	if((event.target.id == "node-plain") && (get_mode() == ADD)){
		createnode(event.clientX-25, event.clientY-25, node_id);
	}
}

var drag_start = function(event){
	var cur_mode = get_mode();
	if(cur_mode == MOVE){
		var element = document.getElementById(event.target.id);
		pressed_node = element;
		
		offset = [element.offsetLeft - event.clientX, element.offsetTop - event.clientY];
		
		var pressed_node_index = parseInt(pressed_node.id.slice(1, pressed_node.id.length));
		for(i = 0; i< map[pressed_node_index].length; i++){

			if(map[pressed_node_index][i] != undefined){

				if(document.getElementById(map[pressed_node_index][i]).getAttribute('x1') == parseInt(pressed_node.style.left) + 25
					&& document.getElementById(map[pressed_node_index][i]).getAttribute('y1') == parseInt(pressed_node.style.top) + 25){
						draging_line.push([map[pressed_node_index][i], 'x1', 'y1']);
					} else{
						draging_line.push([map[pressed_node_index][i], 'x2', 'y2']);
					}
			}
		}

		drag_active = true;
	} else if(cur_mode == CONNECT){
		var element = document.getElementById(event.target.id);

		pressed_node = element;
		createsvg(element.style.left, element.style.top, line_id);
		line_id++;
		// console.log(element.style);

		connect_active= true;
	}
}

var drag = function(event){
	// console.log(event.clientX + ' - ' + event.clientY);
	if(drag_active){
		pressed_node.style.left = (event.clientX + offset[0]) + 'px';
		pressed_node.style.top = (event.clientY + offset[0]) + 'px';

		// console.log(draging_line);

		for(i =1; i<draging_line.length; i++){
			document.getElementById(draging_line[i][0]).setAttribute(draging_line[i][1], parseInt(pressed_node.style.left) + 25);
			document.getElementById(draging_line[i][0]).setAttribute(draging_line[i][2], parseInt(pressed_node.style.top) + 25);
		}
	}else if(connect_active){
		cur_line.setAttribute('x2', event.clientX);
		cur_line.setAttribute('y2', event.clientY);
	}
}

var drag_end = function(event){

	drag_active = false;
	draging_line = [[]];
	offset = [0, 0];
}


var element_clicked = function(event){
	
	// console.log('in click');
	var current_mode = get_mode()
	var element = document.getElementById(event.target.id);
	clicked_element = element
	if(current_mode == DELETE){
		// var element = document.getElementById(event.target.id);
		element = document.getElementById(event.target.id);
		// console.log('yes');
		// console.log(element);

		if(element.id.slice(0,1) == 'n'){

			var deleting_node_index = parseInt(element.id.slice(1));
			for(i = 0; i < parseInt(element.id.slice(1)); i++){
				deleting_node_index -= deleting_node_arr[i];
			}

			// console.log(deleting_node_index);

			for(i=0; i<map.length; i++){
				if(map[i][deleting_node_index] != undefined){
					// console.log(parseInt(map[i][deleting_node_index].slice(1)));
					var deleting_line_index = parseInt(map[i][deleting_node_index].slice(1));
					for(j=0; j<parseInt(map[i][deleting_node_index].slice(1)); j++){
						deleting_line_index -= deleting_line_arr[j];
					}
					
					// console.log(line_map);
					// console.log(deleting_line_index);

					line_map.splice(deleting_line_index, 1);
					deleting_line_arr[parseInt(map[i][deleting_node_index].slice(1))] = 1;
					var lineelement = document.getElementById(map[i][deleting_node_index]);
					lineelement.parentNode.removeChild(lineelement);
	
					map[i].splice(deleting_node_index, 1);
				}
			}
			deleting_node_arr[parseInt(element.id.slice(1))] = 1;
			map.splice(deleting_node_index, 1);
			node_map.splice(deleting_node_index, 1);
			element.parentNode.removeChild(element);

		}else if(element.id.slice(0,1) == 'l'){
			var deleting_line_index = parseInt(element.id.slice(1));
			deleting_line_arr[deleting_line_index] = 1;
			for(j=0; j<parseInt(element.id.slice(1)); j++){
				deleting_line_index -= deleting_line_arr[j];
			}

			var connected_node1_index = parseInt(line_map[deleting_line_index][0].slice(1));
			var connected_node2_index = parseInt(line_map[deleting_line_index][1].slice(1));
			line_map.splice(deleting_line_index, 1);
			map[connected_node1_index][connected_node2_index] = undefined; 
			map[connected_node2_index][connected_node1_index] = undefined;
			element.parentNode.removeChild(element);
		}
	} else if(current_mode == EDIT){
		
		// var edit_plain = document.getElementById('edit-plain');
		edit_plain.style.visibility = 'visible';
		

		var edit_plain_content = document.getElementById("edit-plain-content");
		// var edit_plain_plus = document.getElementById("edit-plane-plus");
		// var edit_plain_save = document.getElementById("edit-plane-save");
		// if(edit_plain_content != undefined){
		// 	edit_plain_content.parentNode.removeChild(edit_plain_content);
		// 	// edit_plain_plus.parentNode.removeChild(edit_plain_plus);
		// 	// edit_plain_save.parentNode.removeChild(edit_plain_save);
		// }
		

		
		edit_plain_content = document.createElement('div');
		edit_plain.appendChild(edit_plain_content);
		edit_plain_content.id = 'edit-plain-content';

		/*
		edit_plain_plus = document.createElement('INPUT');
		edit_plain.appendChild(edit_plain_plus);
		edit_plain_plus.setAttribute("id", "edit-plain-plus");
		edit_plain_plus.setAttribute("type", "image");
		edit_plain_plus.setAttribute("src", "images/plus-button.jfif");

		edit_plain_save = document.createElement('INPUT');
		edit_plain.appendChild(edit_plain_save);
		edit_plain_save.setAttribute("id", "edit-plain-save");
		edit_plain_save.setAttribute("type", "image");
		edit_plain_save.setAttribute("src", "images/save-button.jfif");
		*/

		
		if(element.id.slice(0, 1) == 'n'){
			var index = deleting_node_index_func(parseInt(element.id.slice(1)));

			if(node_map[index].length == 0){
				edit_plain_content.textContent = "Click on plus button to add vehicles";
			} else {
				for(i =0; i<node_map[index].length; i++){
					createvehicle(node_map[index][i].time, node_map[index][i].path);
					vehicle_node_id++;

					/*
					var vehicle_detail = document.createElement('div');
					document.querySelector('#edit_plain_content').appendChild(vehicle_detail);
					vehicle_detail.className = 'vehicle';
					vehicle_detail.id = 'v' + node_map[index][i].id;
					vehicle_detail.textContent = "Vehicle " + parseInt(i + 1) + " : ";

					var vehicle_detail_time = document.createElement('INPUT');
					vehicle_detail.appendChild(vehicle_detail_time);
					vehicle_detail_delete.setAttribute("id", "vt" + node_map[index][i].id);
					vehicle_detail_delete.setAttribute("type", "number");
					vehicle_detail_delete.setAttribute("class", "vehicle-time");

					var vehicle_detail_delete = document.createElement('INPUT');
					vehicle_detail.appendChild(vehicle_detail_delete);
					vehicle_detail_delete.setAttribute("id", "vd" + node_map[index][i].id);
					vehicle_detail_delete.setAttribute("type", "image");
					vehicle_detail_delete.setAttribute("class", "vehicle-delete");
					vehicle_detail_delete.setAttribute("src", "images/delete-button.jfif");
					*/
				}
			}

			// for(i = 0; i < node_map[index].length; i++){
			// 	var vec_detail = document.createElement('div');
			// 	edit_plain_content.appendChild(vec_detail);

			// }
		} else if(element.id.slice(0, 1) == 'l'){
			editing_line = 1;
			var index = deleting_line_index_func(parseInt(element.id.slice(1)));
			var line_length = document.createElement('div');
			edit_plain_content.appendChild(line_length);
			line_length.textContent = "Length : ";
			line_length.className = "lc" + element.id.slice(1);
			line_length.id = "li" + element.id.slice(1);

			var line_length_input = document.createElement('INPUT');
			line_length.appendChild(line_length_input);
			// line_length_input.setAttribute("id", "llii" + element.id.slice(1));
			line_length_input.setAttribute("id", "llii" + element.id.slice(1));
			line_length_input.setAttribute("type", "number");
			line_length_input.setAttribute("class", "llic");
			line_length_input.setAttribute("min", 1);
			line_length_input.setAttribute("value", line_map[index][2]);

			// document.getElementById('edit-plain-plus').style.visibility = 'collapse';
		}
	}
}

var mode_info_button_clicked = function(event){
	if(mode_info_state == 0){
		document.querySelector("#mode-info-button").textContent = "<<";
		document.querySelector("#mode-info-dialogue").style.display = 'block';
		mode_info_state = 1;
	} else {
		document.querySelector("#mode-info-button").textContent = ">>";
		document.querySelector("#mode-info-dialogue").style.display = 'none';
		mode_info_state = 0;		
	}
}

var information_info_button_clicked = function(event){
	if(information_info_state == 0){
		document.querySelector("#information-info-button").textContent = "<<";
		document.querySelector("#information-info-dialogue").style.display = 'block';
		information_info_state = 1;
	} else {
		document.querySelector("#information-info-button").textContent = ">>";
		document.querySelector("#information-info-dialogue").style.display = 'none';
		information_info_state = 0;		
	}
}

var node_plain_loose = function(event){
	var element = document.getElementById(event.target.id);
	// console.log(element.style.left + '--' + element.style.top + ' :: ' + event.clientX + ' - - - - ' + event.clientY);
	// console.log(event.clientX + ' - - - - ' + event.clientY);
	
	if(connect_active){
		// console.log(element.className);
		var pressed_node_index = deleting_node_index_func(parseInt(pressed_node.id.slice(1, pressed_node.id.length)));
		var loose_node_index = deleting_node_index_func(parseInt(element.id.slice(1, element.id.length)));

		// console.log(pressed_node_index + ' - ' + loose_node_index);

		if(element.className == 'node' && element != pressed_node
			&& window.$map[pressed_node_index][loose_node_index] == undefined
			&& window.$map[loose_node_index][pressed_node_index] == undefined){
			var posx = element.style.left;
			var posy = element.style.top;

			posx = parseInt(posx.slice(0, posx.length - 2)) + 25;
			posy = parseInt(posy.slice(0, posy.length - 2)) + 25;

			cur_line.setAttribute('x2', posx);
			cur_line.setAttribute('y2', posy);
			
			window.$map[pressed_node_index][loose_node_index] = cur_line.id;
			window.$map[loose_node_index][pressed_node_index] = cur_line.id;
			line_map.push([pressed_node.id, element.id, 1]);
			deleting_line_arr.push(0);
		}else{
			cur_line.parentNode.removeChild(cur_line);
			line_id--;
		}
		pointer_event_visible('line');
		connect_active = false;
	}
}

// var enter = function(event){
// 	document.getElementById('information-info-dialogue').textContent = "";
// }

// var out = function(event){
// 	document.getElementById('information-info-dialogue').textContent = "hover over an element";
// }

var createvehicle = function(time, path){	
	var edit_plain_content = document.getElementById("edit-plain-content");
	if(edit_plain_content == undefined){
		// edit_plain_content.parentNode.removeChild(edit_plain_content);
		edit_plain_content = document.createElement('div');
		edit_plain.appendChild(edit_plain_content);
		edit_plain_content.id = 'edit-plain-content';
	}

	var vehicle_detail = document.createElement('div');
	document.querySelector('#edit-plain-content').appendChild(vehicle_detail);
	vehicle_detail.className = 'vehicle-detail';
	vehicle_detail.id = 'v' + vehicle_node_id;
	vehicle_detail.textContent = "Vehicle " + parseInt(i + 1) + " : ";

	var vehicle_detail_time = document.createElement('INPUT');
	vehicle_detail.appendChild(vehicle_detail_time);
	vehicle_detail_time.setAttribute("id", "vt" + vehicle_node_id);
	vehicle_detail_time.setAttribute("type", "number");
	vehicle_detail_time.setAttribute("class", "vehicle-time");
	vehicle_detail_time.setAttribute("min", 0);
	vehicle_detail_time.setAttribute("value", time);
	// vehicle_detail_time.addEventListener("click", vehicle_detail_time_clicked);

	var vehicle_detail_delete = document.createElement('INPUT');
	vehicle_detail.appendChild(vehicle_detail_delete);
	vehicle_detail_delete.setAttribute("id", "vd" + vehicle_node_id);
	vehicle_detail_delete.setAttribute("type", "image");
	vehicle_detail_delete.setAttribute("class", "vehicle-delete");
	vehicle_detail_delete.setAttribute("src", "images/delete-button.jfif");
	vehicle_detail_delete.addEventListener("click", vehicle_detail_delete_clicked);

	var vehicle_path = document.createElement('div');
	document.querySelector('#edit-plain-content').appendChild(vehicle_path);
	vehicle_path.id = 'vp' + vehicle_node_id;
	vehicle_path.className = 'vehicle-path';
	vehicle_path.textContent = "Path : ";
	
	var vehicle_path_input = document.createElement('INPUT');
	vehicle_path.appendChild(vehicle_path_input);
	vehicle_path_input.setAttribute("id", "vpi" + vehicle_node_id);
	vehicle_path_input.setAttribute("type", "text");
	vehicle_path_input.setAttribute("class", "vehicle-path-input");
	vehicle_path_input.setAttribute("value", path);
	// vehicle_path_input.addEventListener("click", vehicle_path_input_clicked);
}

var vehicle_detail_delete_clicked = function(event){
	var vehicle_delete_button = document.getElementById(event.target.id);

	var vehicle_path_input_button = document.getElementById('vp' + vehicle_delete_button.id.slice(2));
	var vehicle_detail = document.getElementById('v' + vehicle_delete_button.id.slice(2));
	
	vehicle_path_input_button.parentNode.removeChild(vehicle_path_input_button);
	vehicle_detail.parentNode.removeChild(vehicle_detail);
	// vehicle_node_id--;
	// element_delete_button.parentNode.removeChild(element);
}

var edit_plain_exit = function(event){
	var edit_plain_content = document.getElementById("edit-plain-content");
	edit_plain_content.parentNode.removeChild(edit_plain_content);
	document.getElementById("edit-plain").style.visibility = 'collapse';
	vehicle_node_id = 0;
}

var edit_plain_plus = function(event){
	if(editing_line == 0){
		if(document.getElementById('edit-plain-content').textContent == "Click on plus button to add vehicles"){
			document.getElementById('edit-plain-content').textContent = "";
		}
		createvehicle(0, clicked_element.id.slice(1));
		vehicle_node_id++;
	}
}

var edit_plain_save = function(event){
	// console.log(clicked_element);
	if(editing_line == 1){    // LINE CLICKED
		editing_line = 0;

		var index = deleting_line_index_func(parseInt(document.querySelector(".llic").id.slice(4)));
		// console.log(index);
		line_map[index][2] = parseInt(document.querySelector('.llic').value);
	} else {																	// NODE CLICKED
		var index = deleting_node_index_func(parseInt(clicked_element.id.slice(1)));

		node_map[index] = [];
		for(i = 0; i < vehicle_node_id; i++){
			if(document.getElementById('vt' + i) == undefined){
				continue;
			}
			node_map[index].push({'time':document.getElementById('vt' + i).value, 'path':document.getElementById('vpi' + i).value});
			// node_map[index][i].path = document.getElementById('vpi' + i).value;
		}
	}
	edit_plain_exit();
}


document.querySelector("#node-plain").addEventListener("click", newnode);
document.querySelector("#node-plain").addEventListener("mousemove", drag);
document.querySelector("#node-plain").addEventListener("mouseup", node_plain_loose);
document.querySelector("#mode-info-button").addEventListener("click", mode_info_button_clicked);
document.querySelector("#information-info-button").addEventListener("click", information_info_button_clicked);
// document.querySelector("#information-info-button").addEventListener("mouseenter", enter);
// document.querySelector("#information-info-button").addEventListener("mouseleave", out);
document.querySelector("#edit-plain-exit").addEventListener("click", edit_plain_exit);
document.querySelector("#edit-plain-plus").addEventListener("click", edit_plain_plus);
document.querySelector("#edit-plain-save").addEventListener("click", edit_plain_save);