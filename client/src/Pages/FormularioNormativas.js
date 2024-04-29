import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import YearDropDown from "../Components/YearDropDown";
import SearchBox from "../Components/SearchBox";
import "../Css/FormularioNormativas.css";

const FormularioNormativas = () => {
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [error, setError] = useState(""); // Estado para gestionar errores
  const [selectedYear, setSelectedYear] = useState("Todos"); // Año seleccionado para filtrar normativas
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para filtrar normativas
  const [listaFiltrada, setListaFiltrada] = useState([]); // Lista de normativas filtradas
  const [selectedNormativa, setSelectedNormativa] = useState(null); // Normativa seleccionada para edición o eliminación
  const [formData, setFormData] = useState({
    // Estado del formulario para la creación o edición de normativas
    Anio: "",
    CodigoResolucion: "",
    ClasificacionGeneral: "",
    PalabrasClaves: "",
    Asunto: "",
    FechaEmision: "",
    FechaVigencia: "",
    FechaPublicacion: "",
    Observaciones: "",
    Estado: "",
    SistemaFecha: "",
    SistemaUsuario: "",
    Servicios: "",
  });

  // Verifica si el formulario es válido antes de enviar
  const isFormValid = () => {
    const requiredFields = [
      "Anio",
      "CodigoResolucion",
      "FechaEmision",
      "FechaVigencia",
      "FechaPublicacion",
      "SistemaFecha",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim()
    );
  };

  // Función para obtener las normativas según los filtros aplicados
  const fetchNormativas = useCallback(async () => {
    try {
      const queryParams =
        selectedYear !== "Todos" ? { Anio: selectedYear } : {};
      const response = await axios.get("http://localhost:3001/Normativas", {
        params: queryParams,
      });
      const filteredData = response.data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setListaFiltrada(filteredData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, [selectedYear, searchTerm]);

  useEffect(() => {
    fetchNormativas();
  }, [fetchNormativas]);

  // Maneja la selección de una normativa de la lista
  const handleSelectNormativa = (normativa) => {
    if (
      selectedNormativa &&
      selectedNormativa.CodigoResolucion === normativa.CodigoResolucion
    ) {
      setSelectedNormativa(null);
      setFormData({
        Anio: "",
        CodigoResolucion: "",
        ClasificacionGeneral: "",
        PalabrasClaves: "",
        Asunto: "",
        FechaEmision: "",
        FechaVigencia: "",
        FechaPublicacion: "",
        Observaciones: "",
        Estado: "",
        SistemaFecha: "",
        SistemaUsuario: "",
        Servicios: "",
      });
    } else {
      setSelectedNormativa(normativa);
      setFormData({ ...normativa });
    }
  };

  // Maneja los cambios en el cuadro de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchNormativas(e.target.value);
  };

  // Maneja los cambios en los campos de entrada del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isFormValid()) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const method = selectedNormativa ? "put" : "post";
    const url = selectedNormativa
      ? `http://localhost:3001/Normativas/${encodeURIComponent(
          selectedNormativa.CodigoResolucion
        )}`
      : "http://localhost:3001/Normativas";

    try {
      await axios[method](url, formData);
      setSelectedNormativa(null);
      setFormData({
        Anio: "",
        CodigoResolucion: "",
        ClasificacionGeneral: "",
        PalabrasClaves: "",
        Asunto: "",
        FechaEmision: "",
        FechaVigencia: "",
        FechaPublicacion: "",
        Observaciones: "",
        Estado: "",
        SistemaFecha: "",
        SistemaUsuario: "",
        Servicios: "",
      });
      await fetchNormativas();
    } catch (error) {
      console.error("Error processing the form: ", error);
      setError(
        error.response?.data?.message ||
          "Hubo un problema al procesar el formulario."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja la eliminación de una normativa
  const handleDelete = async () => {
    if (isLoading || !selectedNormativa) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres derogar esta normativa?"
    );

    if (confirmDelete) {
      setIsLoading(true);

      const encodedCodigoResolucion = encodeURIComponent(
        selectedNormativa.CodigoResolucion
      );
      try {
        await axios.delete(
          `http://localhost:3001/Normativas/${encodedCodigoResolucion}`,
          {
            data: { Estado: "Derogada" },
          }
        );
        setSelectedNormativa(null);
        setFormData({
          Anio: "",
          CodigoResolucion: "",
          ClasificacionGeneral: "",
          PalabrasClaves: "",
          Asunto: "",
          FechaEmision: "",
          FechaVigencia: "",
          FechaPublicacion: "",
          Observaciones: "",
          Estado: "",
          SistemaFecha: "",
          SistemaUsuario: "",
          Servicios: "",
        });
        await fetchNormativas();
      } catch (error) {
        console.error("Error deleting the normativa: ", error);
        setError("No se pudo derogar la normativa seleccionada.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="formulario-normativas-container">
      <div>
        <div className="content-container">
          <div className="normativas-table-container">
            <YearDropDown
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
            <SearchBox
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
            />
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Año</th>
                  <th>Normativa</th>
                  <th>Aspectos Regulados</th>
                  <th>Servicios</th>
                  <th>Fecha Publicación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {listaFiltrada.map((item) => (
                  <React.Fragment
                    key={encodeURIComponent(item.CodigoResolucion)}
                  >
                    <tr
                      className={
                        selectedNormativa?.CodigoResolucion ===
                        item.CodigoResolucion
                          ? "selected"
                          : ""
                      }
                    >
                      <td>
                        <button
                          className={`select-button ${
                            selectedNormativa?.CodigoResolucion ===
                            item.CodigoResolucion
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleSelectNormativa(item)}
                          aria-label="Seleccionar"
                        >
                          {selectedNormativa?.CodigoResolucion ===
                          item.CodigoResolucion
                            ? "✔️"
                            : "🔲"}
                        </button>
                      </td>
                      <td>{item.Anio || "N/A"}</td>
                      <td>{item.CodigoResolucion || "N/A"}</td>
                      <td>{item.ClasificacionGeneral || "N/A"}</td>
                      <td>{item.Servicios || "N/A"}</td>
                      <td>{item.FechaPublicacion || "N/A"}</td>
                      <td>{item.Estado || "N/A"}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="formulario-normativas">
            <form onSubmit={handleSubmit}>
              <label htmlFor="Anio">*Año</label>
              <input
                type="text"
                id="Anio"
                name="Anio"
                value={formData.Anio}
                onChange={handleInputChange}
              />
              <label htmlFor="CodigoResolucion">*Normativa</label>
              <input
                type="text"
                id="CodigoResolucion"
                name="CodigoResolucion"
                value={formData.CodigoResolucion}
                onChange={handleInputChange}
              />
              <label htmlFor="ClasificacionGeneral">Aspectos Regulados</label>
              <input
                type="text"
                id="ClasificacionGeneral"
                name="ClasificacionGeneral"
                value={formData.ClasificacionGeneral}
                onChange={handleInputChange}
              />
              <label htmlFor="PalabrasClaves">Palabras Claves</label>
              <input
                type="text"
                id="PalabrasClaves"
                name="PalabrasClaves"
                value={formData.PalabrasClaves}
                onChange={handleInputChange}
              />
              <label htmlFor="Asunto">Asunto</label>
              <input
                type="text"
                id="Asunto"
                name="Asunto"
                value={formData.Asunto}
                onChange={handleInputChange}
              />
              <label htmlFor="FechaEmision">*Fecha Emision</label>
              <input
                type="text"
                id="FechaEmision"
                name="FechaEmision"
                value={formData.FechaEmision}
                onChange={handleInputChange}
              />
              <label htmlFor="FechaVigencia">*Fecha Vigencia</label>
              <input
                type="text"
                id="FechaVigencia"
                name="FechaVigencia"
                value={formData.FechaVigencia}
                onChange={handleInputChange}
              />
              <label htmlFor="FechaPublicacion">*Fecha Publicación</label>
              <input
                type="text"
                id="FechaPublicacion"
                name="FechaPublicacion"
                value={formData.FechaPublicacion}
                onChange={handleInputChange}
              />
              <label htmlFor="Observaciones">Observaciones</label>
              <input
                type="text"
                id="Observaciones"
                name="Observaciones"
                value={formData.Observaciones}
                onChange={handleInputChange}
              />
              <label htmlFor="Estado">Estado</label>
              <input
                type="text"
                id="Estado"
                name="Estado"
                value={formData.Estado}
                onChange={handleInputChange}
              />
              <label htmlFor="SistemaFecha">*Sistema Fecha</label>
              <input
                type="text"
                id="SistemaFecha"
                name="SistemaFecha"
                value={formData.SistemaFecha}
                onChange={handleInputChange}
              />
              <label htmlFor="SistemaUsuario">Sistema Usuario</label>
              <input
                type="text"
                id="SistemaUsuario"
                name="SistemaUsuario"
                value={formData.SistemaUsuario}
                onChange={handleInputChange}
              />
              <label htmlFor="Servicios">Servicios</label>
              <input
                type="text"
                id="Servicios"
                name="Servicios"
                value={formData.Servicios}
                onChange={handleInputChange}
              />
              <div className="form-buttons">
                {error && <div className="error-message">{error}</div>} //
                Muestra mensajes de error si los hay
                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading} // Deshabilita el botón mientras se cargan datos
                >
                  {isLoading ? "Guardando..." : "Guardar"} // Cambia la etiqueta
                  del botón según el estado de carga
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete} // Maneja el evento de clic para borrar
                  disabled={isLoading || !selectedNormativa} // Deshabilita el botón si está cargando o no hay selección
                >
                  {isLoading ? "Derrogando..." : "Derrogar"} // Cambia la
                  etiqueta del botón según el estado de carga
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioNormativas;