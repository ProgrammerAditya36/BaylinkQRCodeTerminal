import React, { useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import qrLogo from "../assets/qr_logo.png";
import Input from "../components/Input";

const GenerateQR = () => {
    const url = import.meta.env.VITE_WEB_SITE + "/send";
    const navigate = useNavigate();
    const [generated, setGenerated] = useState(false);
    const [id, setId] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const qrRef = useRef();

    const downloadQR = () => {
        qrRef.current?.download();
    };

    return (
        <div className="flex min-h-screen bg-indigo-700 py-5">
            <div className="m-auto flex w-full max-w-xl flex-col items-center justify-center rounded-lg bg-indigo-100 py-8 shadow-lg">
                <img src={logo} className="w-1/3" alt="" />
                <div className="mx-auto w-full justify-items-center self-center px-10">
                    {generated ? (
                        <div>
                            <div className="mb-4 flex w-full flex-col items-center justify-center gap-2">
                                <h1 className="mb-4 text-2xl font-semibold text-indigo-700">
                                    QR Code Generated
                                </h1>
                                <div
                                    style={{ width: "256px", height: "256px" }}
                                >
                                    <QRCode
                                        value={`${url}/${id}`}
                                        size={256}
                                        scale={1080 / 256} // Set the scale to achieve 1080px resolution
                                        ref={qrRef}
                                        logoImage={qrLogo}
                                        logoWidth={80}
                                        fgColor="#28b1e2"
                                        bgColor="#fff"
                                        logoOpacity={1}
                                        removeQrCodeBehindLogo={true}
                                        logoPaddingStyle="circle"
                                        qrStyle="dots"
                                        eyeColor="#28b1e2"
                                        eyeRadius={10}
                                        style={{
                                            borderRadius: "10px",
                                            boxShadow:
                                                "0 0 10px rgba(0, 0, 0, 0.1)",
                                            border: "5px solid #28b1e2",
                                        }}
                                        ecLevel="Q"
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
