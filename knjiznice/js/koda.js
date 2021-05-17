var baza = 'jovanav25';
var baseUrl = 'https://teaching.lavbic.net/api/OIS/baza/' + baza + '/podatki/';


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */


function generirajPodatke(stPacienta) {

  var ehrID = osebe[stPacienta].ehrID;

  var podatki = {
    ime: osebe[stPacienta].ime,
    priimek: osebe[stPacienta].priimek,
    letoRojstva: osebe[stPacienta].letoRojstva,
    zdravnik: osebe[stPacienta].zdravnik,
    prvoCepDatum: osebe[stPacienta].prvoCepDatum,
    drugoCepDatum: osebe[stPacienta].drugoCepDatum,
    cepiloProizv: osebe[stPacienta].cepiloProizv,
    NU: osebe[stPacienta].NU
  };

  $.ajax({
    url: baseUrl + "azuriraj?kljuc=" + ehrID,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(podatki),
    success: function (data) {
      $("#kreirajSporocilo").html("<span class='obvestilo " +
          "label label-success fade-in'>Uspešno kreiran EHR '" +
          ehrID + "'.</span>");
    },
    error: function(err) {
      $("#kreirajSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka!</span>");
    }
  });


  return ehrID;
}


var osebe = {

  1:{
    ehrID: "5807d226-1c82-4f10-ae9a-43b460d2a90a",
    ime: "Alisa",
    priimek: "Novak",
    letoRojstva: "1999",
    prvoCepDatum: "2021-04-7",
    drugoCepDatum: "2021-04-28",
    cepiloProizv: "Comirnaty",
    zdravnik: "Ana Novak",
    //telesnaTemperatura: "38.5",
    NU: [{datumInUra:"2021-04-29", telesnaTemperatura: "38.1", nezeleniUcinki: "povišana telesna temperatura"}]
  },

  2:{
    ehrID: "54a6dd28-e357-4054-b363-c272b8b59449",
    ime: "Martin",
    priimek: "Novak",
    letoRojstva: "1975",
    prvoCepDatum: "2021-02-04",
    drugoCepDatum: "2021-02-25",
    cepiloProizv: "Moderna",
    zdravnik: "Leona Novak",
  //  telesnaTemperatura: "37.1",
    NU: [{datumInUra:"2021-02-28", telesnaTemperatura: "37.2", nezeleniUcinki: "vrtoglavica"}]
  },

  3:{
    ehrID: "10a6dd28-j100-1010-b363-c272b8b10449",
    ime: "Vesna",
    priimek: "Novak",
    letoRojstva: "1972",
    prvoCepDatum: "2021-01-05",
    drugoCepDatum: "2021-04-07",
    cepiloProizv: "AstraZeneca",
    zdravnik: "Sara Novak",
//    telesnaTemperatura: "37.9",
    NU: [{datumInUra:"2021-04-10", telesnaTemperatura: "38.2", nezeleniUcinki: "povišena telesna temperatura"}]
  }
};

