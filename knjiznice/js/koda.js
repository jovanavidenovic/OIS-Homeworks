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
    prvoCepDatum: osebe[stPacienta].prvoCepDatum,
    drugoCepDatum: osebe[stPacienta].drugoCepDatum,
    cepiloProizv: osebe[stPacienta].cepiloProizv,
    BMI: osebe[stPacienta].BMI,
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
    BMI: "20.7",
    NU: "povišana telesna temperatura"
  },

  2:{
    ehrID: "54a6dd28-e357-4054-b363-c272b8b59449",
    ime: "Martin",
    priimek: "Novak",
    letoRojstva: "1975",
    prvoCepDatum: "2021-02-04",
    drugoCepDatum: "2021-02-25",
    cepiloProizv: "Moderna",
    BMI: "23",
    NU: "vrtoglavica"
  },

  3:{
    ehrID: "10a6dd28-j100-1010-b363-c272b8b10449",
    ime: "Vesna",
    priimek: "Novak",
    letoRojstva: "1972",
    prvoCepDatum: "2021-01-05",
    drugoCepDatum: "2021-04-07",
    cepiloProizv: "AstraZeneca",
    BMI: "23",
    NU: "povišana telesna temperatura"
  }
};

function preberiEHRodOsebe(){
  var ehrID = $("#preberiEHRid").val();
  if (!ehrID || ehrID.trim().length == 0) {
    $("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
        "fade-in'>Prosim vnesite zahtevan podatek!");
  } else {
    $.ajax({
      url: baseUrl + "vrni/" + ehrID,
      type: "GET",
      success: function (podatki) {
        //pronalazak koja je osoba
        var stOsebe;
        if (ehrID === osebe[1].ehrID)
          stOsebe = 1;
        else if (ehrID === osebe[2].ehrID)
          stOsebe = 2;
        else stOsebe = 3;

        /*
        $("#preberiSporocilo").html("<span class='obvestilo label " +
            "label-success fade-in'>" +
            "<b>ehrID: </b>" + osebe[stOsebe].ehrID +
            "<br> <b>ime: </b>" + osebe[stOsebe].ime +
            "<br> <b>priimek: </b>" + osebe[stOsebe].priimek +
            "<br> <b>leto rojstva: </b>" + osebe[stOsebe].letoRojstva +
            "<br> <b>BMI: </b>" + osebe[stOsebe].BMI +
            "<br> <b>datum prvega cepljenja: </b>" + osebe[stOsebe].prvoCepDatum +
            "<br> <b>datum drugega cepljenja: </b>" + osebe[stOsebe].drugoCepDatum +
            "<br> <b>cepilo proizvajalca: </b>" + osebe[stOsebe].cepiloProizv +
            "</span>");
      },*/

        $("#preberiSporocilo").html("<div class='alert alert-primary' role='alert'> " +
            "<b>ehrID: </b>" + osebe[stOsebe].ehrID +
            "<br> <b>ime: </b>" + osebe[stOsebe].ime +
            "<br> <b>priimek: </b>" + osebe[stOsebe].priimek +
            "<br> <b>leto rojstva: </b>" + osebe[stOsebe].letoRojstva +
            "<br> <b>BMI: </b>" + osebe[stOsebe].BMI +
            "<br> <b>datum prvega cepljenja: </b>" + osebe[stOsebe].prvoCepDatum +
            "<br> <b>datum drugega cepljenja: </b>" + osebe[stOsebe].drugoCepDatum +
            "<br> <b>cepilo proizvajalca: </b>" + osebe[stOsebe].cepiloProizv +
            "<br> <b>neželeni učinki: </b>" + osebe[stOsebe].NU +
            "</div>");
      },




      error: function(err) {
        $("#preberiSporocilo").html("<span class='obvestilo label " +
            "label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).opis + "'!");
      }
    });
  }
}

var dataPoints = [];
var steviloNU = 0;
var steviloCEP = 0;

$.getJSON("vsebina.json", function(data) {
  for (var i = 0; i < data.length; i++) {
    console.log(data[1].cepivo + " " + data[1].stNU);
    var procenat = Number(data[i].stNU)/Number(data[i].stCepljenj) * 100;
    procenat = Number(procenat.toFixed(2));
    console.log(procenat);
    dataPoints.push({ label: data[i].cepivo, index: procenat + "%",  x: i, y: procenat});
    steviloNU += data[i].stNU;
    steviloCEP += data[i].stCepljenj;
    }
});

$(document).ready(function() {

  $("#generiraj").click(function(){
    generirajPodatke(1);
    generirajPodatke(2);
    generirajPodatke(3);
    alert("Generirani so: \n" + osebe[1].ime + " " + osebe[1].priimek + " (" + osebe[1].ehrID + ") \n" +
        osebe[2].ime + " " + osebe[2].priimek + " (" + osebe[2].ehrID + ") \n" +
        osebe[3].ime + " " + osebe[3].priimek + " (" + osebe[1].ehrID + ")");
  });


  $('#preberiObstojeciEHR').change(function() {
    $("#preberiSporocilo").html("");
    if($(this).val() !== ""){
      $("#preberiEHRid").val(osebe[($(this).val())].ehrID);
    } else  $("#preberiEHRid").val("");

  });



    var chart = new CanvasJS.Chart("chartContainer", {
      title:{
        text: "Odstotek neželenih učinkov pri cepljenju proti COVID-19",
        fontSize: 25,
      },
      subtitles: [{
        text: "Skupno število cepljenj je: " + steviloCEP + ".",
        fontSize: 15
      }, {
          text: "Skupno število prijav neželenih učinkov je: " + steviloNU + ".",
          fontSize: 15
      }],
      axisX: {
        title: "Proizvajalec cepiva",
        titleFontSize: 20,
        labelAngle: -30,
        labelFontSize: 15
      },
      axisY: {
        title: "Odstotek neželenih učinkov",
        titleFontSize: 20,
        labelFontSize: 15
      },

      data:[{
          indexLabel: "{y}%",
          indexLabelPlacement: "outside",
          indexLabelOrientation: "horizontal",
          dataPoints: dataPoints
      }]
    });
    chart.render();
});

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
