import React, { useState, useEffect } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseconfig";
import toast from "react-hot-toast";
import { CSpinner } from "@coreui/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const Input = ({ setGenerated, setId, setUserName, setUserNumber }) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [retailerEntity, setRetailerEntity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [pincode, setPincode] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("en");
    const [translatedText, setTranslatedText] = useState({});
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const GOOGLE_TRANSLATE_API_KEY = import.meta.env
        .VITE_GOOGLE_TRANSLATE_API_KEY;
    const textContent = {
        name: "Name",
        phoneNumber: "Phone Number",
        retailerEntity: "Retailer Entity",
        latitude: "Latitude",
        longitude: "Longitude",
        location: "Location",
        pincode: "Pincode",
        pickFromMap: "Pick from Map",
        closeMap: "Close Map",
        generate: "Generate",
        switchToHindi: "Switch to Hindi",
        switchToEnglish: "Switch to English",
    };

    const translateText = async (text, targetLang) => {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
        try {
            const response = await axios.post(url, {
                q: text,
                target: targetLang,
            });
            return response.data.data.translations[0].translatedText;
        } catch (error) {
            console.error("Translation error:", error);
            return text; // Return original text if translation fails
        }
    };
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setLatitude(lat);
        setLongitude(lng);
    };
    const handleTranslation = async () => {
        const targetLang = language === "en" ? "hi" : "en";
        const translated = {};

        for (const key in textContent) {
            translated[key] = await translateText(textContent[key], targetLang);
        }

        setTranslatedText(translated);
    };

    const toggleLanguage = () => {
        setLanguage((prevLang) => (prevLang === "en" ? "hi" : "en"));
        handleTranslation();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "number":
                setNumber(value);
                break;
            case "retailerEntity":
                setRetailerEntity(value);
                break;
            case "location":
                setLocation(value);
                break;
            case "latitude":
                setLatitude(value);
                break;
            case "longitude":
                setLongitude(value);
                break;
            case "pincode":
                setPincode(value);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLatitude(lat);
                setLongitude(lng);

                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
                try {
                    const res = await axios.get(url);
                    const addressComponents =
                        res.data.results[0].address_components;
                    const display_name = res.data.results[0].formatted_address;
                    const postcode = addressComponents.find((component) =>
                        component.types.includes("postal_code"),
                    )?.long_name;
                    setPincode(postcode);
                    setLocation(display_name);

                    // Check if location is Delhi and set language to Hindi
                    if (display_name.includes("Delhi")) {
                        setLanguage("hi");
                    }
                } catch (error) {
                    console.error(
                        "Error fetching initial location name:",
                        error,
                    );
                }
            });
        };

        fetchLocation();
    }, []);

    useEffect(() => {
        const updateLocation = async () => {
            if (latitude !== null && longitude !== null) {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
                try {
                    const res = await axios.get(url);
                    const addressComponents =
                        res.data.results[0].address_components;
                    const display_name = res.data.results[0].formatted_address;
                    const postcode = addressComponents.find((component) =>
                        component.types.includes("postal_code"),
                    )?.long_name;
                    setLocation(display_name);
                    setPincode(postcode);

                    // Check if location is Delhi and set language to Hindi
                    if (display_name.includes("Delhi")) {
                        setLanguage("hi");
                    } else {
                        setLanguage("en"); // Reset to English if not Delhi
                    }
                } catch (error) {
                    console.error("Error fetching location name:", error);
                }
            }
        };

        updateLocation();
    }, [latitude, longitude]);

    const handleSubmit = async () => {
        setLoading(true);
        const id = uuidv4();
        try {
            console.log(
                name,
                number,
                retailerEntity,
                latitude,
                longitude,
                pincode,
                location,
            );
            await setDoc(doc(db, "users", id), {
                name,
                phone: number,
                retailerEntity,
                latitude,
                longitude,
                pincode,
                location,
            });
            setId(id);
            setUserName(name);
            setUserNumber(number);
            toast.success("QR generated successfully");
            setGenerated(true);

            console.log("Document written with ID: ", id);
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Error generating QR");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="name"
                >
                    {translatedText.name || textContent.name}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="number"
                >
                    {translatedText.phoneNumber || textContent.phoneNumber}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="number"
                    id="number"
                    value={number}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="retailerEntity"
                >
                    {translatedText.retailerEntity ||
                        textContent.retailerEntity}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="retailerEntity"
                    id="retailerEntity"
                    value={retailerEntity}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="latitude"
                >
                    {translatedText.latitude || textContent.latitude}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="latitude"
                    id="latitude"
                    value={latitude || ""}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="longitude"
                >
                    {translatedText.longitude || textContent.longitude}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="longitude"
                    id="longitude"
                    value={longitude || ""}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-4">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="location"
                >
                    {translatedText.location || textContent.location}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="location"
                    id="location"
                    value={location}
                    onChange={handleChange}
                />
            </div>
            <div className="mb-6">
                <label
                    className="mb-2 block font-semibold text-indigo-500"
                    htmlFor="pincode"
                >
                    {translatedText.pincode || textContent.pincode}
                </label>
                <input
                    className="w-full rounded border-b-2 border-indigo-500 p-2 text-indigo-700 outline-none focus:bg-gray-200"
                    type="text"
                    name="pincode"
                    id="pincode"
                    value={pincode}
                    onChange={handleChange}
                />
            </div>
            <div>
                <button
                    className="mb-4 w-full rounded bg-indigo-700 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
                    onClick={() => setShowMap(!showMap)}
                    disabled={loading}
                >
                    {showMap ? (
                        <>{translatedText.closeMap || textContent.closeMap}</>
                    ) : (
                        <>
                            {translatedText.pickFromMap ||
                                textContent.pickFromMap}
                        </>
                    )}
                </button>
            </div>
            {showMap && (
                <div className="mb-4">
                    <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{
                                height: "400px",
                                width: "100%",
                            }}
                            center={{
                                lat: latitude || 51.505,
                                lng: longitude || -0.09,
                            }}
                            zoom={13}
                            onClick={handleMapClick}
                        >
                            {latitude && longitude && (
                                <Marker
                                    position={{ lat: latitude, lng: longitude }}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>
            )}
            <div>
                <button
                    className="mb-4 w-full rounded bg-indigo-700 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
                    onClick={toggleLanguage}
                    disabled={loading}
                >
                    {language === "en"
                        ? translatedText.switchToHindi ||
                          textContent.switchToHindi
                        : translatedText.switchToEnglish ||
                          textContent.switchToEnglish}
                </button>
            </div>
            <div>
                <button
                    className="w-full rounded bg-indigo-700 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <CSpinner size="sm" color="white" />
                    ) : (
                        <>{translatedText.generate || textContent.generate}</>
                    )}
                </button>
            </div>
        </>
    );
};

export default Input;
