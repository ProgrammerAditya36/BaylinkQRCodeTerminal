import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
import markerIcon from "../assets/marker_icon.png";
import { db } from "../firebaseconfig";
const Input = ({ setGenerated, setId }) => {
    const [name, setName] = useState("");
    const [retailerEntity, setRetailerEntity] = useState("");
    const [latitude, setLatitude] = useState(null); // Use null instead of "" for initial state
    const [longitude, setLongitude] = useState(null); // Use null instead of "" for initial state
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

            // Fetch the location name and pincode for the initial coordinates
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            axios
                .get(url)
                .then((res) => {
                    const { address, display_name } = res?.data;
                    setPincode(address?.postcode);
                    setLocation(display_name); // Set the initial location name
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
        const { lat, lng } = event.latlng;
        setLatitude(lat);
        setLongitude(lng);

        // Fetch the location name for the selected coordinates
    };
    useEffect(() => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        axios
            .get(url)
            .then((res) => {
                const { address, display_name } = res.data;
                setLocation(display_name);
                setPincode(address?.postcode); // Set the location name based on map click
            })
            .catch((error) => {
                console.error("Error fetching location name:", error);
            });
    }, [latitude, longitude]);

    const handleSubmit = async () => {
        setLoading(true);
        const id = uuidv4();
        try {
            await setDoc(doc(db, "users", id), {
                name,
                retailerEntity,
                latitude,
                longitude,
                pincode,
                location, // Store the location name in the database
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
    const getIcon = () => {
        return L.icon({
            iconUrl: markerIcon,
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });
    };
    const LocationPicker = () => {
        useMapEvents({
            click: handleMapClick,
        });

        if (latitude === null || longitude === null) {
            return null;
        }

        return (
            <Marker position={[latitude, longitude]} icon={getIcon()}></Marker>
        );
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
                    <MapContainer
                        center={[latitude || 51.505, longitude || -0.09]}
                        zoom={13}
                        className="mt-4 h-64 w-full"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker />
                    </MapContainer>
                </div>
            )}
            <div>
                <button
                    className="w-full rounded bg-indigo-700 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    Generate
                </button>
            </div>
        </>
    );
};

export default Input;
