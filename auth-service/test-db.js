import pg from 'pg';
import 'dotenv/config';

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("Attempting to connect to:", process.env.DATABASE_URL);

client.connect()
  .then(() => {
    console.log("✅ Success! Connection established.");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed!");
    console.error(err); // This will show the actual error object
    process.exit(1);
  });
  