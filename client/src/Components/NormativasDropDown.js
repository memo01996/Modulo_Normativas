import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/YearDropDown.css";

// Componente desplegable que permite seleccionar una normativa específica basándose en su código.
const NormativasDropDown = ({ selectedcodigo, setselectedcodigo }) => {
  // Estado para almacenar la lista de códigos de las resoluciones.
  const [codigos, setCodigos] = useState([""]);

  // Efecto para cargar los códigos de las resoluciones cuando el componente se monta.
  useEffect(() => {
    const fetchCodigosResolucion = async () => {
      try {
        // Realiza una solicitud GET para obtener los códigos de resolución.
        const response = await axios.get(
          "http://localhost:3001/Modificada/codigos-resolucion"
        );
        // Comprueba si la respuesta es un array y actualiza el estado de 'codigos'.
        if (Array.isArray(response.data)) {
          // Filtra los códigos para excluir valores nulos y los ordena.
          const filteredCodigos = response.data
            .filter((codigo) => codigo != null)
            .sort((a, b) => b - a);
          setCodigos(filteredCodigos);
        } else {
          // Maneja casos donde la respuesta no es un array.
          console.error("Response is not an array: ", response.data);
        }
      } catch (error) {
        // Maneja errores en la petición y los imprime en consola.
        console.error("Error fetching codigos de resolucion: ", error);
      }
    };
    // Llama a la función que carga los códigos.
    fetchCodigosResolucion();
  }, []);

  // Renderiza el desplegable con los códigos disponibles.
  return (
    <div className="year-dropdown-container">
      <label htmlFor="year-select">Normativa:</label>
      <select
        id="year-select"
        value={selectedcodigo}
        onChange={(e) => setselectedcodigo(e.target.value)}
        className="year-dropdown"
      >
        {/* Opción por defecto para mostrar todas las normativas. */}
        <option value="">Todas las Normativas</option>
        {/* Renderiza una opción por cada código de resolución disponible. */}
        {codigos.map((codigo) => (
          <option key={codigo} value={codigo}>
            {codigo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NormativasDropDown;