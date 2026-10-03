import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes.js";
import { Achievement } from "./models.js";

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(helmet());
app.use(cors({ origin: clientUrl }));
app.use(express.json({ limit: "100kb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }), routes);

// Share link: serves Open Graph tags for WhatsApp/Facebook previews, then sends people to the site.
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
app.get("/share/achievements/:slug", async (req, res, next) => {
  try {
    const a = await Achievement.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();
    if (!a) return res.status(404).send("Not found");
    res.send(`<!doctype html><meta charset="utf-8"><title>${esc(a.title)}</title>
<meta property="og:type" content="article"><meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.story.slice(0, 150))}">${a.image ? `<meta property="og:image" content="${esc(a.image)}">` : ""}
<meta http-equiv="refresh" content="0;url=${esc(clientUrl)}/#achievements">`);
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  if (err.name === "ZodError")
    return res
      .status(400)
      .json({ error: "Please check the form fields and try again" });
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT || 5000, () => console.log("API ready")),
  );
