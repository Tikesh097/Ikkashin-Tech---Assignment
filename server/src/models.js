import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const User = model(
  "User",
  new Schema(
    {
      name: String,
      email: { type: String, unique: true, required: true, lowercase: true },
      passwordHash: { type: String, required: true },
      role: {
        type: String,
        enum: ["admin", "editor", "teacher", "parent", "student"],
        default: "parent",
      },
    },
    { timestamps: true },
  ),
);

const noticeSchema = new Schema(
  {
    title: { type: String, required: true },
    body: String,
    category: {
      type: String,
      enum: ["Admissions", "Exams", "Events", "General"],
      default: "General",
    },
    program: {
      type: String,
      enum: ["All", "Boarding", "Defence", "IIT-NEET"],
      default: "All",
    },
    pinned: { type: Boolean, default: false },
    publishAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);
noticeSchema.index({ publishAt: -1, category: 1 });
export const Notice = model("Notice", noticeSchema);

const achSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    story: { type: String, required: true },
    category: {
      type: String,
      enum: ["Sports", "Academic", "NDA", "IIT-NEET"],
      required: true,
    },
    year: Number,
    image: String,
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);
achSchema.pre("validate", function (next) {
  if (!this.slug)
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 60) +
      "-" +
      Date.now().toString(36);
  next();
});
export const Achievement = model("Achievement", achSchema);

export const Sport = model(
  "Sport",
  new Schema(
    {
      name: { type: String, required: true },
      coach: String,
      description: String,
      achievements: [String],
    },
    { timestamps: true },
  ),
);

export const Enquiry = model(
  "Enquiry",
  new Schema(
    {
      parentName: { type: String, required: true },
      phone: { type: String, required: true },
      program: {
        type: String,
        enum: ["Boarding", "Defence", "IIT-NEET"],
        required: true,
      },
      grade: String,
      status: {
        type: String,
        enum: ["new", "contacted", "visited", "admitted", "closed"],
        default: "new",
      },
    },
    { timestamps: true },
  ),
);
