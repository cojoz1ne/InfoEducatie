const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'eduwave';
const BACKUPS_DIR = path.join(__dirname, '..', 'backups');

async function backupDB() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }

  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log('Conectat la MongoDB pentru backup...');
    const db = client.db(DB_NAME);
    
    // Obține toate colecțiile
    const collections = await db.listCollections().toArray();
    const backupData = {};

    for (const col of collections) {
      const colName = col.name;
      console.log(`Se extrag datele din colecția: ${colName}...`);
      const documents = await db.collection(colName).find({}).toArray();
      backupData[colName] = documents;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${timestamp}.json`;
    const filepath = path.join(BACKUPS_DIR, filename);

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`Backup salvat cu succes la: ${filepath}`);

    // Curăță backup-urile mai vechi de 7 zile
    const files = fs.readdirSync(BACKUPS_DIR);
    const backupFiles = files
      .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
      .map(f => ({ name: f, time: fs.statSync(path.join(BACKUPS_DIR, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time); // Cele mai noi primele

    if (backupFiles.length > 7) {
      console.log('Se curăță backup-urile vechi...');
      for (let i = 7; i < backupFiles.length; i++) {
        const fileToDelete = path.join(BACKUPS_DIR, backupFiles[i].name);
        fs.unlinkSync(fileToDelete);
        console.log(`Șters backup vechi: ${fileToDelete}`);
      }
    }

  } catch (err) {
    console.error('Eroare în timpul backup-ului:', err);
  } finally {
    await client.close();
  }
}

backupDB();
