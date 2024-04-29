const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { TB_Armonizacion_ClasificacionServicios } = require("../models");

// Ruta para verificar la existencia de una normativa específica
router.get("/existencia", async (req, res) => {
  const { CodigoResolucion, CodigoServicio } = req.query;
  try {
    const normativaExistente =
      await TB_Armonizacion_ClasificacionServicios.findOne({
        where: {
          CodigoResolucion,
          CodigoServicio,
        },
      });
    res.json({ exists: !!normativaExistente });
  } catch (error) {
    console.error("Error al verificar la existencia de la normativa: ", error);
    res.status(500).send(error.message);
  }
});

// Ruta para obtener los códigos de resolución únicos
router.get("/codigos-resolucion", async (req, res) => {
  try {
    let whereClause = {};

    const normativas = await TB_Armonizacion_ClasificacionServicios.findAll({
      attributes: ["CodigoResolucion"],
      where: {
        ...whereClause,
        CodigoResolucion: { [Op.ne]: null },
      },
      group: ["CodigoResolucion"],
      order: [["CodigoResolucion", "DESC"]],
    });

    const codigoresolucion = normativas.map(
      (normativa) => normativa.CodigoResolucion
    );
    res.json(codigoresolucion);
  } catch (error) {
    console.error("Error fetching codigoresolucion:", error);
    res.status(500).send("Server Error");
  }
});

// Ruta general para buscar normativas con filtros opcionales
router.get("/", async (req, res) => {
  try {
    let whereClause = {};
    const { CodigoResolucion, searchTerm } = req.query;

    if (CodigoResolucion && CodigoResolucion !== "Todas las Normativas") {
      whereClause.CodigoResolucion = CodigoResolucion;
    }

    if (searchTerm) {
      whereClause[Op.or] = [
        { CodigoResolucion: { [Op.like]: `%${searchTerm}%` } },
        { CodigoServicio: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const modificada = await TB_Armonizacion_ClasificacionServicios.findAll({
      where: whereClause,
      attributes: { exclude: ["id"] },
    });
    res.json(modificada);
  } catch (error) {
    console.error("Error en la consulta: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

// Ruta para crear una nueva normativa
router.post("/", async (req, res) => {
  try {
    const { CodigoResolucion, CodigoServicio } = req.body;

    const normativaExistente =
      await TB_Armonizacion_ClasificacionServicios.findOne({
        where: {
          CodigoResolucion,
          CodigoServicio,
        },
      });

    if (normativaExistente) {
      return res.status(400).json({
        message:
          "El Código de Resolución con ese Codigo de Servicio ya existe.",
      });
    }

    const nuevoRegistro = {
      CodigoResolucion,
      CodigoServicio,
    };
    const registroCreado = await TB_Armonizacion_ClasificacionServicios.create(
      nuevoRegistro
    );
    res.status(201).json(registroCreado);
  } catch (error) {
    console.error("Error creating new normativa:", error);
    res.status(500).send(error.message);
  }
});

// Ruta para actualizar una normativa existente
router.put("/:CodigoResolucion/:CodigoServicio", async (req, res) => {
  const { CodigoResolucion, CodigoServicio } = req.params;
  try {
    const normativaExistente =
      await TB_Armonizacion_ClasificacionServicios.findOne({
        where: {
          CodigoResolucion: decodeURIComponent(CodigoResolucion),
          CodigoServicio: decodeURIComponent(CodigoServicio),
        },
      });

    if (!normativaExistente) {
      return res.status(404).json({ message: "Normativa no encontrada." });
    }

    await normativaExistente.update(req.body);
    res.status(200).json(normativaExistente);
  } catch (error) {
    console.error("Error updating normativa:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para eliminar una normativa
router.delete("/:CodigoResolucion/:CodigoServicio", async (req, res) => {
  const { CodigoResolucion, CodigoServicio } = req.params;
  try {
    const resultado = await TB_Armonizacion_ClasificacionServicios.destroy({
      where: {
        CodigoResolucion: decodeURIComponent(CodigoResolucion),
        CodigoServicio: decodeURIComponent(CodigoServicio),
      },
    });

    if (resultado === 0) {
      return res.status(404).json({ message: "Normativa no encontrada." });
    }
    res.status(200).json({ message: "Normativa eliminada correctamente." });
  } catch (error) {
    console.error("Error deleting normativa:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;