import { BrowserRouter, Route, Routes } from "react-router-dom";
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
                </Routes>
                <Toaster />
            </BrowserRouter>
        </>
    );
}

export default App;
