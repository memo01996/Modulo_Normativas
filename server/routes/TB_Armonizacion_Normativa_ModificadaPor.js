const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { TB_Armonizacion_Normativa_ModificadaPor } = require("../models");

// Ruta para verificar si una normativa específica ya existe
router.get("/existencia", async (req, res) => {
  const { CodigoResolucion, CodigoNormativaQueDerogoModifico } = req.query;
  try {
    const normativaExistente =
      await TB_Armonizacion_Normativa_ModificadaPor.findOne({
        where: {
          CodigoResolucion,
          CodigoNormativaQueDerogoModifico,
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
    const normativas = await TB_Armonizacion_Normativa_ModificadaPor.findAll({
      attributes: ["CodigoResolucion"],
      where: {
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

// Ruta para listar normativas modificadas con filtros opcionales
router.get("/", async (req, res) => {
  let whereClause = {};
  const { CodigoResolucion, searchTerm } = req.query;

  if (CodigoResolucion && CodigoResolucion !== "Todas las Normativas") {
    whereClause.CodigoResolucion = CodigoResolucion;
  }

  if (searchTerm) {
    whereClause[Op.or] = [
      { CodigoResolucion: { [Op.like]: `%${searchTerm}%` } },
      { CodigoNormativaQueDerogoModifico: { [Op.like]: `%${searchTerm}%` } },
      { TipoModificacion: { [Op.like]: `%${searchTerm}%` } },
    ];
  }

  try {
    const modificada = await TB_Armonizacion_Normativa_ModificadaPor.findAll({
      where: whereClause,
      attributes: { exclude: ["id"] },
    });
    res.json(modificada);
  } catch (error) {
    console.error("Error en la consulta: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

// Ruta para crear una nueva normativa modificada
router.post("/", async (req, res) => {
  const {
    CodigoResolucion,
    CodigoNormativaQueDerogoModifico,
    TipoModificacion,
  } = req.body;

  try {
    const normativaExistente =
      await TB_Armonizacion_Normativa_ModificadaPor.findOne({
        where: {
          CodigoResolucion,
          CodigoNormativaQueDerogoModifico,
        },
      });

    if (normativaExistente) {
      return res.status(400).json({
        message:
          "El Código de Resolución con ese Codigo de Normativa Que Derogo/Modifico ya existe.",
      });
    }

    const nuevoRegistro = {
      CodigoResolucion,
      CodigoNormativaQueDerogoModifico,
      TipoModificacion,
    };

    const registroCreado = await TB_Armonizacion_Normativa_ModificadaPor.create(
      nuevoRegistro
    );
    res.status(201).json(registroCreado);
  } catch (error) {
    console.error("Error creating new normativa:", error);
    res.status(500).send(error.message);
  }
});

// Ruta para actualizar una normativa existente
router.put(
  "/:CodigoResolucion/:CodigoNormativaQueDerogoModifico",
  async (req, res) => {
    const { CodigoResolucion, CodigoNormativaQueDerogoModifico } = req.params;
    try {
      const normativaExistente =
        await TB_Armonizacion_Normativa_ModificadaPor.findOne({
          where: {
            CodigoResolucion: decodeURIComponent(CodigoResolucion),
            CodigoNormativaQueDerogoModifico: decodeURIComponent(
              CodigoNormativaQueDerogoModifico
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

// Ruta para eliminar una normativa específica
router.delete(
  "/:CodigoResolucion/:CodigoNormativaQueDerogoModifico",
  async (req, res) => {
    const { CodigoResolucion, CodigoNormativaQueDerogoModifico } = req.params;
    try {
      const resultado = await TB_Armonizacion_Normativa_ModificadaPor.destroy({
        where: {
          CodigoResolucion: decodeURIComponent(CodigoResolucion),
          CodigoNormativaQueDerogoModifico: decodeURIComponent(
            CodigoNormativaQueDerogoModifico
          ),
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
  }
);

module.exports = router;