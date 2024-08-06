import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { QRCodeCanvas } from "qrcode.react";

const GenerateQR = () => {
    const url = import.meta.env.VITE_WEB_SITE + "/send";
    const navigate = useNavigate();
    const [generated, setGenerated] = useState(false);
    const [id, setId] = useState("");
    const qrRef = useRef();

    const downloadQR = () => {
        const canvas = qrRef.current.querySelector("canvas");
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `QRCode-${id}.png`;
        link.click();
    };

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
                                <div
                                    ref={qrRef}
                                    className="rounded-md border-4 border-blue-400 p-2"
                                >
                                    <QRCodeCanvas
                                        value={url + "/" + id}
                                        size={256}
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
