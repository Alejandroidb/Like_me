require("dotenv").config()

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  allowExitOnIdle: true,
});

const getDate = async () => {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
};

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "error al obtener los posts" });
  }
});

app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion ) VALUES ($1, $2, $3) RETURNING *",
      [titulo, url, descripcion]
    );
    res.status(201).json({
        message: "Post agregado con éxito",
        post: result.rows[0],
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

getDate();
app.listen(PORT, () => {
  console.log(`Servidor encendido en localhost:${PORT}`);
});
