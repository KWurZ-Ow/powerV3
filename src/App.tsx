import Mobile from "./pages/Mobile";
import Table from "./pages/Table";
import {
  Route,
  Routes,
  Navigate,
  HashRouter
} from "react-router-dom";
import { isMobile } from 'react-device-detect';
import { Socket } from "socket.io-client";
export interface childProps {
  backUrl: string;
  frontUrl: String;
  socket?: Socket;
  setPieces?: any;
  setLogs?: any;
}

export default function App() {
  const isProdBackend = false
  const backUrl = isProdBackend ? "https://powerdatabase-pcoe.onrender.com" : "http://localhost:3001/"
  const frontUrl = "https://kwurz-ow.github.io/powerV3"

  return <HashRouter>
    <Routes>
      <Route path="*" element={<Navigate to={isMobile ? "mobile/null" : "/table"} />}></Route>
      <Route path="table/:id?" element={<Table backUrl={backUrl} frontUrl={frontUrl} />}></Route>
      <Route path="mobile/:id" element={<Mobile backUrl={backUrl} frontUrl={frontUrl} />}></Route>
    </Routes>
  </HashRouter>
}