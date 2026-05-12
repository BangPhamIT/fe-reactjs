import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import StockInList from "./pages/StockInList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modals from "./components/modal/Modals";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/stock-in" replace />} />
                    <Route path="stock-in" element={<StockInList />} />
                </Route>
            </Routes>
            <ToastContainer />
            <Modals />
        </Router>
    );
}

export default App;
