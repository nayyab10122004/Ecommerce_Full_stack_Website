const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;
if (!url) {
  console.error('Missing MONGO_URL');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    console.log('Mongoose connected ✔');
  } catch (e) {
    console.error('Mongoose auth error:', e?.message || e);
    if (String(e?.message || '').toLowerCase().includes('bad auth')) {
      console.error('Hint: Atlas rejected credentials. Re-check Database Access username/password and auth source.');
    }
  } finally {
    await mongoose.connection.close().catch(() => {});
  }
})();

