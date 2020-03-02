const express = require('express');
const path = require('path');
const csvToJson = require('csvtojson');

const app = express();
const PORT = 3434;

const db = require('./model/model.js');

const unCleanDataSetPath = path.resolve(__dirname, './DataEngineerDataSet.csv');

async function problemOnedataCleaning() {
  const jsonArrayofSourceData = await csvToJson().fromFile(unCleanDataSetPath);
  const zeroToNineHashTable = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };
  const cleanedObjectNumberDataSet = [];

  // objectNumberValidateCheckForTwoDots is a preCheck - if there are two dots present in the object numberthe function wiill return a true if not it will return a false.
  function objectNumberValidateCheckForTwoDots(objectNumberStr) {
    let dotSeperatorsCount = 0;
    for (let i = 0; i < objectNumberStr.length; i += 1) {
      const currentChar = objectNumberStr[i];

      // edgeCase handling incase the function is passed an objectNumber like '...' or '1..'
      if (currentChar + objectNumberStr[i + 1] === '..'
      || currentChar + objectNumberStr[i + 1]
      + objectNumberStr[i + 2] === '...'
      ) return false;

      if (currentChar === '.') dotSeperatorsCount += 1;
    }
    if (dotSeperatorsCount === 2) return true;
    return false;
  }

  // This function splits at the dots in the objectNumber and if any number found after split is not a num it will return false--> else it will return true
  function splitsAtDotsValidatesAsNumbers(objectNumberStr) {
    const objectNumberStrCopy = objectNumberStr.split('.');
    for (let i = 0; i < objectNumberStrCopy.length; i += 1) {
      const numberSet = objectNumberStrCopy[i];
      for (let j = 0; j < numberSet.length; j += 1) {
        const individualObjectNumber = numberSet[j];
        if (!zeroToNineHashTable[individualObjectNumber]) return false;
      }
    }
    return true;
  }

  jsonArrayofSourceData.forEach((rowDataSetfromCsv) => {
    const currentRowObjectNumber = rowDataSetfromCsv['Object Number'];
    const currElementContainsTwoDots = objectNumberValidateCheckForTwoDots(currentRowObjectNumber);
    const obJectNmberIsValid = splitsAtDotsValidatesAsNumbers(currentRowObjectNumber);
    if (currElementContainsTwoDots && obJectNmberIsValid) {
      cleanedObjectNumberDataSet.push(rowDataSetfromCsv);
    }
  });

  // *** Uncomment this line to console.log/visualize cleanedSet
  //   cleanedObjectNumberDataSet.forEach((cleanDataSet) => console.log('CLEANEDSET:', cleanDataSet['Object Number']));
}
//* *Uncomment inovaction below to run function and run console.log on line 69 to print cleanedSet*/
// problemOnedataCleaning();


async function problem3TrackingRunningTotals() {
  const jsonArrayofSourceData = await csvToJson().fromFile(unCleanDataSetPath);
  const dataClassificationHashTable = {};
  const classificationAndTotals = [];


  function classificationTotalsAndPopulateHashTable(sourceData) {
    const datasetKeys = Object.keys(sourceData);
    for (const key of datasetKeys) {
      if (key === 'Classification') {
        if (!dataClassificationHashTable[sourceData[key]]) {
          dataClassificationHashTable[sourceData[key]] = 1;
        } else dataClassificationHashTable[sourceData[key]] += 1;
      }
    }
  }

  function writeClassificationAndTotalsToDB(classificationAndTotalsRow) {
    const queryString = 'INSERT INTO classification_totals (Classification, Totals) VALUES ($1, $2)';
    const valuesToInsert = [classificationAndTotalsRow.classification, classificationAndTotalsRow.total];

    db.query(queryString, valuesToInsert, (err, result) => {
      if (err) return ('Error inserting into DB', err);
    });
  }

  function readClassificationAndTotalsFromDB() {
    const queryString = 'SELECT * FROM classification_totals';

    db.query(queryString, (err, result) => {
      if (err) return ('Error inserting into DB', err);
      const classficiationandTotalsfromDb = result.rows;
      return classficiationandTotalsfromDb;
    });
  }

  jsonArrayofSourceData.forEach((rowDataSetfromCsv) => {
    classificationTotalsAndPopulateHashTable(rowDataSetfromCsv);
  });

  // create data rows from created hashtable
  const classificationHashTableKeys = Object.keys(dataClassificationHashTable);
  for (const classification of classificationHashTableKeys) {
    classificationAndTotals.push({
      classification,
      total: dataClassificationHashTable[classification],
    });
  }

  // ***iterate over classificationAndTotals array of objects and write to database ---> DB has already been populated so no need to have this command active
  //   classificationAndTotals.forEach((classRow) => writeClassificationAndTotalsToDB(classRow));


  //* ** uncomment console.log below to print classification and totals from DB
  //   console.log(readClassificationAndTotalsFromDB());

  return classificationAndTotals;
}
//* *Uncomment inovaction below to run */
// problem3TrackingRunningTotals();


// Invoke server listen
app.listen(PORT, () => console.log(`This app is listening on port ${PORT}`));
