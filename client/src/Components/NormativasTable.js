import React from "react";
import NormativaDetails from "./NormativaDetails";
import "../Css/NormativasTable.css";

// Este componente es una tabla que lista las normativas y permite expandir cada fila para ver más detalles.
const NormativasTable = ({
  listaFiltrada, // Array de objetos de normativas filtradas para mostrar en la tabla
  expandedRows, // Objeto que guarda el estado de las filas expandidas
  handleExpandClick, // Función para manejar clics en el botón de expandir/contraer
  downloadNormativa, // Función para manejar la descarga de la normativa
  isSidebarCollapsed, // Estado que indica si la barra lateral está colapsada
}) => {
  // Clase condicional para la tabla basada en si la barra lateral está colapsada o no
  const tableClassName = `table ${
    isSidebarCollapsed ? "table-expanded" : "table-collapsed"
  }`;

  return (
    // Renderiza la tabla con clases dinámicas
    <table className={tableClassName}>
      <thead>
        {/* Cabeza de la tabla con los títulos de las columnas */}
        <tr>
          <th></th> {/* Columna para botones de expandir/contraer */}
          <th>Año</th>
          <th>Normativa</th>
          <th>Aspectos Regulados</th>
          <th>Servicios</th>
          <th>Fecha Publicación</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {/* Mapeo de cada normativa a una fila de la tabla */}
        {listaFiltrada.map((item) => (
          <React.Fragment key={encodeURIComponent(item.CodigoResolucion)}>
            <tr>
              <td>
                {/* Botón para expandir/contraer detalles de la normativa */}
                <button
                  className="expand-button"
                  onClick={() => handleExpandClick(item.CodigoResolucion)}
                >
                  {/* Indicador de si la fila está expandida o no */}
                  {expandedRows[encodeURIComponent(item.CodigoResolucion)]
                    ? "-"
                    : "+"}
                </button>
              </td>
              {/* Datos de la normativa */}
              <td>{item.Anio || "N/A"}</td>
              <td
                className="link-normativa"
                onClick={() =>
                  downloadNormativa(item.CodigoResolucion, item.Anio)
                }
              >
                {item.CodigoResolucion || "N/A"}
              </td>
              <td>{item.ClasificacionGeneral || "N/A"}</td>
              <td>{item.Servicios || "N/A"}</td>
              <td>{item.FechaPublicacion || "N/A"}</td>
              <td>{item.Estado || "N/A"}</td>
            </tr>
            {/* Fila adicional que muestra los detalles si la fila está expandida */}
            {expandedRows[encodeURIComponent(item.CodigoResolucion)] && (
              <tr key={`details-${encodeURIComponent(item.CodigoResolucion)}`}>
                <td colSpan="7">
                  {/* Componente para detalles de la normativa */}
                  <NormativaDetails CodigoResolucion={item.CodigoResolucion} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default NormativasTable;