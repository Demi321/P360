/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//const btnToggle = document.querySelector('.toggle-btn');
//
//
//btnToggle.addEventListener('click', function () {
//
//  document.getElementById('sidebar').classList.toggle('active');
//
//});
if($(".toggle-btn").length){
    var btnToggle = document.querySelector('.toggle-btn');


    btnToggle.addEventListener('click', function () {

        document.getElementById('sidebar').classList.toggle('active');

    });
}
