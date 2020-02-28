const express = require('express');
const path = require('path');
const Papa = require('papaparse');
const csvToJson = require('csvtojson');
const fs = require('fs');


const app = express();
const PORT = 3434;


const unCleanDataSetPath = path.resolve(__dirname, './DataEngineerDataSet.csv');  

// (async function retrieveSourceDataFromCSV () {
//     const jsonArrayofSourceData = await csvToJson().fromFile(unCleanDataSetPath);
//     console.log(jsonArrayofSourceData);
    
//     //*** data normalization Object start date-end date

//     return jsonArrayofSourceData;
// })();

const dateObject = [
    {obJectDate: "1843"},
    {obJectDate: "1843-56"},
    {obJectDate: "1843 - 1923"},
    {obJectDate: "Ca. 1842"},
];

function dateNormalizationStartDateEndDate () {

};



// Invoke server listen
app.listen(PORT, () => console.log(`This app is listening on port ${PORT}`));
