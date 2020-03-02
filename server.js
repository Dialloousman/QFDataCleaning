const express = require('express');
const path = require('path');
const csvToJson = require('csvtojson');
const fs = require('fs');


const app = express();
const PORT = 3434;


const unCleanDataSetPath = path.resolve(__dirname, './DataEngineerDataSet.csv');  

async function retrieveSourceDataFromCSV () {
    const jsonArrayofSourceData = await csvToJson().fromFile(unCleanDataSetPath);
    const dataClassificationHashTable = {};
    const classificationAndTotals = [];
    
    function classificationTotalsAndPopulateHashTable(sourceData) {
        const datasetKeys = Object.keys(sourceData);
        for (let key of datasetKeys) {
            if (key === 'Classification') {
                    if (!dataClassificationHashTable[sourceData[key]]) {
                        dataClassificationHashTable[sourceData[key]] = 1;
                    } else dataClassificationHashTable[sourceData[key]]+=1;
                };
            };
        };
        
    jsonArrayofSourceData.forEach(rowDataSetfromCsv => {
        classificationTotalsAndPopulateHashTable(rowDataSetfromCsv);
    })

    //create rows front created hashtable
    const classificationHashTableKeys = Object.keys(dataClassificationHashTable);
        for (let classification of classificationHashTableKeys) {
            classificationAndTotals.push({
                classification,
                total: dataClassificationHashTable[classification]
            })
        };
    
        console.log('classificationAndTotals: ');
        return classificationAndTotals;
    };





// Invoke server listen
app.listen(PORT, () => console.log(`This app is listening on port ${PORT}`));
