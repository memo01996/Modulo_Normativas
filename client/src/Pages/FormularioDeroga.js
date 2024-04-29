import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NormativasDropDownDeroga from "../Components/NormativasDropDownDeroga";
import SearchBox from "../Components/SearchBox";
import "../Css/FormularioNormativas.css";

// Componente que gestiona el formulario de derogación de normativas.
const FormularioDeroga = () => {
  // Estados para gestionar la carga, errores, selecciones y términos de búsqueda.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedcodigo, setselectedcodigo] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [selectedNormativa, setSelectedNormativa] = useState(null);
  const [formData, setFormData] = useState({
    CodigoResolucionModificada: "",
    CodigoResolucionNormativa: "",
    TipoModificacion: "",
  });

  // Verifica si el formulario es válido (campos requeridos no vacíos).
  const isFormValid = () => {
    const requiredFields = [
      "CodigoResolucionModificada",
      "CodigoResolucionNormativa",
    ];
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim()
    );
  };

  // Obtiene las normativas según el código seleccionado y el término de búsqueda.
  const fetchNormativas = useCallback(async () => {
    try {
      const queryParams =
        selectedcodigo !== "Todos"
          ? { CodigoResolucionModificada: selectedcodigo }
          : {};
      const response = await axios.get("http://localhost:3001/Derogada", {
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

  // Llama a fetchNormativas cuando el componente se monta y cuando cambian las dependencias.
  useEffect(() => {
    fetchNormativas();
  }, [fetchNormativas]);

  // Selecciona una normativa de la lista para editarla o eliminarla.
  const handleSelectNormativa = (normativa) => {
    if (
      selectedNormativa &&
      selectedNormativa.CodigoResolucionModificada ===
        normativa.CodigoResolucionModificada &&
      selectedNormativa.CodigoResolucionNormativa ===
        normativa.CodigoResolucionNormativa
    ) {
      setSelectedNormativa(null);
      setFormData({
        CodigoResolucionModificada: "",
        CodigoResolucionNormativa: "",
        TipoModificacion: "",
      });
    } else {
      setSelectedNormativa(normativa);
      setFormData({ ...normativa });
    }
  };

  // Actualiza el término de búsqueda en el estado y realiza una nueva búsqueda.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchNormativas(e.target.value);
  };

  // Actualiza el estado del formulario con los cambios en los campos de texto.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Verifica si ya existe una normativa con los mismos códigos en la base de datos.
  const verificarExistenciaNormativa = async (
    codigoResolucionModificada,
    codigoResolucionNormativa
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/Derogada/existencia`,
        {
          params: {
            CodigoResolucionModificada: codigoResolucionModificada,
            CodigoResolucionNormativa: codigoResolucionNormativa,
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

  // Maneja la presentación del formulario, incluyendo la verificación de existencia y la ejecución del PUT/POST.
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
          formData.CodigoResolucionModificada,
          formData.CodigoResolucionNormativa
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
          selectedNormativa.CodigoResolucionModificada
        )}/${encodeURIComponent(selectedNormativa.CodigoResolucionNormativa)}`
      : "http://localhost:3001/Modificada";

    try {
      const response = await axios[method](url, formData);
      console.log(response.data);
      setSelectedNormativa(null);
      setFormData({
        CodigoResolucionModificada: "",
        CodigoResolucionNormativa: "",
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

  // Maneja la eliminación de una normativa seleccionada previamente.
  const handleDelete = async () => {
    if (isLoading || !selectedNormativa) return;

    // Solicita confirmación al usuario antes de proceder con la eliminación.
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar esta normativa?"
    );

    if (confirmDelete) {
      setIsLoading(true);

      const { CodigoResolucionModificada, CodigoResolucionNormativa } =
        selectedNormativa;

      try {
        await axios.delete(
          `http://localhost:3001/Derogada/${encodeURIComponent(
            CodigoResolucionModificada
          )}/${encodeURIComponent(CodigoResolucionNormativa)}`
        );
        await fetchNormativas();
        setSelectedNormativa(null);
        setFormData({
          CodigoResolucionModificada: "",
          CodigoResolucionNormativa: "",
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

  // Renderiza el formulario y la tabla de normativas filtradas.
  return (
    <div className="formulario-normativas-container">
      <div>
        <div className="content-container">
          <div className="normativas-table-container">
            <NormativasDropDownDeroga
              selectedcodigo={selectedcodigo}
              setselectedcodigo={setselectedcodigo}
            />
            <SearchBox
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
            />
            {/* Resto del código de la tabla y formulario */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioDeroga;