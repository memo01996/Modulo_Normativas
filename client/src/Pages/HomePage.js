import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Css/HomePage.css";
import YearDropDown from "../Components/YearDropDown";
import SearchBox from "../Components/SearchBox";
import NormativasTable from "../Components/NormativasTable";

const HomePage = () => {
  const [listaFiltrada, setListaFiltrada] = useState([]); // Almacena la lista de normativas filtradas
  const [selectedYear, setSelectedYear] = useState("Todos"); // Año seleccionado en el filtro
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda actual
  const [expandedRows, setExpandedRows] = useState({}); // Controla las filas expandidas en la tabla
  const [isSidebarCollapsed] = useState({}); // Estado para el colapso de la barra lateral

  // Función para descargar normativas como PDF
  const downloadNormativa = (CodigoResolucion, Anio) => {
    const formattedCodigo = CodigoResolucion.replace(/\//g, "-");
    const downloadUrl = `https://www.conatel.gob.hn/doc/Regulacion/resoluciones/${Anio}/${formattedCodigo}.pdf`;
    window.open(downloadUrl, "_blank");
  };

  // Maneja la expansión y colapso de filas en la tabla
  const handleExpandClick = (CodigoResolucion) => {
    const encodedCodigoResolucion = encodeURIComponent(CodigoResolucion);
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [encodedCodigoResolucion]: !prevExpandedRows[encodedCodigoResolucion],
    }));
  };

  useEffect(() => {
    const fetchAndFilterNormativas = async () => {
      try {
        const queryParams =
          selectedYear !== "Todos" ? { Anio: selectedYear } : {};
        const response = await axios.get("http://localhost:3001/Normativas", {
          params: queryParams,
        });
        const filteredList = response.data.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setListaFiltrada(filteredList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchAndFilterNormativas();
  }, [selectedYear, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="homepage">
      <div className="dropdowns-container">
        <YearDropDown
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <SearchBox searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
      </div>
      <NormativasTable
        isSidebarCollapsed={isSidebarCollapsed}
        listaFiltrada={listaFiltrada}
        expandedRows={expandedRows}
        handleExpandClick={handleExpandClick}
        downloadNormativa={downloadNormativa}
      />
    </div>
  );
};

export default HomePage;