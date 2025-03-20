import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/login";
import LandingPage from "./pages/landing";
import ManagementPage from "./pages/management";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<LandingPage />}/>
          <Route path="login" element={<LoginPage />}/>
          <Route path='/management*' element={<ManagementPage/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
