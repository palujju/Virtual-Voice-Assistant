import React, { useContext } from "react";
import { UserDataContext } from "../context/UserDataContext";

const Card = ({ image }) => {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);
  return (
    <div
      className={` w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030348] border-2 border-[#080862] rounded-2xl overflow-hidden cursor-pointer 
    hover:shadow-[0_0_25px_5px_rgba(0,153,255,0.8)] hover:border-[#00ccff] 
    hover:scale-105 transition-all duration-300 ease-in-out ${
      selectedImage == image
        ? "border-4 border-white shadow-[0_0_25px_5px_rgba(0,153,255,0.8)]"
        : null
    }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className="h-full object-cover" />
    </div>
  );
};

export default Card;
