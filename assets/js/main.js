var meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Septiembre" ];
var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ];
var iframe = '<iframe class="embed-responsive-item"<iframe class="" src="https://www.youtube.com/embed/NDIPDxbahU8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    hoy = new Date(),
    urlReunion = "",
    diaReunion = dias.indexOf("Martes"),
    fechaReunion = new Date("Oct 1 2019 20:00:00 GMT-0300");

function calcProxDia(d, x){
    var now = new Date(d.getTime());
    now.setHours(horaReunion.h, horaReunion.m, 0, 0);
    now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
    now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000 /* convert to UTC */ - (/* UTC-3 */ 3) * 60 * 60 * 1000);
    return now;
}

function duracionTexto(duracion) {
  var out = "";
  if(duracion / 60 == 1) {
    out += "1 hora.";
  } else if(duracion / 60 < 1) {
      out += duracion + " minutos.";
  } else {
      if(Math.trunc(duracion / 60) > 1) {
          out += Math.trunc(duracion / 60) + " horas";
      } else {
          out += "1 hora";
      }
      if(duracion / 60 % 1 > 0) {
          out += Math.round(duracion / 60 % 1 * 60) + " minutos.";
      } else {
          out += ".";
      }
  }
  return out;
}

var proxReunion = fechaReunion;

var countDown = proxReunion.getTime(),
x = setInterval(function () {
    var now = new Date().getTime(),
        distance = countDown - now;

    var dias = Math.floor(distance / (day));
    document.getElementById('dias').innerText = ("0" + dias).slice(-2);
    var horas = Math.floor((distance % (day)) / (hour));
    document.getElementById('horas').innerText = ("0" + horas).slice(-2);
    var mins = Math.floor((distance % (hour)) / (minute));
    document.getElementById('minutos').innerText = ("0" + mins).slice(-2);
    var segs = Math.floor((distance % (minute)) / second);
    document.getElementById('segundos').innerText = ("0" + segs).slice(-2);

    if (distance <= 0 || document.stopTimer === true) {
        clearInterval(x);
        document.querySelector(".notice").innerHTML = "Recibí los mejores momentos en tu email luego que termine:";
        document.querySelector('#timerWrapper').outerHTML = '<h2>Debate Presidencial XL</h2>';
        document.querySelector('#calendar').remove();
        var leftColumn = document.querySelector('.backg');
        leftColumn.classList.remove('backg');
        leftColumn.innerHTML = '<div class="embed-responsive embed-responsive-16by9">' + iframe + '</div>';
        var mobImg = document.querySelector(".mob-img");
        mobImg.outerHTML = '<div class="embed-responsive embed-responsive-16by9 mb-3 d-block d-lg-none">' + iframe + '</div>';
    }
}, second);

document.getElementById('enviar_info').addEventListener('click', function() {
    $.ajax({
        method: "post",
        url: "https://info.partidodigital.org.uy/form/submit?formId=14&ajax=true",
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        dataType: "json",
        data: $.param({
            "mauticform[email]": $("[name=email]").val(),
            "mauticform[submit]": 1,
            "mauticform[formId]": 14,
            "mauticform[formName]": "debatesuy",
            "mauticform[return]": ""
    }),
    beforeSend: function () {
        if ($("[name=email]").val() === "") {
            $("#enviar_info")
                .attr("disabled", true)
                .addClass("error")
                .html("Algún campo está vacío. Intentalo de nuevo.");
            setTimeout(function () {
                $("#enviar_info")
                    .attr("disabled", false)
                    .removeClass("error")
                    .html("Enviar");
            }, 5000);
            return false;
        }
        $("#enviar_info")
            .attr("disabled", true)
            .html("Enviando...");
    },
    success: function () {
        $("#enviar_info")
            .attr("disabled", true)
            .html("Datos enviados");
        setTimeout(function () {
            $("[name=email]").val("")
            $("#enviar_info")
                .attr("disabled", false)
                .html("Enviar");
        }, 2000);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        $("#enviar_info")
            .attr("disabled", true)
            .html("Hubo un error. Prueba de nuevo.");
        setTimeout(function () {
            $("#enviar_info")
                .attr("disabled", false)
                .html("Enviar");
        }, 5000);
    }
    });
});