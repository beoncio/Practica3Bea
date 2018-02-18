function nuevoTipo()
{
    $.ajax({
        url:"/tipos",
        type:"POST",
        data: JSON.stringify({nombre: $("#nombre").val()}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data) {
            if (data.error) {
                $("#nuevoError").css('display', 'block');
                $("#nuevoOK").css('display', 'none');
            } else {
                $("#nuevoError").css('display', 'none');
                $("#nuevoOK").css('display', 'block');
            }
        }
    });
}

function borrar($id)
{
    $.ajax(
        {
            url:"/inmuebles/" + $id, 
            type: "DELETE",
            data: JSON.stringify({}),
            contentType:"aplication/json; charset=utf-8",
            dataType: "json",
            success: () => {
                document.location.href="/inmuebles";
            }
        }
    );
}