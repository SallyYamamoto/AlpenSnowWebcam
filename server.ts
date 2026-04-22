import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";

// Note for the User context: 
// The environment runs on Google Cloud Run directly instead of Netlify Functions. 
// We are simulating the "12:00 PM Netlify Cron" logic here by holding a cache.
// A real scheduled job in Node would use 'node-cron' here instead.
// The frontend queries this route logic.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - serves the cached camera data from the JSON file
  app.get("/api/webcams", async (req, res) => {
    try {
      // Read the json file dynamically
      const filePath = path.resolve(process.cwd(), "bavaria_webcams.json");
      const fileContent = await fs.readFile(filePath, "utf-8");
      const webcams = JSON.parse(fileContent);

      res.json({
        success: true,
        data: webcams,
        cached_at: new Date().setHours(12, 0, 0, 0) // Simulated 12:00 PM cache time
      });
    } catch (error) {
      console.error("Error reading bavaria_webcams.json:", error);
      res.status(500).json({ success: false, error: "Failed to load webcam data" });
    }
  });

  // Example API trigger for a Cron/Scheduler to update Blobs manually
  app.post("/api/cron/update-images", (req, res) => {
    // Logic to scrape or query APIs for new images and save to db/blob...
    console.log("Simulating 12 PM Image Fetch Cron...");
    res.json({ success: true, message: "Blobs updated!" });
  });

  // Vite integration 
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
