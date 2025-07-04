"use strict";

import { csvData } from "./data.js"; // tuo csvData toisesta tiedostosta

/**
 * Taksonomiadata globaalina muuttujana.
 * Vastaavasti tietyin ehdoin suodatettu data.
 */
let data;
let filteredData;

// Koodi suoritetaan, kun sivu on ladattu
document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript on valmis ja strict-tila on käytössä!");

  // CSV-data JSON-muodossa
  let jsonstring = csvToJson(csvData);

  //JSON-merkkijono objektiksi
  data = JSON.parse(jsonstring);
  console.log(data);
  filteredData = suodataData();

  // Luodaan monivalinta (FIN --> TIET)
  suomestaTieteelliseksi();
});

function suomestaTieteelliseksi() {
  // Määritetään satunnaisesti valitun lintulajin indeksi tietorakenteessa
  let oikeaIndeksi = getRandomInt(0, filteredData.length);
  // Tehtävänannoksi em. lintulaji suomeksi
  let tehtava = document.createElement("h1");
  tehtava.textContent = filteredData[oikeaIndeksi].suomalainen;
  document.forms[0].appendChild(tehtava);

  // Valintapainikkeet
  let valinta1 = document.createElement("button");
  let valinta2 = document.createElement("button");
  let valinta3 = document.createElement("button");
  valinta1.setAttribute("class", "button");
  valinta2.setAttribute("class", "button");
  valinta3.setAttribute("class", "button");
  valinta1.setAttribute("onclick", "valitse('Vaihtoehto A')");
  valinta2.setAttribute("onclick", "valitse('Vaihtoehto B')");
  valinta3.setAttribute("onclick", "valitse('Vaihtoehto C')");

  // Vastausvaihtoehdot ja niiden satunnainen järjestys
  let vaihtoehdot = [];
  vaihtoehdot.push();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function suodataData() {
  let kopio = [];
  for (let alkio of data) {
    if (
      alkio.suomalainen.includes("risteymä") ||
      alkio.suomalainen.includes("alalaji") ||
      alkio.suomalainen.includes("tarha") ||
      alkio.suomalainen.includes("/")
    ) {
      continue;
    }
    // Ellei em. rajoitteita, lisätään alkio kopio-taulukkoon.
    kopio.push(alkio);
  }
  return kopio;
}

/**
 * Muunnetaan csv-data JSON-muotoon
 * @param {Object} csv - Csv-tiedoston sisältö muuttujassa
 * @returns {Object} - Data-objekti JSON-muodossa
 */
function csvToJson(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(";");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(";");

    headers.forEach((header, index) => {
      obj[header.trim()] = currentLine[index]?.trim();
    });

    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}
