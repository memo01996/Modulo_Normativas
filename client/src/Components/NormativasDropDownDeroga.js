import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/YearDropDown.css";

// Este componente crea un menú desplegable que permite a los usuarios seleccionar códigos de resolución
// específicos para normativas que han sido derogadas.
const NormativasDropDownDeroga = ({ selectedcodigo, setselectedcodigo }) => {
  // Estado para mantener la lista de códigos de resolución disponibles.
  const [codigos, setCodigos] = useState([""]);

  // useEffect se utiliza para obtener los códigos de resolución cuando el componente se monta.
  useEffect(() => {
    const fetchCodigosResolucion = async () => {
      try {
        // Llamada a la API para obtener los códigos de resolución de normativas derogadas.
        const response = await axios.get(
          "http://localhost:3001/Derogada/codigos-resolucion"
        );
        // Si la respuesta es un array, filtra y ordena los códigos, y los establece en el estado.
        if (Array.isArray(response.data)) {
          const filteredCodigos = response.data
            .filter((codigo) => codigo != null)
            .sort((a, b) => b - a);
          setCodigos(filteredCodigos);
        } else {
          // Si la respuesta no es un array, registra un error.
          console.error("Response is not an array: ", response.data);
        }
      } catch (error) {
        // Captura y registra errores si la petición falla.
        console.error("Error fetching codigos de resolucion: ", error);
      }
    };
    // Invoca la función de búsqueda de códigos de resolución.
    fetchCodigosResolucion();
  }, []);

  // Renderiza el componente select (menú desplegable) con opciones de códigos de resolución.
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
        {/* Itera sobre la lista de códigos para renderizar las opciones del menú desplegable. */}
        {codigos.map((codigo) => (
          <option key={codigo} value={codigo}>
            {codigo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NormativasDropDownDeroga;