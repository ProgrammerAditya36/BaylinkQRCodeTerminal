import { CSpinner } from "@coreui/react";
import axios from "axios";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { db } from "../firebaseconfig";

const Send = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [popUpmessage, setPopUpMessage] = useState("");
    const [link, setLink] = useState(null);
    ("Your request has been sent successfully. We will get back to you soon.");
    const handleSend = async (type) => {
        setLoading(true);

        try {
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error("User document does not exist");
            }

            const data = docSnap.data();
            const lastRequestTime = data.lastRequestTime
                ? data.lastRequestTime.toMillis()
                : 0;
            const currentTime = Date.now();
            const timeDifference =
                (currentTime - lastRequestTime) / (1000 * 60 * 60 * 12); // 12 hours

            if (timeDifference < 1) {
                setOpen(true);
                setTitle("Request Limit Exceeded");
                setPopUpMessage(
                    "We are already processing your request made within the past 12 hours. Please try again later. For any other assistance feel free to reach out to us via whatsapp.",
                );
                setLink("https://wa.link/bfcxn5");
                setLoading(false);
                return;
            }

            const message = `Name: ${data.name}\nPhone: ${data.phone}\nRetailer Entity: ${data.retailerEntity}\nLocation: ${data.location}\nLatitude: ${data.latitude}\nLongitude: ${data.longitude}\nPincode: ${data.pincode}`;
            const subject =
                type === "compliant"
                    ? `BayLink :- Complaint from ${data.name}`
                    : `BayLink :- Inventory Request from ${data.name}`;

            const emails = [
                import.meta.env.VITE_EMAIL_1_ACCESS,
                import.meta.env.VITE_EMAIL_2_ACCESS,
            ];

            for (const token of emails) {
                const response = await axios.post(
                    "https://api.web3forms.com/submit",
                    {
                        access_key: token,
                        name: data.name,
                        subject,
                        message,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
                console.log("Email sent successfully:", response.data);
            }

            // Update the lastRequestTime in Firestore
            await updateDoc(docRef, {
                lastRequestTime: new Date(),
            });
            setOpen(true);
            setTitle("Request Sent");
            setPopUpMessage(
                "Your request has been sent successfully. You will receive a callback shortly.",
            );
        } catch (e) {
            console.error(
                "Error sending request: ",
                e.response ? e.response.data : e.message,
            );
            toast.error("Error sending request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {open && (
                <Popup
                    open={open}
                    setOpen={setOpen}
                    message={popUpmessage}
                    title={title}
                    link={link}
                />
            )}
            <div className="flex min-h-screen bg-indigo-700 px-10 py-5">
                <div className="m-auto flex w-full max-w-xl flex-col items-center justify-center gap-5 rounded-lg bg-indigo-100 p-8 shadow-lg">
                    <img src={logo} className="w-1/2" alt="" />

                    <button
                        className="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-white"
                        onClick={() => handleSend("compliant")}
                        disabled={loading}
                    >
                        {loading ? (
                            <CSpinner size="sm" color="white" />
                        ) : (
                            "Log Complaint"
                        )}
                    </button>
                    <button
                        className="mt-4 w-full rounded-lg bg-indigo-700 px-4 py-2 text-white"
                        onClick={() => handleSend("inventory")}
                        disabled={loading}
                    >
                        {loading ? (
                            <CSpinner size="sm" color="white" />
                        ) : (
                            "Request Inventory"
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

const Popup = ({ open, setOpen, title, message, link }) => {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
                open ? "" : "hidden"
            }`}
        >
            <div className="md:text-md w-1/3 min-w-[300px] rounded-lg bg-white p-5 text-sm">
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-lg">{message}</p>
                <div className="flex justify-center gap-5">
                    <button
                        className="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-white"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                    {link && (
                        <button
                            className="mt-4 w-full rounded-lg bg-green-700 px-2 py-2 text-white md:px-4"
                            onClick={() => window.open(link)}
                        >
                            Whatsapp Us
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Send;
