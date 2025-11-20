Here is a complete, clean summary of everything we discussed about your URL Shortener (Shortlink) Project — including setup, errors, fixes, database connection, routing, deployment, and what to show HR.

This is the full combined version of all important points from our past chats.


---

🔗 Your URL Shortener Project — Complete Summary

✅ 1. Tech Stack You Used

Node.js

Express.js

PostgreSQL (Neon / Local Postgres)

Tailwind CSS (optional)

Frontend: HTML/CSS/JS

Deployment options: Vercel / Render / Railway



---

✅ 2. Project Folder Structure

url-shortener/
│── server.js / app.js
│── .env
│── db.js
│── routes/
│     └── url.js
│── utils/
│     └── idGen.js
│── public/
│     ├── index.html
│     └── admin.html


---

✅ 3. Important .env Variables

You used:

PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/shortenerdb
BASE_URL=http://localhost:5000


---

✅ 4. Database Setup

PostgreSQL table:

CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  short_id VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  title TEXT,
  click_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  expire_at TIMESTAMP
);


---

✅ 5. Database Connection (db.js)

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;


---

✅ 6. URL Shortening Route

Your main route:

router.post('/shorten', async (req, res) => {
    try {
        const { longUrl, customAlias, title, expireAt } = req.body;

        if (!validUrl.isWebUri(longUrl)) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        let shortId = customAlias || generateId();

        const check = await pool.query(
            'SELECT * FROM urls WHERE short_id=$1',
            [shortId]
        );

        if (check.rows.length > 0) {
            return res.status(400).json({ error: "Alias already exists" });
        }

        const result = await pool.query(
            `INSERT INTO urls (short_id, long_url, title, expire_at)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [shortId, longUrl, title, expireAt]
        );

        res.json({
            shortUrl: ${BASE_URL}/${shortId},
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


---

✅ 7. Redirect Route

router.get('/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;

        const result = await pool.query(
            'SELECT * FROM urls WHERE short_id=$1',
            [shortId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("URL not found");
        }

        const url = result.rows[0];

        await pool.query(
            'UPDATE urls SET click_count = click_count + 1 WHERE short_id=$1',
            [shortId]
        );

        res.redirect(url.long_url);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


---

✅ 8. Issues You Faced (and Solutions)

❌ 1. Server error popup

Reason: Wrong DATABASE_URL
Fix: Corrected:

postgresql://postgres:Rushi%40976363@localhost:5432/shortenerdb


---

❌ 2. “Server started but popup shows error”

Reason:
BASE_URL mismatch or not exported properly.

Fix:
Made sure .env had:

BASE_URL=http://localhost:5000


---

❌ 3. Your build script missing

Fix added to package.json:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}


---

❌ 4. Not able to commit to Git (Author unknown)

Fix:

git config --global user.name "Your Name"
git config --global user.email "your@email.com"


---

✅ 9. Frontend Form (index.html)

Your popup sent:

{
  "error": "Server error"
}

Which was fixed after correcting backend routes + .env.


---


✔ Your Skills in This Project

Node.js & Express

PostgreSQL

REST API

Error handling

Environment variables

Deployment

Git & GitHub
