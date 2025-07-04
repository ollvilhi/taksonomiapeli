"use strict";

import { csvData } from "./data.js"; // tuo csvData toisesta tiedostosta

// Koodi suoritetaan, kun sivu on ladattu
document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript on valmis ja strict-tila on käytössä!");

  // CSV-data JSON-muodossa
  let jsonstring = csvToJson(csvData);

  //JSON objektiksi
  let data = JSON.parse(jsonstring);
  console.log(data);
});

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
