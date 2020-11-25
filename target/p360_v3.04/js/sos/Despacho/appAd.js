/* global OT, Promise, DEPENDENCIA, TIMETORETURNACALL, DEPENDENCIA_BASE, WebSocketGeneral */


var Llamadas = new Array;
for (var i = 0; i < CardV; i++) {
    InsertarCardVacia(i);
}
function tarjeta(llamada) {


    EliminarCard(llamada.RegistroLlamada.idLlamada);
    if (cards < CardV) {
        initializeSession(llamada);
    } else {
        for (var i = 0; i < Llamadas.length; i++) {
            if (Llamadas[i].RegistroLlamada.idLlamada === llamada.RegistroLlamada.idLlamada) {
                Llamadas.splice(i, 1);
            }
        }
        Llamadas.push(llamada);


    }
}
function initializeSession(llamada) {
    var connectionCount = 0;
    var llamadaAtendida = false;
    var UsuarioConectado = false;

    var session = OT.initSession(llamada.Credenciales.apikey, llamada.Credenciales.sesion);
    setTimeout(function () {


    }, 15000);
    session.on({
        connectionCreated: function (event) {

            connectionCount++;


            if (event.connection.id === llamada.RegistroLlamada.connectionid) {

                UsuarioConectado = true;

            }
        },
        connectionDestroyed: function (event) {

            connectionCount--;





            if (llamada.RegistroLlamada.connectionid === event.connection.connectionId)
            {

                UsuarioConectado = false;
//                var json = {};
//                json.EliminarLlamada = true;
//                json.idLlamada = llamada.RegistroLlamada.idLlamada;
//                EnviarMensajePorSocket(json);
                ColocarImg(llamada.RegistroLlamada.idLlamada, llamada.Usuarios_Movil.img);
                document.getElementById("H" + llamada.RegistroLlamada.idLlamada).style.background = "#bb6262";
                session.disconnect();

            }
            if (connectionCount === 1)
            {
                session.disconnect();
            }

        },
        sessionConnected: function (event) {

        },
        sessionDisconnected: function (event) {
            console.error('You were disconnected from the session.', event.reason);

        },
        sessionReconnected: function (event) {

        },
        sessionReconnecting: function (event) {

        },
        streamCreated: function (event) {


            if (event.stream.connection.connectionId === llamada.RegistroLlamada.connectionid) {
                agregarVideoCard(session, event.stream, llamada);

                $("#terminarsesion" + llamada.RegistroLlamada.idLlamada).click(function () {
                    EliminarCard(llamada.RegistroLlamada.idLlamada);
                    setTimeout(function () {
                        if (!llamadaAtendida && UsuarioConectado)
                        {


                            InsertarCard(llamada);
                            if (llamada.Modo.id !== "10" && llamada.Modo.id !== "11" && llamada.Modo.id !== "101") {
                                agregarVideoCard(session, event.stream, llamada);
                            } else {
                                InsertarCard(llamada);
                            }
                        } else {

                            session.disconnect();
                        }
                    }, TIMETORETURNACALL);
                });



            } else {


                ///Agregar del lado de los publicadores....
                //agregarStreamOperador(session, event.stream);
            }

        },
        streamDestroyed: function (event) {


        },
        signal: function (event) {


            if (event.type === "signal:Operador" + DEPENDENCIA) {

                if (event.from.connectionId !== session.connection.connectionId) {

                    document.getElementById("H" + llamada.RegistroLlamada.idLlamada).style.background = "#b1b1b1";
                    document.getElementById("HPL" + llamada.RegistroLlamada.idLlamada).style.color = "#1b212d";
                    document.getElementById("HPM" + llamada.RegistroLlamada.idLlamada).style.color = "#1b212d";
                    document.getElementById("HPD" + llamada.RegistroLlamada.idLlamada).style.color = "#1b212d";
                    session.disconnect();
                    llamadaAtendida = true;
                    EliminarCard(llamada.RegistroLlamada.idLlamada);

                }

            }

        }

    });




    // Connect to the session
    session.connect(llamada.Credenciales.token, function callback(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
        } else {
            console.error('There was an error connecting to the session: ', error.name, error.message);
        }
    });

}
WebSocketGeneral.onmessage = function (message) {
    var mensaje = JSON.parse(message.data);
    //console.log(mensaje);
    if (mensaje.inicializacionSG) {
        idSocketOperador = mensaje.idSocket;
        solicitarBackupLlamadas();
    }
    if (mensaje.llamadaSOSAltaPrioridad) {
        var jsn = {
            "h_recepcion": getFecha() + " " + getHora()
        };

        var llamada = mensaje;
        llamada.RegistroLlamada.time = jsn;
        tarjeta(llamada);
    }
    if (mensaje.llamadaSOS) {
        var jsn = {
            "h_recepcion": getFecha() + " " + getHora()
        };

        var llamada = mensaje;
        llamada.RegistroLlamada.time = jsn;
        tarjeta(llamada);
    }
    if (mensaje.eliminarcard) {
        $("#terminarsesion" + mensaje.idLlamada).click();
    }
    if (mensaje.reporteelemento) {
        if (mensaje.Nuevo === true) {
            NotificarReporte();
        }
    }
    if (!TamBackup) {
        var tam = {
            "Tam": true,
            "TamBackup": "TamBackup"
        };
        EnviarMensajePorSocket(tam);
        TamBackup = true;
    }
    if (mensaje.Tam) {
        tamBackup(mensaje);
    }
    if (mensaje.Elimina) {
        modificaTamBackup();
    }
    if (mensaje.agrega_cards) {
        agrega_cards(mensaje.info);
    }
};


