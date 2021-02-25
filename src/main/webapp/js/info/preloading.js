/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
            noop = function () {},
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

    function iterateIP(ip) {
        if (!localIPs[ip])
            onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0)
                return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex))
            return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// Usage

getUserIP(function (ip) {
    verificar_ip_local(ip);

});

function verificar_ip_local(ip) {
    var data = JSON.parse(document.getElementById("ip_publica").innerHTML);
    var vista = document.getElementById("vista").value;
   
    document.getElementById("title").innerHTML = "Validando IP publica: " + data.ip_publica + " e IP local: " + ip;
    data.ip_local = ip;
    data.vista = vista;
    return Promise.resolve($.ajax({
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/Validar_ip_local',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data
                ),
        success: function (response) {

           
            var hostdir = window.location.protocol + "//" + window.location.host;
            var path = hostdir + "/" + DEPENDENCIA + "/valido/" + data.vista + "/" + response.token;
            window.location.replace(path);


        },
        error: function (err) {
            console.error("IP Local no tiene permiso para acceder a la plataforma");
            setTimeout(function () {
                var animatedCircles = document.getElementsByClassName("animatedCircle");
                Array.prototype.forEach.call(animatedCircles, function (animatedCircle) {
                    animatedCircle.style = "animation-play-state:paused";
                    
                });
                document.getElementById("title").innerHTML = "ALERTA:  La IP local: " + ip + " no tene permiso para acceder a la plataforma ";
                document.getElementById("title").style = "font: 25px Arial bolder; color:#ff8200;";
            }, 1500);

            var d = new Date();
            d.setTime(d.getTime() - (1 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = "username_v3.2_" + DEPENDENCIA + "=" + "value" + ";" + expires + ";path=/";
            //window.location.reload();

        }
    }));
}