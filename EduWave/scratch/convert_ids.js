const { MongoClient, ObjectId } = require('mongodb');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'eduwave';

// Funcție recursivă pentru a converti string-urile de 24 caractere hex în ObjectId
function convertToObjectIdRecursive(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Verifică dacă este un string de 24 caractere hexadecimale (pattern ObjectId)
    if (/^[0-9a-fA-F]{24}$/.test(obj)) {
      return new ObjectId(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertToObjectIdRecursive);
  }

  if (typeof obj === 'object') {
    // Evită convertirea instanțelor de clase native ca Date sau deja ObjectId
    if (obj instanceof Date || obj instanceof ObjectId) {
      return obj;
    }
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = convertToObjectIdRecursive(value);
    }
    return newObj;
  }

  return obj;
}

async function migrate() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    console.log('Conectat la MongoDB pentru migrare...');
    const db = client.db(DB_NAME);

    const collections = await db.listCollections().toArray();

    for (const col of collections) {
      const colName = col.name;
      if (colName.startsWith('system.')) continue;

      console.log(`\nProcesare colecție: ${colName}...`);
      const docs = await db.collection(colName).find({}).toArray();
      console.log(`Găsite ${docs.length} documente.`);

      let migratedCount = 0;
      for (const doc of docs) {
        // Păstrăm id-ul original (care poate fi string) pentru a-l șterge
        const originalId = doc._id;

        // Convertim recursiv tot documentul
        const migratedDoc = convertToObjectIdRecursive(doc);

        // Dacă _id-ul s-a schimbat din string în ObjectId, trebuie să ștergem cel vechi și să-l inserăm pe cel nou
        if (typeof originalId === 'string' && migratedDoc._id instanceof ObjectId) {
          await db.collection(colName).deleteOne({ _id: originalId });
          await db.collection(colName).insertOne(migratedDoc);
          migratedCount++;
        } else {
          // Altfel doar facem update în caz că s-au convertit alte câmpuri interioare (ca user_id etc.)
          await db.collection(colName).replaceOne({ _id: originalId }, migratedDoc);
        }
      }
      console.log(`Finalizat ${colName}. Convertite/Re-inserate: ${migratedCount} documente.`);
    }

    console.log('\nMigrarea bazei de date s-a terminat cu succes!');
  } catch (err) {
    console.error('Eroare la migrare:', err);
  } finally {
    await client.close();
  }
}

migrate();
