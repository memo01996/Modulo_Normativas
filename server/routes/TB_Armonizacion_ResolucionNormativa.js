const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { TB_Armonizacion_ResolucionNormativa } = require("../models");
const { TB_Armonizacion_Normativa_ModificadaPor } = require("../models");
const { TB_Armonizacion_Normativa_DerogaModificaA } = require("../models");

// Obtener las normativas modificadas por una norma específica
router.get("/:CodigoResolucion/modifica", async (req, res) => {
  try {
    const normativasModificadas =
      await TB_Armonizacion_Normativa_ModificadaPor.findAll({
        where: { CodigoResolucion: req.params.CodigoResolucion },
        attributes: ["CodigoNormativaQueDerogoModifico"],
      });
    res.json(normativasModificadas);
  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).send("Error en el servidor");
  }
});

// Obtener las normativas derogadas por una norma específica
router.get("/:CodigoResolucion/deroga", async (req, res) => {
  try {
    const normativasDerogadas =
      await TB_Armonizacion_Normativa_DerogaModificaA.findAll({
        where: { CodigoResolucionNormativa: req.params.CodigoResolucion },
        attributes: ["CodigoResolucionModificada"],
      });
    res.json(normativasDerogadas);
  } catch (error) {
    console.error("Error fetching normativas:", error.stack);
    res.status(500).send("Error en el servidor");
  }
});

// Ruta para obtener los años de las normativas
router.get("/years", async (req, res) => {
  try {
    const normativas = await TB_Armonizacion_ResolucionNormativa.findAll({
      attributes: ["Anio"],
      where: { Anio: { [Op.ne]: null } },
      group: ["Anio"],
      order: [["Anio", "DESC"]],
    });
    const years = normativas.map((normativa) => normativa.Anio);
    res.json(years);
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).send("Server Error");
  }
});

// Ruta para obtener las normativas basadas en filtros opcionales
router.get("/", async (req, res) => {
  let whereClause = {};
  const { Anio, searchTerm } = req.query;
  if (Anio && Anio !== "Todos los años") {
    whereClause.Anio = Anio;
  }
  if (searchTerm) {
    whereClause[Op.or] = [
      { CodigoResolucion: { [Op.like]: `%${searchTerm}%` } },
      { ClasificacionGeneral: { [Op.like]: `%${searchTerm}%` } },
      { Servicios: { [Op.like]: `%${searchTerm}%` } },
      { Estado: { [Op.like]: `%${searchTerm}%` } },
      { FechaPublicacion: { [Op.like]: `%${searchTerm}%` } },
    ];
  }
  try {
    const results = await TB_Armonizacion_ResolucionNormativa.findAll({
      where: whereClause,
    });
    res.json(results);
  } catch (error) {
    console.error("Error al obtener las normativas:", error);
    res.status(500).send(error.message);
  }
});

// Ruta para crear una nueva normativa
router.post("/", async (req, res) => {
  const { CodigoResolucion, SistemaFecha, ...datos } = req.body;
  try {
    const normativaExistente =
      await TB_Armonizacion_ResolucionNormativa.findOne({
        where: { CodigoResolucion },
      });
    if (normativaExistente) {
      return res
        .status(400)
        .json({ message: "El Código de Resolución ya existe." });
    }
    const registroSinFecha = { ...datos };
    const registroCreado = await TB_Armonizacion_ResolucionNormativa.create(
      registroSinFecha
    );
    res.status(201).json(registroCreado);
  } catch (error) {
    console.error("Error creating new normativa:", error);
    res.status(500).send(error.message);
  }
});

// Ruta para actualizar una normativa existente
router.put("/:CodigoResolucion", async (req, res) => {
  const { SistemaFecha, ...datos } = req.body;
  const registroSinFecha = { ...datos, SistemaFecha: null };
  try {
    const [updated] = await TB_Armonizacion_ResolucionNormativa.update(
      registroSinFecha,
      {
        where: { CodigoResolucion: req.params.CodigoResolucion },
      }
    );
    if (updated) {
      const updatedNormativa =
        await TB_Armonizacion_ResolucionNormativa.findOne({
          where: { CodigoResolucion: req.params.CodigoResolucion },
        });
      res.status(200).json(updatedNormativa);
    } else {
      res.status(404).send("Normativa not found");
    }
  } catch (error) {
    console.error("Error updating normativa:", error);
    res.status(500).send(error.message);
  }
});

// Ruta para derogar una normativa
router.delete("/:CodigoResolucion", async (req, res) => {
  const { SistemaFecha, ...datos } = req.body;
  const registroSinFecha = { ...datos, SistemaFecha: null, Estado: "Derogada" };
  try {
    const [updated] = await TB_Armonizacion_ResolucionNormativa.update(
      registroSinFecha,
      {
        where: { CodigoResolucion: req.params.CodigoResolucion },
      }
    );
    if (updated) {
      const updatedNormativa =
        await TB_Armonizacion_ResolucionNormativa.findOne({
          where: { CodigoResolucion: req.params.CodigoResolucion },
        });
      res.status(200).json(updatedNormativa);
    } else {
      res.status(404).send("Normativa not found");
    }
  } catch (error) {
    console.error("Error updating normativa:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;