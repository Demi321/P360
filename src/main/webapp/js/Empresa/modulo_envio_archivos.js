/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
agregar_menu("Envio de Archivos", '<i class="fas fa-file"></i>', 'Trabajo');


var drop = $("input");
drop.on('dragenter', function (e) {
    $(".drop").css({
        "border": "4px dashed #09f",
        "background": "rgba(0, 153, 255, .05)"
    });
    $(".cont").css({
        "color": "#09f"
    });
}).on('dragleave dragend mouseout drop', function (e) {
    $(".drop").css({
        "border": "3px dashed #DADFE3",
        "background": "transparent"
    });
    $(".cont").css({
        "color": "#8E99A5"
    });
});



function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    console.log(files);
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                    '" title="', escape(theFile.name), '"/>'].join('');
                document.getElementById('list_files').insertBefore(span, null);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

$('#files').change(handleFileSelect);


$("#enviar_nuevo_archivo").click(() => {
    $("#files_shared").addClass("d-none");
    $("#share_files").removeClass("d-none");
});

$('#send_files_form').on('reset', function (e)
{
    $("#files_shared").removeClass("d-none");
    $("#share_files").addClass("d-none");
});
$('#send_files_form').submit((e)=>{
    e.preventDefault();
    console.log(buildJSON_Section("send_files_form"));
});