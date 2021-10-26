// var rotate360 = 2;
// var transXY = (target)=>{
//     target.style.left = parseInt(imgObj.style.left) + 10 + 'px';
//     target.style.top = parseInt(imgObj.style.top) + 10 + 'px';
// }
// var print = ()=>{
//     console.log("hello");
// }
// let start = Date.now();
// var posx=0;
// var move = setInterval(()=>{
//     let timePassed = Date.now() - start;
//     posx++;
//     document.getElementById("test").style.left = posx + 'px';

//     if (timePassed >= 2000) {
//         clearInterval(move); // finish the animation after 2 seconds
//         return;
//     }
// }, 10);
// var move2 = setInterval(()=>{
//     let timePassed2 = Date.now() - start;
//     posx++;
//     document.getElementById("tbut").style.left = posx + 'px';

//     if (timePassed2 >= 2000) {
//         clearInterval(move2); // finish the animation after 2 seconds
//         return;
//     }
// }, 10);

// var myMove = function (event) {
//     /*
//     document.getElementById("test").animate([
//         // keyframes
//         // { transform: 'translateY(0px)' },
//         // { transform: 'translateY(300px)',transform: 'rotate(360deg)' }
//         // {backgroundColor:"red"}
//         // {textContent:"yeah"}
//         { transform: 'rotate(360deg)' }
//         // {'-webkit-transform' : 'rotate(360deg)'}
//     ], {
//         // timing options
//         duration: 1000,
//         iterations: 10
//     });
//     */

//     document.getElementById("test").animate([
//         {
//             // opacity: 0.25,
//             transform: 'translateY(-300px)',
            
//             // left: "+=50",
//             // height: "toggle"
//         }/*,{
//             transform: 'translateX(-300px)',
//         }*/
//     ], {
//         // timing options
//         duration: 1000,
//         iterations: 10
//     },()=> {
//         document.getElementById("test").style.left = '50px';
//         document.getElementById("test").style.top = '50px';
//     });
// }

// var cMove = function (event) {
//     console.log(event.target);
// }

// document.querySelector("#tbut").addEventListener("click", myMove);
// document.querySelector("#rbut").addEventListener("click", cMove);