import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NormativasDropDownServicio from "../Components/NormativasDropDownServicio";
import SearchBox from "../Components/SearchBox";
import "../Css/FormularioNormativas.css";

const FormularioServicios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedcodigo, setselectedcodigo] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [selectedNormativa, setSelectedNormativa] = useState(null);
  const [formData, setFormData] = useState({
    CodigoResolucion: "",
    CodigoServicio: "",
  });

  const isFormValid = () => {
    const requiredFields = [
      "CodigoResolucion",
      "CodigoServicio",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim()
    );
  };

  const fetchNormativas = useCallback(async () => {
    try {
      const queryParams =
        selectedcodigo !== "Todos"
          ? { CodigoResolucion: selectedcodigo }
          : {};
      const response = await axios.get("http://localhost:3001/Clasificacion", {
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
  }, [selectedcodigo, searchTerm]);

  useEffect(() => {
    fetchNormativas();
  }, [fetchNormativas]);

  const handleSelectNormativa = (normativa) => {
    if (
      selectedNormativa &&
      selectedNormativa.CodigoResolucion ===
        normativa.CodigoResolucion &&
      selectedNormativa.CodigoServicio ===
        normativa.CodigoServicio
    ) {
      setSelectedNormativa(null);
      setFormData({
        CodigoResolucion: "",
        CodigoServicio: "",
      });
    } else {
      setSelectedNormativa(normativa);
      setFormData({ ...normativa });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchNormativas(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const verificarExistenciaNormativa = async (
    codigoResolucion,
    codigoServicio
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/Clasificacion/existencia`,
        {
          params: {
            CodigoResolucion: codigoResolucion,
            CodigoServicio: codigoServicio,
          },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error verificando la existencia de la normativa: ", error);
      setError("Error al verificar la existencia de la normativa.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
  
    if (!isFormValid()) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    const codigoExists = selectedNormativa ? false : await verificarExistenciaNormativa(
      formData.CodigoResolucion,
      formData.CodigoServicio
    );
  
    if (codigoExists) {
      setError("El Código de Resolución ya existe con ese Código de Normativa Que Derogo/Modifico en la base de datos.");
      setIsLoading(false);
      return;
    }
  
    const method = selectedNormativa ? "put" : "post";
    const url = selectedNormativa
      ? `http://localhost:3001/Clasificacion/${encodeURIComponent(selectedNormativa.CodigoResolucion)}/${encodeURIComponent(selectedNormativa.CodigoServicio)}`
      : "http://localhost:3001/Clasificacion";
  
    try {
      const response = await axios[method](url, formData);
      console.log(response.data);
      setSelectedNormativa(null);
      setFormData({
        CodigoResolucion: "",
        CodigoServicio: "",
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

  const handleDelete = async () => {
    if (isLoading || !selectedNormativa) return;

    // Pide confirmación al usuario
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar esta normativa?"
    );

    // Si el usuario confirma, procede con la eliminación
    if (confirmDelete) {
      setIsLoading(true);

      const { CodigoResolucion, CodigoServicio } =
        selectedNormativa;

      try {
        await axios.delete(
          `http://localhost:3001/Clasificacion/${encodeURIComponent(
            CodigoResolucion
          )}/${encodeURIComponent(CodigoServicio)}`
        );
        // Si la eliminación es exitosa, actualiza la lista de normativas
        await fetchNormativas();
        setSelectedNormativa(null);
        setFormData({
          CodigoResolucion: "",
          CodigoServicio: "",
        });
        setError(""); // Limpia cualquier mensaje de error previo
      } catch (error) {
        console.error("Error deleting the normativa: ", error);
        setError("No se pudo eliminar la normativa seleccionada.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si el usuario cancela, simplemente termina la función
      return;
    }
  };

  return (
    <div className="formulario-normativas-container">
      <div>
        <div className="content-container">
          <div className="normativas-table-container">
            <NormativasDropDownServicio
              selectedcodigo={selectedcodigo}
              setselectedcodigo={setselectedcodigo}
            />
            <SearchBox
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
            />
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Codigo Resolucion</th>
                  <th>Codigo Servicio</th>
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
                          item.CodigoResolucion &&
                        selectedNormativa?.CodigoServicio ===
                          item.CodigoServicio
                          ? "selected"
                          : ""
                      }
                    >
                      <td>
                        <button
                          className={`select-button ${
                            selectedNormativa?.CodigoResolucion ===
                              item.CodigoResolucion &&
                            selectedNormativa?.CodigoServicio ===
                              item.CodigoServicio
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleSelectNormativa(item)}
                          aria-label="Seleccionar"
                        >
                          {selectedNormativa?.CodigoResolucion ===
                            item.CodigoResolucion &&
                          selectedNormativa?.CodigoServicio ===
                            item.CodigoServicio
                            ? "✔️"
                            : "🔲"}
                        </button>
                      </td>
                      <td>{item.CodigoResolucion || "N/A"}</td>
                      <td>{item.CodigoServicio || "N/A"}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="formulario-normativas">
            <form onSubmit={handleSubmit}>
              <label htmlFor="CodigoResolucion">
                *Codigo Resolucion
              </label>
              <input
                type="text"
                id="CodigoResolucion"
                name="CodigoResolucion"
                value={formData.CodigoResolucion}
                onChange={handleInputChange}
              />
              <label htmlFor="CodigoServicio">
                *Codigo Servicio
              </label>
              <input
                type="text"
                id="CodigoServicio"
                name="CodigoServicio"
                value={formData.CodigoServicio}
                onChange={handleInputChange}
              />
              <div className="form-buttons">
                {error && <div className="error-message">{error}</div>}
                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete}
                  disabled={isLoading || !selectedNormativa}
                >
                  {isLoading ? "Borrando..." : "Borrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioServicios;