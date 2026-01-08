// backend/seed.js
import mongoose from 'mongoose';
import Business from './src/models/Business.js';
import 'dotenv/config';

// Helper function to create slugs manually for seeding
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

const seedData = [
  {
    name: "Student Center Cafeteria",
    category: "on-campus",
    location: { address: "Main Campus, Building A" },
    description: "The heart of campus dining.",
    rating: { average: 3.5, count: 150 },
    isFeatured: true,
  },
  {
    name: "Burger Dash",
    category: "delivery",
    location: { address: "Off-campus HQ" },
    description: "Fastest delivery to all dorms.",
    rating: { average: 4.8, count: 500 },
    isFeatured: true,
  },
  {
    name: "Green Garden",
    category: "off-campus",
    location: { address: "South Gate" },
    description: "Vegetarian friendly spot.",
    rating: { average: 4.2, count: 85 },
    isFeatured: false,
  },
  {
    name: "Night Owl Pizza",
    category: "delivery",
    location: { address: "Downtown" },
    description: "Open until 3 AM.",
    rating: { average: 3.9, count: 210 },
    isFeatured: false,
  }
].map(item => ({ ...item, slug: createSlug(item.name) })); // Generate slugs here!

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB...");
    
    // 1. Clear the collection
    await Business.deleteMany({});
    console.log("Cleared old businesses...");

    // 2. IMPORTANT: If the error persists, drop the index and let Mongoose recreate it
    try {
        await Business.collection.dropIndex("slug_1");
    } catch (e) {
        console.log("Slug index already clean.");
    }
    
    // 3. Insert fresh data
    await Business.insertMany(seedData);
    
    console.log("✅ Database Seeded Successfully with manual slugs!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

runSeed();