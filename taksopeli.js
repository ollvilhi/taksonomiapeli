"use strict";

import { csvData } from "./data.js"; // tuo csvData toisesta tiedostosta

/**
 * Taksonomiadata globaalina muuttujana.
 * Vastaavasti tietyin ehdoin suodatettu data omassa muuttujassaan.
 */
let data;
let filteredData;
let oikeaVastaus;

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

/**
 * Luo lomakkeen jossa suomenkieliselle lajille tulee vastata oikea
 * tieteellinen nimi.
 */
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
  for (let lintu of vaihtoehdot) {
    // Luodaan painike ja attribuutit
    let painike = document.createElement("button");
    painike.setAttribute("class", "button");
    painike.textContent = lintu.tieteellinen; // Tieteellinen nimi painikkeen tekstiksi
    painike.setAttribute("value", lintu.tieteellinen);
    painike.setAttribute("suomeksi", lintu.suomalainen);
    painike.addEventListener("click", tarkistaVastaus);
    document.forms[0].appendChild(painike);
  }

  // Asetetaan globaaliin muuttujaan oikea vastaus
  oikeaVastaus =
    filteredData[oikeaIndeksi].tieteellinen +
    " (" +
    filteredData[oikeaIndeksi].lyhenne +
    ")";
}

/**
 * Arvotaan monivalintakenttään satunnaiset vaihtoehdot
 * @param {Object} oikea - Oikea vastausvaihtoehto
 * @returns - Sekoitettu taulukko vastausvaihtoehdoista
 */
function vaihtoehdotTieteellinen(oikea) {
  // Aluksi tyhjään taulukkoon oikea vastaus
  let taulukko = [];
  taulukko.push(filteredData[oikea]);
  //taulukko.push(filteredData[oikea].tieteellinen);
  // Luodaan satunnaiset muut vaihtoehdot
  let i = 0;
  while (i < 4) {
    let indeksi = getRandomInt(0, filteredData.length);
    if (indeksi === oikea) {
      continue;
    }
    taulukko.push(filteredData[indeksi]);
    i++;
  }

  // Sekoitetaan taulukko satunnaiseen järjestykseen ja palautetaan taulukko
  taulukko.sort(() => Math.random() - 0.5);
  return taulukko;
}

function tarkistaVastaus(e) {
  e.preventDefault();

  // Luodaan tekstikenttä, johon raportoidaan palaute
  let palautekentta = document.getElementById("palaute");
  let vastaus = document.createElement("p");
  vastaus.textContent =
    "Vastauksesi on: " +
    e.target.value +
    " eli " +
    e.target.getAttribute("suomeksi");
  palautekentta.appendChild(vastaus);
  let oikea = document.createElement("p");
  oikea.textContent = "Oikea vastaus on: " + oikeaVastaus;
  palautekentta.appendChild(oikea);

  // Luodaan painike, jolla siirrytään seuraavaan kysymykseen
  let seuraava = document.createElement("button");
  seuraava.setAttribute("class", "seuraava");
  seuraava.textContent = "Seuraava";
  seuraava.addEventListener("click", paivitaKysymys);
  palautekentta.appendChild(seuraava);
}

function paivitaKysymys(e) {
  let lomake = document.forms[0];
  let palaute = document.getElementById("palaute");

  // Poistetaan kaikki lomakkeen elementit (tehtävänanto ja napit)
  while (lomake.firstChild) {
    lomake.removeChild(lomake.firstChild);
  }

  // Tyhjennetään palaute
  while (palaute.firstChild) {
    palaute.removeChild(palaute.firstChild);
  }

  // Luodaan uusi kysymys
  suomestaTieteelliseksi();
}

/**
 * Tarjoaa satunnaisen kokonaisluvun
 * @param {Number} min
 * @param {Number} max
 * @returns - Kokonaisluku
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Suodattaa datasta pois joitakin erikoistapauksia
 * @returns - Suodatettu kopio alkuperäisestä tietorakenteesta
 */
function suodataData() {
  let kopio = [];
  for (let alkio of data) {
    if (
      alkio.suomalainen.includes("risteymä") ||
      alkio.suomalainen.includes("alalaji") ||
      alkio.suomalainen.includes("laji") ||
      alkio.suomalainen.includes("tarha") ||
      alkio.suomalainen.includes(" ") ||
      alkio.suomalainen.includes("/") ||
      alkio.tieteellinen.includes("/") ||
      alkio.suomalainen.includes("(") ||
      alkio.tieteellinen.includes("(")
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
