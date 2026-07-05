import express from "express";

const app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const OWNER = "RickFal";
const REPO = "mods";
const FILE = "ryn.b64";

app.get("/mod", async (req, res) => {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.raw+json"
                }
            }
        );

        if (!response.ok) {
            return res.status(response.status).send(await response.text());
        }

        const text = await response.text();

        res.set("Content-Type", "text/plain");
        res.send(text);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));