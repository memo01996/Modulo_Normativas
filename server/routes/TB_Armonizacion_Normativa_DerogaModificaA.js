const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { TB_Armonizacion_Normativa_DerogaModificaA } = require("../models");

// Ruta para verificar la existencia de una normativa
router.get("/existencia", async (req, res) => {
  const { CodigoResolucionModificada, CodigoResolucionNormativa } = req.query;
  try {
    const normativaExistente =
      await TB_Armonizacion_Normativa_DerogaModificaA.findOne({
        where: {
          CodigoResolucionModificada,
          CodigoResolucionNormativa,
        },
      });
    res.json({ exists: !!normativaExistente });
  } catch (error) {
    console.error("Error al verificar la existencia de la normativa: ", error);
    res.status(500).send(error.message);
  }
});

// Ruta para obtener los códigos de resolución modificados únicos
router.get("/codigos-resolucion", async (req, res) => {
  try {
    const normativas = await TB_Armonizacion_Normativa_DerogaModificaA.findAll({
      attributes: ["CodigoResolucionModificada"],
      where: { CodigoResolucionModificada: { [Op.ne]: null } },
      group: ["CodigoResolucionModificada"],
      order: [["CodigoResolucionModificada", "DESC"]],
    });

    const codigoresolucionmodificada = normativas.map(
      (normativa) => normativa.CodigoResolucionModificada
    );
    res.json(codigoresolucionmodificada);
  } catch (error) {
    console.error("Error fetching codigoresolucionmodificada:", error);
    res.status(500).send("Server Error");
  }
});

// Ruta para listar normativas con filtro opcional
router.get("/", async (req, res) => {
  const { CodigoResolucionModificada, searchTerm } = req.query;
  let whereClause = {};
  if (
    CodigoResolucionModificada &&
    CodigoResolucionModificada !== "Todas las Normativas"
  ) {
    whereClause.CodigoResolucionModificada = CodigoResolucionModificada;
  }

  if (searchTerm) {
    whereClause[Op.or] = [
      { CodigoResolucionModificada: { [Op.like]: `%${searchTerm}%` } },
      { CodigoResolucionNormativa: { [Op.like]: `%${searchTerm}%` } },
      { TipoModificacion: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  try {
    const modificada = await TB_Armonizacion_Normativa_DerogaModificaA.findAll({
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
  const {
    CodigoResolucionModificada,
    CodigoResolucionNormativa,
    TipoModificacion,
  } = req.body;
  try {
    const normativaExistente =
      await TB_Armonizacion_Normativa_DerogaModificaA.findOne({
        where: { CodigoResolucionModificada, CodigoResolucionNormativa },
      });

    if (normativaExistente) {
      return res.status(400).json({
        message:
          "El Código de Resolución con ese Codigo de Normativa Que Derogo/Modifico ya existe.",
      });
    }

    const nuevoRegistro = {
      CodigoResolucionModificada,
      CodigoResolucionNormativa,
      TipoModificacion,
    };
    const registroCreado =
      await TB_Armonizacion_Normativa_DerogaModificaA.create(nuevoRegistro);
    res.status(201).json(registroCreado);
  } catch (error) {
    console.error("Error creating new normativa:", error);
    res.status(500).send(error.message);
  }
});

// Ruta para actualizar una normativa existente
router.put(
  "/:CodigoResolucionModificada/:CodigoResolucionNormativa",
  async (req, res) => {
    const { CodigoResolucionModificada, CodigoResolucionNormativa } =
      req.params;
    try {
      const normativaExistente =
        await TB_Armonizacion_Normativa_DerogaModificaA.findOne({
          where: {
            CodigoResolucionModificada: decodeURIComponent(
              CodigoResolucionModificada
            ),
            CodigoResolucionNormativa: decodeURIComponent(
              CodigoResolucionNormativa
            ),
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
  }
);

// Ruta para eliminar una normativa
router.delete(
  "/:CodigoResolucionModificada/:CodigoResolucionNormativa",
  async (req, res) => {
    const { CodigoResolucionModificada, CodigoResolucionNormativa } =
      req.params;
    try {
      const resultado = await TB_Armonizacion_Normativa_DerogaModificaA.destroy(
        {
          where: {
            CodigoResolucionModificada: decodeURIComponent(
              CodigoResolucionModificada
            ),
            CodigoResolucionNormativa: decodeURIComponent(
              CodigoResolucionNormativa
            ),
          },
        }
      );

      if (resultado === 0) {
        return res.status(404).json({ message: "Normativa no encontrada." });
      }
      res.status(200).json({ message: "Normativa eliminada correctamente." });
    } catch (error) {
      console.error("Error deleting normativa:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

module.exports = router;