import React from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

const Send = () => {
    const { id } = useParams();

    const handleSend = async (type) => {
        try {
            const docRef = doc(db, "users", id);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();

            const message = `Name: ${data.name}\nRetailer Entity: ${data.retailerEntity}\nLocation: ${data.location}\nDealer: ${data.dealer}\nPincode: ${data.pincode}`;
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
                        email: data.email, // Make sure you include the user’s email if needed
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

            toast.success("Request sent successfully");
        } catch (e) {
            console.error(
                "Error sending compliant: ",
                e.response ? e.response.data : e.message,
            );
            toast.error("Error sending compliant");
        }
    };

    return (
        <div className="flex min-h-screen bg-indigo-700 px-10 py-5">
            <div className="m-auto flex w-full max-w-xl flex-col items-center justify-center gap-5 rounded-lg bg-indigo-100 p-8 shadow-lg">
                <header className="mb-2 text-center">
                    <h1 className="text-2xl font-bold text-indigo-700">
                        BayLink
                    </h1>
                </header>
                <button
                    className="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-white"
                    onClick={() => handleSend("compliant")}
                >
                    Log Compliant
                </button>
                <button
                    className="mt-4 w-full rounded-lg bg-indigo-700 px-4 py-2 text-white"
                    onClick={() => handleSend("inventory")}
                >
                    Request Inventory
                </button>
            </div>
        </div>
    );
};

export default Send;
