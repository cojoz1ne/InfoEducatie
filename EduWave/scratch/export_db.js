const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'eduwave';
const OUTPUT_FILE = path.join(__dirname, 'mongodb_backup.json');

async function exportDB() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log('Conectat la MongoDB local...');
    const db = client.db(DB_NAME);
    
    // Obține toate colecțiile din baza de date
    const collections = await db.listCollections().toArray();
    const backupData = {};
    
    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`Se exporta colectia: ${colName}...`);
      const documents = await db.collection(colName).find({}).toArray();
      backupData[colName] = documents;
    }
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`\nExport finalizat cu succes! Fisierul salvat: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Eroare la export:', err);
  } finally {
    await client.close();
  }
}

exportDB();
