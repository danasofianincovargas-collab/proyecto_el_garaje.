// =================================================================
// SERVIDOR PRINCIPAL - EL GARAJE API
// =================================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./routes/usuarioRoutes");
const productoRoutes = require("./routes/productoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productoRoutes);

app.get("/", (req, res) => {
    res.json({ mensaje: "API de El Garaje activa." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de El Garaje corriendo en http://localhost:${PORT}`);
});
