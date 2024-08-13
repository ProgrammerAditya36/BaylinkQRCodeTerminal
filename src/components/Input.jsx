import { CSpinner } from "@coreui/react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseconfig";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const Input = ({ setGenerated, setId }) => {
    const [name, setName] = useState("");
    const [retailerEntity, setRetailerEntity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [pincode, setPincode] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

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
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);

            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
            axios
                .get(url)
                .then((res) => {
                    const addressComponents =
                        res.data.results[0].address_components;
                    const display_name = res.data.results[0].formatted_address;
                    const postcode = addressComponents.find((component) =>
                        component.types.includes("postal_code"),
                    )?.long_name;
                    setPincode(postcode);
                    setLocation(display_name);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching initial location name:",
                        error,
                    );
                });
        });
    }, []);

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setLatitude(lat);
        setLongitude(lng);
    };

    useEffect(() => {
        if (latitude !== null && longitude !== null) {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
            axios
                .get(url)
                .then((res) => {
                    const addressComponents =
                        res.data.results[0].address_components;
                    const display_name = res.data.results[0].formatted_address;
                    const postcode = addressComponents.find((component) =>
                        component.types.includes("postal_code"),
                    )?.long_name;
                    setLocation(display_name);
                    setPincode(postcode);
                })
                .catch((error) => {
                    console.error("Error fetching location name:", error);
                });
        }
    }, [latitude, longitude]);

    const handleSubmit = async () => {
        setLoading(true);
        const id = uuidv4();
        try {
            console.log(
                name,
                retailerEntity,
                latitude,
                longitude,
                pincode,
                location,
            );
            await setDoc(doc(db, "users", id), {
                name,
                retailerEntity,
                latitude,
                longitude,
                pincode,
                location,
            });
            setId(id);
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
                    Name
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
                    htmlFor="retailerEntity"
                >
                    Retailer Entity
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
                    Latitude
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
                    Longitude
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
                    Location
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
                    Pincode
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
                    {showMap ? "Close Map" : "Pick from Map"}
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
                    className="w-full rounded bg-indigo-700 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <CSpinner size="sm" color="white" />
                    ) : (
                        "Generate"
                    )}
                </button>
            </div>
        </>
    );
};

export default Input;
