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
      <Route path="*" element={<Navigate to={isMobile ? "/mobile/null" : "/home"} />}></Route>
      <Route path="home" Component={Home}></Route>
      <Route path="table/:id" Component={Table}></Route>
      <Route path="mobile/:id" Component={Mobile}></Route>
    </Routes>
  </Router>
}