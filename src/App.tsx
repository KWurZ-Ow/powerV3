import Mobile from "./pages/Mobile";
import Table from "./pages/Table";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { isMobile } from 'react-device-detect';

export default function App() {
  return <Router>
    <Routes>
      <Route path="/powerV3/*" element={<Navigate to={isMobile ? "/powerV3/mobile/null" : "/powerV3/home"} />}></Route>
      <Route path="/powerV3/home" Component={Home}></Route>
      <Route path="/powerV3/table/:id" Component={Table}></Route>
      <Route path="/powerV3/mobile/:id" Component={Mobile}></Route>
    </Routes>
  </Router>
}