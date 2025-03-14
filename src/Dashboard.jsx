import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Base_Url="https://media-uploader-backend-i34s.onrender.com"
const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false); // Loader state
    const fileInputRef = useRef(null);

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        if (data) {
            const userData = JSON.parse(data);
            setUserInfo(userData);
            fetchImages(userData.email);
        }
    }, []);

    const fetchImages = async (email) => {
        setLoading(true); // Show loader before fetching
        try {
            const response = await axios.get(`${Base_Url}/api/files?email=${email}`);
            setImages(response.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false); // Hide loader after fetching
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !userInfo?.email) return;

        const formData = new FormData();
        formData.append('email', userInfo.email);
        formData.append('file', file);

        try {
            await axios.post(`${Base_Url}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchImages(userInfo.email); // Refresh images after upload
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user-info');
        navigate('/login');
    };

    return (
        <div className="flex flex-col bg-purple-100 min-h-screen">
            <div className="h-[10vh] bg-purple-700 flex items-center justify-between px-4">
                <h1 className="text-3xl text-white font-bold">Dashboard</h1>
                <h1>Welcome {userInfo?.name}</h1>
                <button 
                    onClick={handleLogout} 
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition"
                >
                    Logout
                </button>
            </div>

            <div className="flex flex-col items-center justify-center pt-6">
                {/* Hidden file input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleUpload} 
                />
                
                {/* Upload Button */}
                <button 
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition"
                    onClick={() => fileInputRef.current.click()} 
                >
                    Add media files
                </button>

                {/* Image Grid with Loader */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 w-full max-w-6xl">
                    {loading ? (
                        // Loader (Spinner)
                        <div className="col-span-full flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : images.length > 0 ? (
                        images.map((img, index) => (
                            <div 
                                key={index} 
                                className="border-2 border-gray-300 rounded-lg p-2 flex items-center justify-center"
                            >
                                <img
                                    src={img}
                                    alt={`Uploaded media ${index}`}
                                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">
                            No images found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
