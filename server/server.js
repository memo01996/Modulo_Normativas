// Importaciones y configuraciones iniciales
const express = require("express"); // Importa la librería Express para crear el servidor.
const db = require("./models"); // Importa el modelo de la base de datos.
const {
  TB_Armonizacion_ResolucionNormativa,
  TB_Armonizacion_Normativa_ModificadaPor,
  TB_Armonizacion_Normativa_DerogaModificaA,
  TB_Armonizacion_ClasificacionServicios,
} = require("./models"); // Destructura y obtiene modelos específicos de Sequelize.
const cors = require("cors"); // Importa el middleware CORS para permitir solicitudes cruzadas.

// Inicialización de Express
const app = express(); // Crea una instancia de Express.

// Middleware para parsear JSON
app.use(express.json()); // Habilita el middleware para parsear JSON, lo que permite recibir y enviar JSON en las solicitudes y respuestas.
app.use(cors()); // Habilita el middleware CORS en todas las rutas, permitiendo que la API sea accesible desde dominios diferentes al servidor.

// Importa tus routers aquí
const ResolucionNormativaRouter = require("./routes/TB_Armonizacion_ResolucionNormativa"); // Importa el enrutador para las resoluciones normativas.
const ModificadaPorRouter = require("./routes/TB_Armonizacion_Normativa_ModificadaPor"); // Importa el enrutador para las normativas modificadas.
const DerogadaRouter = require("./routes/TB_Armonizacion_Normativa_DerogaModificaA"); // Importa el enrutador para las normativas derogadas.
const ClasificacionRouter = require("./routes/TB_Armonizacion_ClasificacionServicios"); // Importa el enrutador para la clasificación de servicios.

// Usa tus routers aquí
app.use("/Normativas", ResolucionNormativaRouter); // Establece las rutas para las normativas, usando el enrutador importado.
app.use("/Modificada", ModificadaPorRouter); // Establece las rutas para las normativas modificadas.
app.use("/Derogada", DerogadaRouter); // Establece las rutas para las normativas derogadas.
app.use("/Clasificacion", ClasificacionRouter); // Establece las rutas para la clasificación de servicios.

// Iniciar servidor
const port = process.env.PORT || 3001; // Define el puerto del servidor usando una variable de entorno o el puerto 3001 por defecto.
app.listen(port, () => console.log(`Server running on port ${port}`)); // Inicia el servidor en el puerto definido y registra un mensaje en la consola.
