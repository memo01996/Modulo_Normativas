import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/YearDropDown.css";

// Este componente representa un dropdown para seleccionar un año.
const YearDropDown = ({ selectedYear, setSelectedYear }) => {
  const [years, setYears] = useState([""]); // Estado local que almacena los años disponibles para la selección

  // Hook useEffect para obtener los datos una vez que el componente se monte
  useEffect(() => {
    const fetchYears = async () => {
      // Función asincrónica para obtener los años de la API
      try {
        // Llamada a la API para obtener los años
        const response = await axios.get(
          "http://localhost:3001/Normativas/years"
        );
        if (Array.isArray(response.data)) {
          // Verifica si la respuesta es un arreglo
          // Filtra y ordena los años obtenidos de la API
          const filteredYears = response.data
            .filter((year) => year != null)
            .sort((a, b) => b - a);
          setYears(filteredYears); // Actualiza el estado con los años filtrados y ordenados
        } else {
          // Manejo del caso en que la respuesta no es un arreglo
          console.error("Response is not an array: ", response.data);
        }
      } catch (error) {
        // Manejo de errores de la llamada a la API
        console.error("Error fetching years: ", error);
      }
    };
    fetchYears(); // Ejecuta la función fetchYears
  }, []);

  return (
    <div className="year-dropdown-container">
      <label htmlFor="year-select">Año:</label>{" "}
      {/* Etiqueta para el dropdown */}
      <select
        id="year-select" // ID para asociar la etiqueta con el dropdown
        value={selectedYear} // Año seleccionado actualmente
        onChange={(e) => setSelectedYear(e.target.value)} // Manejador de cambio para actualizar el año seleccionado
        className="year-dropdown" // Clase CSS para estilizar el dropdown
      >
        <option value="">Todos los años</option>{" "}
        {/* Opción para seleccionar todos los años */}
        {years.map((year) => (
          <option key={year} value={year}>
            {" "}
            {/* Mapeo de cada año a una opción en el dropdown */}
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearDropDown;