import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NormativasDropDown from "../Components/NormativasDropDown";
import SearchBox from "../Components/SearchBox";
import "../Css/FormularioNormativas.css";

// Componente principal que maneja la funcionalidad del formulario de normativas.
const FormularioNormativas = () => {
  // Estados para el manejo de carga, errores, selección y términos de búsqueda.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedcodigo, setselectedcodigo] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [selectedNormativa, setSelectedNormativa] = useState(null);
  const [formData, setFormData] = useState({
    CodigoResolucion: "",
    CodigoNormativaQueDerogoModifico: "",
    TipoModificacion: "",
  });

  // Valida que los campos requeridos estén completos y no vacíos.
  const isFormValid = () => {
    const requiredFields = [
      "CodigoResolucion",
      "CodigoNormativaQueDerogoModifico",
      "TipoModificacion",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim()
    );
  };

  // Obtiene las normativas basadas en los criterios seleccionados.
  const fetchNormativas = useCallback(async () => {
    try {
      const queryParams =
        selectedcodigo !== "Todos" ? { CodigoResolucion: selectedcodigo } : {};
      const response = await axios.get("http://localhost:3001/Modificada", {
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

  // Efecto para cargar las normativas al cambiar los parámetros de búsqueda.
  useEffect(() => {
    fetchNormativas();
  }, [fetchNormativas]);

  // Maneja la selección de una normativa de la lista.
  const handleSelectNormativa = (normativa) => {
    if (
      selectedNormativa &&
      selectedNormativa.CodigoResolucion === normativa.CodigoResolucion &&
      selectedNormativa.CodigoNormativaQueDerogoModifico ===
        normativa.CodigoNormativaQueDerogoModifico
    ) {
      setSelectedNormativa(null);
      setFormData({
        CodigoResolucion: "",
        CodigoNormativaQueDerogoModifico: "",
        TipoModificacion: "",
      });
    } else {
      setSelectedNormativa(normativa);
      setFormData({ ...normativa });
    }
  };

  // Actualiza el término de búsqueda y realiza una nueva búsqueda.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchNormativas(e.target.value);
  };

  // Actualiza los campos del formulario cuando hay cambios.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Verifica la existencia de una normativa antes de realizar una acción.
  const verificarExistenciaNormativa = async (
    codigoResolucion,
    codigoNormativaQueDerogoModifico
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/Modificada/existencia`,
        {
          params: {
            CodigoResolucion: codigoResolucion,
            CodigoNormativaQueDerogoModifico: codigoNormativaQueDerogoModifico,
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

  // Gestiona el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isFormValid()) {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const codigoExists = selectedNormativa
      ? false
      : await verificarExistenciaNormativa(
          formData.CodigoResolucion,
          formData.CodigoNormativaQueDerogoModifico
        );

    if (codigoExists) {
      setError(
        "El Código de Resolución ya existe con ese Código de Normativa Que Derogo/Modifico en la base de datos."
      );
      setIsLoading(false);
      return;
    }

    const method = selectedNormativa ? "put" : "post";
    const url = selectedNormativa
      ? `http://localhost:3001/Modificada/${encodeURIComponent(
          selectedNormativa.CodigoResolucion
        )}/${encodeURIComponent(
          selectedNormativa.CodigoNormativaQueDerogoModifico
        )}`
      : "http://localhost:3001/Modificada";

    try {
      const response = await axios[method](url, formData);
      console.log(response.data);
      setSelectedNormativa(null);
      setFormData({
        CodigoResolucion: "",
        CodigoNormativaQueDerogoModifico: "",
        TipoModificacion: "",
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

  // Maneja la eliminación de normativas con confirmación.
  const handleDelete = async () => {
    if (isLoading || !selectedNormativa) return;

    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar esta normativa?"
    );

    if (confirmDelete) {
      setIsLoading(true);

      const { CodigoResolucion, CodigoNormativaQueDerogoModifico } =
        selectedNormativa;

      try {
        await axios.delete(
          `http://localhost:3001/Modificada/${encodeURIComponent(
            CodigoResolucion
          )}/${encodeURIComponent(CodigoNormativaQueDerogoModifico)}`
        );
        await fetchNormativas();
        setSelectedNormativa(null);
        setFormData({
          CodigoResolucion: "",
          CodigoNormativaQueDerogoModifico: "",
          TipoModificacion: "",
        });
        setError("");
      } catch (error) {
        console.error("Error deleting the normativa: ", error);
        setError("No se pudo eliminar la normativa seleccionada.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Renderiza el formulario y la tabla de normativas.
  return (
    <div className="formulario-normativas-container">
      <div>
        <div className="content-container">
          <div className="normativas-table-container">
            <NormativasDropDown
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
                  <th>Normativa</th>
                  <th>Normativa Que Derogo/Modifico</th>
                  <th>Tipo de Modificacion</th>
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
                        selectedNormativa?.CodigoNormativaQueDerogoModifico ===
                          item.CodigoNormativaQueDerogoModifico
                          ? "selected"
                          : ""
                      }
                    >
                      <td>
                        <button
                          className={`select-button ${
                            selectedNormativa?.CodigoResolucion ===
                              item.CodigoResolucion &&
                            selectedNormativa?.CodigoNormativaQueDerogoModifico ===
                              item.CodigoNormativaQueDerogoModifico
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleSelectNormativa(item)}
                          aria-label="Seleccionar"
                        >
                          {selectedNormativa?.CodigoResolucion ===
                            item.CodigoResolucion &&
                          selectedNormativa?.CodigoNormativaQueDerogoModifico ===
                            item.CodigoNormativaQueDerogoModifico
                            ? "✔️"
                            : "🔲"}
                        </button>
                      </td>
                      <td>{item.CodigoResolucion || "N/A"}</td>
                      <td>{item.CodigoNormativaQueDerogoModifico || "N/A"}</td>
                      <td>{item.TipoModificacion || "N/A"}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="formulario-normativas">
            <form onSubmit={handleSubmit}>
              <label htmlFor="CodigoResolucion">*Normativa</label>
              <input
                type="text"
                id="CodigoResolucion"
                name="CodigoResolucion"
                value={formData.CodigoResolucion}
                onChange={handleInputChange}
              />
              <label htmlFor="CodigoNormativaQueDerogoModifico">
                *Normativa Que Derogo/Modifico
              </label>
              <input
                type="text"
                id="CodigoNormativaQueDerogoModifico"
                name="CodigoNormativaQueDerogoModifico"
                value={formData.CodigoNormativaQueDerogoModifico}
                onChange={handleInputChange}
              />
              <label htmlFor="TipoModificacion">Tipo de Modificación</label>
              <input
                type="text"
                id="TipoModificacion"
                name="TipoModificacion"
                value={formData.TipoModificacion}
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

export default FormularioNormativas;