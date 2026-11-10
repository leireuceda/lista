import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ToastProvider from './components/ui/ToastProvider'
import BusquedaPage from './pages/BusquedaPage'
import CompartidoPage from './pages/CompartidoPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import ListaPage from './pages/ListaPage'
import NoEncontradaPage from './pages/NoEncontradaPage'
import PapeleraPage from './pages/PapeleraPage'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/listas/l-personal" replace />} />
          <Route path="/listas/:listaId" element={<ListaPage />} />
          <Route path="/papelera" element={<PapeleraPage />} />
          <Route path="/busqueda" element={<BusquedaPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
          <Route path="/compartido/:token" element={<CompartidoPage />} />
          <Route path="*" element={<NoEncontradaPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
