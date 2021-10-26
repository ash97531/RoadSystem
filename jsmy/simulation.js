let V = 9;
var map_d=[];
var vec_ = [];

function minDistance(dist,sptSet)
{
     
    // Initialize min value
    let min = Number.MAX_VALUE;
    let min_index = -1;
     
    for(let v = 0; v < V; v++)
    {
        if (sptSet[v] == false && vec_[v].length <= min)
        {
            min = vec_[v].length;
            min_index = v;
        }
    }
    return min_index;
}
 
// A utility function to print
// the constructed distance array
function printSolution(vec_)
{
    console.log("Vertex \t\t Distance from Source<br>");
    for(let i = 0; i < V; i++)
    {
        console.log(i + " \t\t " +
                 vec_[i].length + "<br>");
    }
    console.log(deleting_node_arr);
}
 
// Function that implements Dijkstra's
// single source shortest path algorithm
// for a graph represented using adjacency
// matrix representation
function dijkstra(graph, src)
{
    // let vec_ = new Array(V);
    let sptSet = new Array(V);
    vec_ = [];
    console.log(vec_);
     
    // Initialize all distances as
    // INFINITE and stpSet[] as false
    for(let i = 0; i < V; i++)
    {
        vec_[i] = {};
        vec_[i].length = Number.MAX_VALUE;
        sptSet[i] = false;
    }
    console.log(vec_);
     
    // Distance of source vertex
    // from itself is always 0
    vec_[src].length = 0;
    vec_[src].path = "(n" + src + ")";
     
    // Find shortest path for all vertices
    for(let count = 0; count < V - 1; count++)
    {
         
        // Pick the minimum distance vertex
        // from the set of vertices not yet
        // processed. u is always equal to
        // src in first iteration.
        let u = minDistance(vec_, sptSet);
         
        // Mark the picked vertex as processed
        sptSet[u] = true;
         
        // Update dist value of the adjacent
        // vertices of the picked vertex.
        for(let v = 0; v < V; v++)
        {
             
            // Update dist[v] only if is not in
            // sptSet, there is an edge from u
            // to v, and total weight of path
            // from src to v through u is smaller
            // than current value of dist[v]
            if (!sptSet[v] && graph[u][v] != 0 &&
                   vec_[u].length != Number.MAX_VALUE &&
                   vec_[u].length + graph[u][v] < vec_[v].length)
            {
                vec_[v].length = vec_[u].length + graph[u][v];
                // console.log("count-"+count+", u-"+u+", v-"+v);
                vec_[v].path = vec_[u].path + "(n" + Number(v + deleting_node_arr[v]) +")";
                
                // console.log(vec_[v]);
                // console.log(vec_[u]);

            }
        }
    }
     
    // Print the constructed distance array
    printSolution(vec_);
    // console.log(vec_);
}

/* 
var minDistance = function(dist,sptSet)
{
    let min = Number.MAX_VALUE;
    let min_index = -1;
     
    for(let v = 0; v < V; v++)
    {
        if (sptSet[v] == false && dist[v].length <= min)
        {
            min = dist[v].length;
            min_index = v;
        }
    }
    return min_index;
}
 
var printSolution = function(dist)
{
    console.log("Vertex \t\t Distance from Source<br>");
    for(let i = 0; i < V; i++)
    {
        console.log(i + " \t\t " +
                 dist[i].length + "<br>");
    }
    // console.log(dist);
}
 

function dijkstra(graph, src)
{
    // console.log(dist);
    let dist = new Array(V);
    let sptSet = new Array(V);
    console.log(dist);
     
    for(let i = 0; i < V; i++)
    {
        dist[i] = {"length" : Number.MAX_VALUE , "path" : []};
        console.log(dist);
        sptSet[i] = false;
    }
     
    dist[src].length = 0;
    dist[src].path.push('n' + src);
     
    for(let count = 0; count < V - 1; count++)
    {
        let u = minDistance(dist, sptSet);
        sptSet[u] = true;
        // console.log(dist);
         
        for(let v = 0; v < V; v++)
        {
            if (!sptSet[v] && graph[u][v] != 0 &&
                   dist[u].length != Number.MAX_VALUE &&
                   dist[u].length + graph[u][v] < dist[v].length)
            {
                dist[v].length = dist[u].length + graph[u][v];
                dist[v].path =[];
                dist[v].path = dist[u].path;
                dist[v].path.push('n' + v);
            }
        }
    }
     
    printSolution(dist);
}
*/
 
var play_button_clicked = function(event){
    map_d=[];
	for(h=0; h<map.length; h++){
        map_d.push([]);
		for(k=0; k<map.length; k++){
			if(map[h][k] != undefined){
				var index = deleting_line_index_func(parseInt(map[h][k].slice(1)));
				// console.log(index);
				// map_d[h][k] = line_map[index][2];
                map_d[h].push(line_map[index][2]);
			} else{
                // map_d[h][k] = 0;
                map_d[h].push(0);
            }
		}
	}
    V = map_d.length;
    dijkstra(map_d, 0);
}

var id = null;
/*
function myMove(event) {

    var elem = document.getElementById("test");
    var posx = elem.style.left;
    var posy = elem.style.top;
    var color = true;
    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {

        setTimeout(function(){}, 0.5);

        if (posx == 600 || posy == 600) {
            clearInterval(id);
        } else {
            if(color){
                elem.style.backgroundColor = "chocolate";
                color = false;
            }else{
                elem.style.backgroundColor = "blueviolet";
                color = true;
            }
            posx++;
            posy++;
            elem.style.top = posy + 'px';
            elem.style.left = posx + 'px';
        }
    }
}
*/

var myMove = function(event){
    document.getElementById("test").animate([
        // keyframes
        // { transform: 'translateY(0px)' },
        // { transform: 'translateY(300px)',transform: 'rotate(360deg)' }
        // {backgroundColor:"red"}
        // {textContent:"yeah"}
        { transform: 'rotate(360deg)' }
        // {'-webkit-transform' : 'rotate(360deg)'}
      ], {
        // timing options
        duration: 1000,
        iterations: 10
      });
      
    document.getElementById("test").animate([
        // keyframes
        // { transform: 'translateY(0px)' },
        { transform: 'translateY(300px)' }
        // {backgroundColor:"red"}
        // {textContent:"yeah"}
        // { transform: 'rotate(360deg)' }
        // {'-webkit-transform' : 'rotate(360deg)'}
      ], {
        // timing options
        duration: 1000,
        iterations: 10
      });
}

var cMove = function(event){
    console.log(event.target);
}

document.querySelector("#animation-plain-button").addEventListener("click", play_button_clicked);
// document.querySelector("#tbut").addEventListener("click", myMove);
// document.querySelector("#rbut").addEventListener("click", cMove);