function preberiEHRodOsebe(){

  var stOsebe = document.getElementById("preberiObstojeciEHRzaINFO").value;
  if(!stOsebe)
    alert("Kliknite na generiranje podatkov in potem izberite osebo.");
  else {
    var ehrID = osebe[stOsebe].ehrID;
    var podatkioNU = "";

    $.ajax({
      url: baseUrl + "vrni/" + ehrID + "|" + "NU",
      type: "GET",
      async: false,
      success: function (podatki) {
        podatki.forEach(podatek => {
          podatkioNU += podatek.datumInUra + " => " + podatek.nezeleniUcinki
              + " (telesna temperatura: " + podatek.telesnaTemperatura + " °C);" + "\n";
        });
      },
      error: function (err) {
        console.log("napaka");
      }
    });

    console.log(podatkioNU);

    $.ajax({
      url: baseUrl + "vrni/" + ehrID,
      type: "GET",
      async: false,
      success: function (podatki) {
        $("#preberiSporocilozaINFO").html("<div class='alert alert-primary' role='alert'> " +
            "<b>ehrID: </b>" + ehrID +
            "<br> <b>ime: </b>" + podatki.ime +
            "<br> <b>priimek: </b>" + podatki.priimek +
            "<br> <b>osebni zdravnik: </b>" + podatki.zdravnik +
            "<br> <b>leto rojstva: </b>" + podatki.letoRojstva +
            "<br> <b>datum cepljenja s 1. odmerkom: </b>" + podatki.prvoCepDatum +
            "<br> <b>datum cepljenja s 2. odmerkom: </b>" + podatki.drugoCepDatum +
            "<br> <b>cepilo proizvajalca: </b>" + podatki.cepiloProizv +
            "<br> <b>neželeni učinki: </b>" + podatkioNU +
            "</div>");
      },
      error: function (err) {
        $("#preberiSporocilozaINFO").html("<span class='obvestilo label " +
            "label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).opis + "'!");
      }
    });
  }

}


var procenat = 0;
function pridobiPodatke(){
  var dataPoints = [];
  var stevilo1Cep = 0, stevilo2Cep = 0;
  $.ajax({
    url: 'https://api.sledilnik.org/api/summary',
    type: "GET",
    async: false,
    success: function (podatki) {
     stevilo1Cep = podatki.vaccinationSummary.value;
     stevilo2Cep = podatki.vaccinationSummary.subValues.in;
     procenat = Number(podatki.vaccinationSummary.subValues.percent);
     console.log("Procenat je " + procenat);
     dataPoints.push({ label: "s 1. odmerkom",  x: 1, y: stevilo1Cep});
     dataPoints.push({ label: "s 2. odmerkom",  x: 2, y: stevilo2Cep});
     console.log(stevilo1Cep + " " + stevilo2Cep);
    },
    error: function(err){
      setTimeout(pridobiPodatke(), 100000);
    }
  });
  return dataPoints;
}

function nacrtajGraf(){

  var dataPoints = pridobiPodatke();
  var chart = new CanvasJS.Chart("chartContainer", {
    title:{
      text: "Cepljenje proti COVID-19",
      fontSize: 25,
    },
    subtitles: [{
      text: "Delež cepljenih v Sloveniji proti COVID-19 (s 1 odmerkom): " + procenat + "%.",
      fontSize: 15
    }],
    axisX: {
      //title: "Proizvajalec cepiva",
      //titleFontSize: 20,
      //labelAngle: -30,
      labelFontSize: 10,
      labelFontFamily: "tahoma"

    },
    axisY: {
      title: "Število cepljenih oseb",
      maximum: 700000,
      minimum: 0,
      titleFontSize: 15,
      titleFontFamily: "tahoma",
      labelFontFamily: "tahoma",
      labelFontSize: 10
    },

    data:[{
      type: "column",
      indexLabel: "{y}",
      indexLabelPlacement: "outside",
      indexLabelOrientation: "horizontal",
      dataPoints: dataPoints
    }]
  });
  chart.render();
}

function dodajNezeleneUcinke() {
  var ehrID = $("#dodajEHR").val();
  var datumInUra = $("#dodajDatumInUra").val();
  var zdravnik = $("#dodajZdravnik").val();
  var telesnaTemperatura = $("#dodajTelesnaTemperatura").val();
  var nezeleniUcinki = $("#dodajNezeleneUcinke").val();

  if (!ehrID || ehrID.trim().length == 0 ||
      !datumInUra || datumInUra.trim().length == 0 ||
      !zdravnik || zdravnik.trim().length == 0 ||
      !telesnaTemperatura || telesnaTemperatura.trim().length == 0 ||
      !nezeleniUcinki || nezeleniUcinki.trim().length == 0
  ) {
    $("#dodajNezeleneUcinkeSporocilo").html("<span class='obvestilo " +
        "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
  } else {
    var podatki = {
        datumInUra: datumInUra,
        telesnaTemperatura: telesnaTemperatura,
        nezeleniUcinki: nezeleniUcinki
    };

    $.ajax({
      url: baseUrl + "azuriraj?kljuc=" + ehrID +  "|" + "NU"+ "&elementTabele=true",
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(podatki),
      success: function (odgovor) {
        $("#dodajNezeleneUcinkeSporocilo").html(
            "<span class='obvestilo label label-success fade-in'>" +
            "Neželeni učinki po cepljenju za osebo " + ehrID + " so uspešno dodani" + ".</span>");
      },
      error: function(err) {
        $("#dodajNezeleneUcinkeSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka!</span>");
      }
    });
  }
}

$(document).ready(function(){
  nacrtajGraf();

  $("#generiraj").click(function(){
    generirajPodatke(1);
    generirajPodatke(2);
    generirajPodatke(3);
    alert("Generirani so: \n" + osebe[1].ime + " " + osebe[1].priimek + " (ehrID: " + osebe[1].ehrID + ") \n" +
        osebe[2].ime + " " + osebe[2].priimek + " (ehrID: " + osebe[2].ehrID + ") \n" +
        osebe[3].ime + " " + osebe[3].priimek + " (ehrID: " + osebe[3].ehrID + ")");

    document.getElementById("preberiObstojeciEHRzaNU").innerHTML = "<option value = ''>" + ""+ "</option>" + "\n" +
        "<option value = 1>" + osebe[1].ehrID + "</option>" + "\n" +
        "<option value = 2>" + osebe[2].ehrID + "</option>" + "\n" +
        "<option value = 3>" + osebe[3].ehrID + "</option>";

  document.getElementById("preberiObstojeciEHRzaINFO").innerHTML = "<option value = ''>" + ""+ "</option>" + "\n" +
      "<option value = 1>" + osebe[1].ime + " " + osebe[1].priimek + "</option>" + "\n" +
      "<option value = 2>" + osebe[2].ime + " " + osebe[2].priimek + "</option>" + "\n" +
      "<option value = 3>" + osebe[3].ime + " " + osebe[3].priimek + "</option>";
  });


  $('#preberiObstojeciEHRzaNU').change(function() {
    $("#dodajNezeleneUcinkeSporocilo").html("");
    var stOsebe = $(this).val();
    console.log(stOsebe);
    if(!stOsebe){
      $("#dodajEHR").val("");
      $("#dodajZdravnik").val("");
    } else {
      $("#dodajEHR").val(osebe[stOsebe].ehrID);
      $("#dodajDatumInUra").val("");
      $("#dodajTelesnaTemperatura").val("");
      $("#dodajNezeleneUcinke").val("");
      $("#dodajZdravnik").val(osebe[stOsebe].zdravnik);
    }
  });


  $('#preberiObstojeciEHR').change(function() {
    $("#preberiSporocilo").html("");
    if($(this).val() !== ""){
      $("#preberiEHRid").val(osebe[($(this).val())].ehrID);
    } else  $("#preberiEHRid").val("");

  });
});

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
