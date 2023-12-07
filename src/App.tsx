import Mobile from "./pages/Mobile";
import Table from "./pages/Table";
import Home from "./pages/Home";
import {
  Route,
  Routes,
  Navigate,
  HashRouter
} from "react-router-dom";
import { isMobile } from 'react-device-detect';
export interface childProps {
  ioUrl: string;
}

export default function App() {
  const isProdBackend = true
  const ioUrl = isProdBackend ? "https://powerdatabase.adaptable.app/" : "http://localhost:3000/"

  return <HashRouter>
    <Routes>
      <Route path="*" element={<Navigate to={isMobile ? "mobile/null" : "/home"} />}></Route>
      <Route path="home" element={<Home ioUrl={ioUrl} />}></Route>
      <Route path="table/:id" element={<Table ioUrl={ioUrl} />}></Route>
      <Route path="mobile/:id" element={<Mobile ioUrl={ioUrl} />}></Route>
    </Routes>
  </HashRouter>
}