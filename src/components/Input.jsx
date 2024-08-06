import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
const Input = ({ setGenerated, setId }) => {
    const [name, setName] = useState("");
    const [retailerEntity, setRetailerEntity] = useState("");
    const [location, setLocation] = useState("");
    const [dealer, setDealer] = useState("");
    const [pincode, setPincode] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "retailerEntity":
                setRetailerEntity(value);
                break;
            case "location":
                setLocation(value);
                break;
            case "dealer":
                setDealer(value);
                break;
            case "pincode":
                setPincode(value);
                break;
            default:
                break;
        }
    };
    const handleSubmit = async () => {
        console.log({ name, retailerEntity, location, dealer, pincode });
        const id = uuidv4();
        try {
            await setDoc(doc(db, "users", id), {
                name,
                retailerEntity,
                location,
                dealer,
                pincode,
            });
            setId(id);
            toast.success("QR generated successfully");
            setGenerated(true);

            console.log("Document written with ID: ", id);
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Error generating QR");
        }
    };
    return (
        <>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="name"
                >
                    Name
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="retailerEntity"
                >
                    Retailer Entity
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="retailerEntity"
                    id="retailerEntity"
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="location"
                >
                    Location
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="location"
                    id="location"
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="dealer"
                >
                    Dealer
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="dealer"
                    id="dealer"
                    onChange={handleChange}
                />
            </div>
            <div className="mb-6">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="pincode"
                >
                    Pincode
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="pincode"
                    id="pincode"
                    onChange={handleChange}
                />
            </div>
            <div>
                <button
                    className="w-full rounded bg-indigo-700 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Generate
                </button>
            </div>
        </>
    );
};

export default Input;
