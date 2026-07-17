const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'eduwave';
const BACKUP_FILE = path.join(__dirname, 'mongodb_backup.json');

async function importDB() {
  if (!fs.existsSync(BACKUP_FILE)) {
    console.error(`Fisierul de backup nu exista la calea: ${BACKUP_FILE}`);
    return;
  }
  
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log('Conectat la instanta MongoDB de pe VPS...');
    const db = client.db(DB_NAME);
    
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    
    for (const [colName, documents] of Object.entries(backupData)) {
      if (documents.length === 0) {
        console.log(`Colectia ${colName} este goala, se omite...`);
        continue;
      }
      
      console.log(`Se importa ${documents.length} documente in colectia ${colName}...`);
      
      // Sterge documentele vechi din colectie pentru a evita duplicatele la import
      await db.collection(colName).deleteMany({});
      
      // Insereaza documentele exportate
      await db.collection(colName).insertMany(documents);
      console.log(`Import finalizat pentru colectia ${colName}.`);
    }
    
    console.log('\nImportul bazei de date s-a terminat cu succes pe VPS!');
  } catch (err) {
    console.error('Eroare la import:', err);
  } finally {
    await client.close();
  }
}

importDB();
