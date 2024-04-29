import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MySidebar from "./Components/MySidebar";
import HomePage from "./Pages/HomePage";
import FormularioNormativas from "./Pages/FormularioNormativas";
import FormularioModifica from "./Pages/FormularioModifica";
import FormularioDeroga from "./Pages/FormularioDeroga";
import FormularioServicios from "./Pages/FormularioServicios";
import { Button, Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false); // Estado para controlar el colapso de la barra lateral

  const toggleCollapsed = () => setCollapsed(!collapsed); // Función para alternar el colapso de la barra lateral

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {" "}
        // Configura el layout principal con un mínimo de altura del 100% del
        viewport
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="sidebar"
        >
          <MySidebar />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ padding: 0, display: "flex", alignItems: "center" }}
          >
            <Button
              type="text"
              onClick={toggleCollapsed}
              style={{ marginLeft: 16 }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            {/* Rest of the header content */}
          </Header>
          <Content style={{ margin: "0 16px", transition: "margin-left .2s" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Routes>
                <Route
                  path="/"
                  element={<HomePage isSidebarCollapsed={collapsed} />}
                />
                <Route
                  path="/formulario-normativas"
                  element={
                    <FormularioNormativas isSidebarCollapsed={collapsed} />
                  }
                />
                <Route
                  path="/formulario-modifica"
                  element={
                    <FormularioModifica isSidebarCollapsed={collapsed} />
                  }
                />
                <Route
                  path="/formulario-deroga"
                  element={<FormularioDeroga isSidebarCollapsed={collapsed} />}
                />
                <Route
                  path="/formulario-servicios"
                  element={
                    <FormularioServicios isSidebarCollapsed={collapsed} />
                  }
                />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;