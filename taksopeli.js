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

  // Vastausvaihtoehdot ja niiden satunnainen järjestys
  let vaihtoehdot = vaihtoehdotTieteellinen(oikeaIndeksi);

  // Luodaan valintapainikkeet
  // Läpikäynti luoduille vaihtoehdoille
  let vaihtoehtoNro = 0;
  for (let tieteellinen of vaihtoehdot) {
    // Luodaan painike ja attribuutit
    let painike = document.createElement("button");
    painike.setAttribute("class", "button");
    painike.setAttribute(
      "onclick",
      "valitse('Vaihtoehto " + vaihtoehtoNro + "')"
    );
    painike.textContent = tieteellinen; // Tieteellinen nimi painikkeen tekstiksi
    document.forms[0].appendChild(painike);
    vaihtoehtoNro++;
  }
}

function vaihtoehdotTieteellinen(oikea) {
  // Aluksi tyhjään taulukkoon oikea vastaus
  let taulukko = [];
  taulukko.push(filteredData[oikea].tieteellinen);
  // Luodaan satunnaiset muut vaihtoehdot
  for (let i = 0; i < 4; i++) {
    let indeksi = getRandomInt(0, filteredData.length);
    if (indeksi === oikea) {
      continue;
    }
    taulukko.push(filteredData[indeksi].tieteellinen);
  }

  // Sekoitetaan taulukko satunnaiseen järjestykseen ja palautetaan taulukko
  taulukko.sort(() => Math.random() - 0.5);
  return taulukko;
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
