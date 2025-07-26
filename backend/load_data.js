const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// ✅ MongoDB Connection URI
const uri = 'mongodb://127.0.0.1:27017'; // Use Atlas URI if needed
const client = new MongoClient(uri);

// ✅ Database and CSV Configuration
const dbName = 'ecommerce';
const files = [
  { filename: 'products.csv', collection: 'products' },
  { filename: 'customers.csv', collection: 'customers' },
  { filename: 'orders.csv', collection: 'orders' },
  { filename: 'order_items.csv', collection: 'order_items' },
  { filename: 'reviews.csv', collection: 'reviews' }
];

// ✅Main function to connect and load data
async function loadCSVData() {
  try {
    await client.connect();
    console.log(`✅ Connected to MongoDB: ${dbName}`);
    const db = client.db(dbName);

    for (const file of files) {
      const filePath = path.join(__dirname, 'data', file.filename);
      const data = [];

      console.log(`📥 Importing ${file.filename}...`);

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => data.push(row))
          .on('end', async () => {
            const collection = db.collection(file.collection);
            await collection.deleteMany({}); // Optional: clear old data
            if (data.length > 0) {
              await collection.insertMany(data);
              console.log(`✔ ${data.length} records inserted into '${file.collection}'`);
            } else {
              console.log(`⚠ No data in ${file.filename}`);
            }
            resolve();
          })
          .on('error', reject);
      });
    }

    console.log('🎉 All CSV data imported successfully!');
  } catch (err) {
    console.error('❌ Error loading data:', err);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

loadCSVData();

