import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { UsuarioProvider } from './context/UsuarioContext'; 
import Home from './pages/Home';
import Pedido from './pages/Pedido';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPedidos from './pages/admin/AdminPedidos';
import PrivateRouteAdmin from './components/PrivateRouteAdmin';
import PrivateRouteUser from './components/PrivateRouteUser';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <UsuarioProvider> {/* ← Para manejar usuarios normales */}
        <AdminProvider> {/* ← Para manejar administradores */}
          <Routes>
            {/* Rutas con Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Ruta protegida para usuarios autenticados */}
              <Route
                path="/pedido"
                element={
                  <PrivateRouteUser>
                    <Pedido />
                  </PrivateRouteUser>
                }
              />

              {/* Rutas protegidas para administradores */}
              <Route
                path="/admin/panel"
                element={
                  <PrivateRouteAdmin>
                    <AdminPanel />
                  </PrivateRouteAdmin>
                }
              />
              <Route
                path="/admin/productos"
                element={
                  <PrivateRouteAdmin>
                    <AdminProductos />
                  </PrivateRouteAdmin>
                }
              />
              <Route
                path="/admin/pedidos"
                element={
                  <PrivateRouteAdmin>
                    <AdminPedidos />
                  </PrivateRouteAdmin>
                }
              />
            </Route>

            {/* Rutas sin Layout (como AdminLogin) */}
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </AdminProvider>
      </UsuarioProvider>
    </Router>
  );
}

export default App;