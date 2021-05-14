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
    BMI: osebe[stPacienta].BMI
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
    cepiloProizv: "Pfizer-BioNTech",
    BMI: "20.7"
  },

  2:{
    ehrID: "54a6dd28-e357-4054-b363-c272b8b59449",
    ime: "Martin",
    priimek: "Novak",
    letoRojstva: "1975",
    prvoCepDatum: "2021-02-04",
    drugoCepDatum: "2021-02-25",
    cepiloProizv: "Moderna",
    BMI: "23"
  },

  3:{
    ehrID: "10a6dd28-j100-1010-b363-c272b8b10449",
    ime: "Vesna",
    priimek: "Novak",
    letoRojstva: "1972",
    prvoCepDatum: "2021-01-05",
    drugoCepDatum: "2021-04-07",
    cepiloProizv: "Moderna",
    BMI: "23",
  }
};

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



});

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
