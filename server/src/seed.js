import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Notice, Achievement, Sport } from "./models.js";

await mongoose.connect(process.env.MONGO_URI);
await User.updateOne(
  { email: process.env.ADMIN_EMAIL.toLowerCase() },
  {
    name: "Admin",
    role: "admin",
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
  },
  { upsert: true },
);
if (!(await Sport.countDocuments())) {
  await Sport.insertMany(
    [
      "Cricket",
      "Football",
      "Volleyball",
      "Fencing",
      "Shooting",
      "Boxing",
      "Athletics",
    ].map((name) => ({
      name,
      coach: "To be added",
      description: "Teams, fixtures and medals appear here.",
    })),
  );
}
if (!(await Notice.countDocuments())) {
  await Notice.create([
    {
      title: "Admissions open. Send an enquiry online.",
      category: "Admissions",
      pinned: true,
    },
    {
      title: "Periodic assessment datesheet for Classes 6 to 12",
      category: "Exams",
    },
  ]);
}
if (!(await Achievement.countDocuments())) {
  await Achievement.create({
    title: "Selected for NDA written exam",
    story:
      "Sample story. Replace with the real student story from the admin panel.",
    category: "NDA",
    year: 2026,
  });
}
console.log("Seeded");
process.exit(0);
