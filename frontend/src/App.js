import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Conversation from "./pages/Conversation";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chat" element={<Conversation />} />
            </Routes>
        </BrowserRouter>
    );
}
