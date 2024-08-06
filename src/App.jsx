import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import GenerateQR from "./pages/GenerateQR";
import Send from "./pages/Send";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<GenerateQR />} />
                    <Route path="/send/:id" element={<Send />} />
                    {/* Redirect all other paths to "/" */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
            </BrowserRouter>
        </>
    );
}

export default App;
