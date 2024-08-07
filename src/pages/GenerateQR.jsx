import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

const GenerateQR = () => {
    const url = import.meta.env.VITE_WEB_SITE + "/send";
    const navigate = useNavigate();
    const [generated, setGenerated] = useState(false);
    const [id, setId] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const qrRef = useRef();

    const downloadQR = () => {
        // Create a new canvas with additional padding

        const link = document.createElement("a");
        link.href = imgUrl;
        link.download = `QRCode-${id}.png`;
        link.click();
    };
    useEffect(() => {
        if (generated) {
            const canvas = qrRef.current.querySelector("canvas");
            const padding = 20; // Adjust the padding value as needed
            const paddedCanvas = document.createElement("canvas");
            const ctx = paddedCanvas.getContext("2d");

            // Set the new canvas dimensions
            paddedCanvas.width = canvas.width + padding * 2;
            paddedCanvas.height = canvas.height + padding * 2;

            // Fill the background with white (or any other color)
            ctx.fillStyle = "#ffffff"; // Background color
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

            // Draw the original QR code canvas onto the new padded canvas
            ctx.drawImage(canvas, padding, padding);

            // Convert the padded canvas to a data URL and download
            const url = paddedCanvas.toDataURL("image/png");
            setImgUrl(url);
        }
    });
    return (
        <div className="flex min-h-screen bg-indigo-700 py-5">
            <div className="m-auto flex w-full max-w-xl flex-col items-center justify-center rounded-lg bg-indigo-100 py-8 shadow-lg">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-indigo-700">
                        BayLink
                    </h1>
                </header>
                <div className="mx-auto w-full justify-items-center self-center px-10">
                    {generated ? (
                        <div>
                            <div className="mb-4 flex w-full flex-col items-center justify-center gap-2">
                                <h1 className="mb-4 text-2xl font-semibold text-indigo-700">
                                    QR Code Generated
                                </h1>
                                <div ref={qrRef} className="hidden">
                                    <QRCodeCanvas
                                        value={url + "/" + id}
                                        size={256}
                                        style={{
                                            padding: "20px",
                                            background: "#ffffff",
                                        }}
                                    />
                                </div>
                                <div className="w-64 rounded-lg border-2 border-indigo-700 bg-white">
                                    <img
                                        src={imgUrl}
                                        alt="QR Code"
                                        className="w-full p-2"
                                    />
                                </div>
                            </div>
                            <button
                                className="mt-4 w-full rounded-lg bg-indigo-700 px-4 py-2 text-white"
                                onClick={downloadQR}
                            >
                                Download
                            </button>
                        </div>
                    ) : (
                        <Input setGenerated={setGenerated} setId={setId} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateQR;
