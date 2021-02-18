/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var init_archivo = (json) => {
    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;
};

var allFolders = $(".archivo .directory-list li > ul");
allFolders.each(function() {

    // add the folder class to the parent <li>
    var folderAndName = $(this).parent();
    folderAndName.addClass("folder");

    // backup this inner <ul>
    var backupOfThisFolder = $(this);
    // then delete it
    $(this).remove();
    // add an <a> tag to whats left ie. the folder name
    folderAndName.wrapInner("<a href='#' />");
    // then put the inner <ul> back
    folderAndName.append(backupOfThisFolder);

    // now add a slideToggle to the <a> we just added
    folderAndName.find("a").click(function(e) {
        $(this).siblings("ul").slideToggle("slow");
        e.preventDefault();
    });

});