import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../Css/MySidebar.css";

// Destructuramos Sider de Layout para usarlo directamente en nuestro componente.
const { Sider } = Layout;

const MySidebar = () => {
  // useNavigate es un hook de React Router v6 que nos permite cambiar de ruta.
  let navigate = useNavigate();

  // handleNavigation es una función que recibe una ruta y utiliza navigate para cambiar a ella.
  const handleNavigation = (route) => {
    navigate(route);
  };

  // Renderizamos el componente Sider de Ant Design que funciona como nuestra barra lateral de navegación.
  return (
    <Sider>
      <div className="logo" />
      {/* Menu es el componente de Ant Design para los ítems del menú de la barra lateral */}
      <Menu
        mode="inline" // Define el modo del menú como 'inline' que es el predeterminado para un menú lateral
        className="menu-bar" // Clase para estilos personalizados
        defaultSelectedKeys={["1"]} // Establece el ítem del menú seleccionado por defecto
        items={[
          // Define los ítems del menú
          {
            key: "1", // Clave única para el ítem de inicio
            icon: <HomeOutlined />, // Ícono para el ítem de inicio
            label: "Inicio", // Texto para el ítem de inicio
            onClick: () => handleNavigation("/"), // Manejador de click que usa la función de navegación
          },
          {
            key: "sub1", // Clave única para el grupo de formularios
            icon: <AppstoreOutlined />, // Ícono para el grupo de formularios
            label: "Formularios", // Texto para el grupo de formularios
            children: [
              // Define un submenú para los distintos formularios
              {
                key: "task-1", // Clave única para el ítem de formulario de normativas
                label: "Formulario Normativas", // Texto para el ítem de formulario de normativas
                onClick: () => handleNavigation("/formulario-normativas"), // Manejador de click que usa la función de navegación
              },
              {
                key: "task-2", // Clave única para el ítem de formulario modifica
                label: "Formulario Modifica", // Texto para el ítem de formulario modifica
                onClick: () => handleNavigation("/formulario-modifica"), // Manejador de click que usa la función de navegación
              },
              {
                key: "task-3", // Clave única para el ítem de formulario deroga
                label: "Formulario Deroga", // Texto para el ítem de formulario deroga
                onClick: () => handleNavigation("/formulario-deroga"), // Manejador de click que usa la función de navegación
              },
              {
                key: "task-4", // Clave única para el ítem de formulario servicios
                label: "Formulario Servicios", // Texto para el ítem de formulario servicios
                onClick: () => handleNavigation("/formulario-servicios"), // Manejador de click que usa la función de navegación
              },
            ],
          },
        ]}
      />
    </Sider>
  );
};

export default MySidebar;