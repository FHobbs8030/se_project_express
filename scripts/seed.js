import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ClothingItem from '../models/clothingItem.js';

dotenv.config();

const { MONGO_URL = 'mongodb://127.0.0.1:27017/wtwr_db', DB_JSON_PATH } = process.env;

function resolveDbPath() {
  if (DB_JSON_PATH) return path.resolve(DB_JSON_PATH);
  const candidates = [
    path.resolve(process.cwd(), 'db.json'),
    path.resolve(process.cwd(), '../se_project_react/se_project_react/db.json'),
    path.resolve(process.cwd(), '../se_project_react/db.json'),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

async function main() {
  const dbPath = resolveDbPath();
  if (!dbPath) {
    console.error('Seed error: db.json not found. Set DB_JSON_PATH or place db.json in a known location.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URL);

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const parsed = JSON.parse(raw);
  const items = parsed && Array.isArray(parsed.items) ? parsed.items : [];

  await Promise.all(
    items.map((it) => ClothingItem.updateOne(
      { name: it.name },
      {
        $set: {
          name: it.name,
          weather: String(it.weather ?? '').toLowerCase(),
          imageUrl: it.imageUrl,
        },
      },
      { upsert: true },
    )),
  );

  console.log('✅ Seed complete');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (e) => {
  console.error('Seed error:', e);
  try {
    await mongoose.disconnect();
  } catch (disconnectErr) {
    console.error('Error during disconnect:', disconnectErr);
  }
  process.exit(1);
});
