import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/YearDropDown.css";

// Este componente proporciona un menú desplegable que permite a los usuarios elegir entre diferentes
// códigos de resolución relacionados con servicios.
const NormativasDropDownServicio = ({ selectedcodigo, setselectedcodigo }) => {
  // Estado para almacenar la lista de códigos disponibles.
  const [codigos, setCodigos] = useState([""]);

  // useEffect para cargar los códigos de resolución cuando el componente se monte por primera vez.
  useEffect(() => {
    const fetchCodigosResolucion = async () => {
      try {
        // Realiza una petición GET para obtener los códigos de resolución de clasificaciones de servicios.
        const response = await axios.get(
          "http://localhost:3001/Clasificacion/codigos-resolucion"
        );
        // Comprueba si la respuesta es un array y actualiza el estado con los códigos filtrados y ordenados.
        if (Array.isArray(response.data)) {
          const filteredCodigos = response.data
            .filter((codigo) => codigo != null)
            .sort((a, b) => b - a);
          setCodigos(filteredCodigos);
        } else {
          // Si la respuesta no es un array, muestra un error.
          console.error("Response is not an array: ", response.data);
        }
      } catch (error) {
        // Maneja y muestra los errores si la petición falla.
        console.error("Error fetching codigos de resolucion: ", error);
      }
    };
    // Ejecuta la función de búsqueda de códigos.
    fetchCodigosResolucion();
  }, []);

  // Renderiza el menú desplegable con las opciones de los códigos de resolución.
  return (
    <div className="year-dropdown-container">
      <label htmlFor="year-select">Normativa:</label>
      <select
        id="year-select"
        value={selectedcodigo}
        onChange={(e) => setselectedcodigo(e.target.value)}
        className="year-dropdown"
      >
        {/* Opción predeterminada para mostrar todas las normativas */}
        <option value="">Todas las Normativas</option>
        {/* Mapea cada código de resolución a una opción en el menú desplegable */}
        {codigos.map((codigo) => (
          <option key={codigo} value={codigo}>
            {codigo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NormativasDropDownServicio;