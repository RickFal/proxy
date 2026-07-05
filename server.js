import express from "express";
import fetch from "node-fetch";

const app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const OWNER = "RickFal";
const REPO = "mods";
const FILE = "ryn.b64";

app.get("/", (req, res) => {
    res.send("Server running");
});

app.get("/mod", async (req, res) => {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!response.ok) {
            return res.status(response.status).send(await response.text());
        }

        const data = await response.json();

        if (!data.content) {
            return res.status(500).send("No file content found");
        }

        // GitHub returns base64 already
        const decoded = Buffer.from(data.content, "base64").toString("utf-8");

        res.set("Content-Type", "text/plain");
        res.send(decoded);

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
