// Importación de los estilos CSS y módulos necesarios.
import "../Css/NormativaDetails.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

// El componente NormativaDetails recibe una propiedad CodigoResolucion.
const NormativaDetails = ({ CodigoResolucion }) => {
  // Estados para almacenar las normativas modificadas y derogadas.
  const [normativasModificadas, setNormativasModificadas] = useState([]);
  const [normativasDerogadas, setNormativasDerogadas] = useState([]);

  // Variable para verificar si no hay detalles disponibles.
  const noDetailsAvailable =
    normativasModificadas.length === 0 && normativasDerogadas.length === 0;

  // useEffect se ejecuta al montar el componente y cada vez que cambie CodigoResolucion.
  useEffect(() => {
    const fetchNormativaDetails = async () => {
      try {
        // Hace dos llamadas HTTP GET simultáneas para obtener detalles de la normativa modificada y derogada.
        const [modificaResponse, derogaResponse] = await Promise.all([
          axios.get(
            `http://localhost:3001/Normativas/${encodeURIComponent(
              CodigoResolucion
            )}/modifica`
          ),
          axios.get(
            `http://localhost:3001/Normativas/${encodeURIComponent(
              CodigoResolucion
            )}/deroga`
          ),
        ]);
        // Establece los estados con la respuesta de las llamadas.
        setNormativasModificadas(modificaResponse.data);
        setNormativasDerogadas(derogaResponse.data);
      } catch (error) {
        // Maneja errores en las llamadas y los imprime en consola.
        console.error("Error fetching normativa details:", error);
      }
    };

    // Solo llama a fetchNormativaDetails si CodigoResolucion está definido.
    if (CodigoResolucion) {
      fetchNormativaDetails();
    }
  }, [CodigoResolucion]);

  // Renderiza el contenido del componente.
  return (
    <div className="normativa-details">
      {/* Si no hay detalles disponibles, muestra un mensaje indicando esto. */}
      {noDetailsAvailable && (
        <p>No hay detalles disponibles para esta normativa.</p>
      )}
      {/* Si hay detalles disponibles, los muestra en tablas. */}
      {!noDetailsAvailable && (
        <>
          {/* Sección para normativas modificadas. */}
          {normativasModificadas.length > 0 && (
            <div className="table-section">
              <h3>Normativa que Deroga/Modifica</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Normativa</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapea cada normativa modificada a una fila en la tabla. */}
                  {normativasModificadas.map((normativa, index) => (
                    <tr key={index}>
                      <td>{normativa.CodigoResolucionModificada}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Sección para normativas derogadas. */}
          {normativasDerogadas.length > 0 && (
            <div className="table-section">
              <h3>Normativa que la Derogó/Modificó</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Normativa</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapea cada normativa derogada a una fila en la tabla. */}
                  {normativasDerogadas.map((normativa, index) => (
                    <tr key={index}>
                      <td>{normativa.CodigoNormativaQueDerogoModifico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NormativaDetails;