function NotificarReporte() {
    $(document).ready(function () {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
        Toast.fire({
            type: 'info',
            title: 'Reporte Nuevo.'
        });

        $("div.swal2-container").attr("style", "margin-top: 3.5rem;margin-right: 1rem;");
        document.getElementById("swal2-content").style = "font:bold 12px Arial";
    });

    playAudio();

    var t = document.getElementById("TamBackup").textContent;
    console.log(t);
    if (t !== "") {
        t = parseInt(t);
        if (t > 99) {
            t = 99;
            document.getElementById("TamBackup").textContent = "+" + t;
            document.getElementById("TamBackup").style.display = "block";
        } else {
            t += 1;
            document.getElementById("TamBackup").textContent = t;
            document.getElementById("TamBackup").style.display = "block";
        }
    }else{
        document.getElementById("TamBackup").textContent = 1;
        document.getElementById("TamBackup").style.display = "block";
    }
}





function tamBackup(mensaje) {
    var t = parseInt(mensaje.TamBackup);
    if (t > 0) {
        $(document).ready(function () {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
            Toast.fire({
                type: 'info',
                title: 'Reporte Nuevo. <br>Tienes ' + t + ' reporte(s) sin resolver'
            });

            $("div.swal2-container").attr("style", "margin-top: 3.5rem;margin-right: 1rem;");
            document.getElementById("swal2-content").style = "font:bold 12px Arial";
        });
        playAudio();
        var tam = t;
        if (tam > 99) {
            tam = 99;
            document.getElementById("TamBackup").textContent = "+" + tam;
        } else {
            document.getElementById("TamBackup").textContent = tam;
        }
        document.getElementById("TamBackup").style.display = "unset";
    } else {
        document.getElementById("TamBackup").style.display = "none";
    }
}





function modificaTamBackup() {
    var tam = parseInt(document.getElementById("TamBackup").textContent);
    tam-=1;
    document.getElementById("TamBackup").textContent = tam;
    if (tam === 0) {
        document.getElementById("TamBackup").style.display = "none";
    }
}

function agrega_cards(cards){
    $.each(cards,function(i){
        var div1 = document.createElement("div");
        div1.className = "row col-12 mb-1 m-0 p-2";
        if (cards[i].modo_fin.nombre.includes("no")) {
            div1.style = "background:#bb6262; height:60px;";
        }else{
            div1.style = "background:#b1b1b1; height:60px;";
        }
        var div2 = document.createElement("div");
        div2.className = "row col-12 m-0";
        
        var div21 = document.createElement("div");
        div21.className = "col-8 m-0 pl-0";
        div21.style = "display: flex;align-items: center;";
        div21.innerHTML = cards[i].Nombre;
        var div22 = document.createElement("div");
        div22.className = "col-4 m-0";
        div22.style = "display: flex;align-items: center;";
        div22.innerHTML = cards[i].idUsuarios_Movil;        
        
        var div3 = document.createElement("div");
        div3.className = "row col-12 m-0";
        
        var div31 = document.createElement("div");
        div31.className = "col-6 m-0 pl-0 small";
        div31.style = "display: flex;align-items: center;";
        div31.innerHTML = cards[i].modo_llamada.nombre;
        var div32 = document.createElement("div");
        div32.className = "col-6 m-0 pl-0 small";
        div32.style = "display: flex;align-items: center;";
        div32.innerHTML = cards[i].fecha + " " + cards[i].hora;
        
        div2.appendChild(div21);
        div2.appendChild(div22);
        div3.appendChild(div31);
        div3.appendChild(div32);
        div1.appendChild(div2);
        div1.appendChild(div3);
        
        document.getElementById("HistoricoLlamadas").append(div1);
        
    });
}
