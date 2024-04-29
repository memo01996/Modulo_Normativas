import "../Css/SearchBox.css";
import React from "react";

// Este componente representa una caja de búsqueda.
const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return (
    // Renderiza un campo de entrada para el texto de búsqueda
    <input
      type="text" // Tipo de entrada es texto
      placeholder="Buscar..." // Texto de marcador de posición que se muestra cuando la entrada está vacía
      value={searchTerm} // Valor actual del término de búsqueda
      onChange={setSearchTerm} // Función que actualiza el estado del término de búsqueda en el componente padre
    />
  );
};

export default SearchBox;