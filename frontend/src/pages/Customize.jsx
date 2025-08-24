import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { MdArrowBack } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import { UserDataContext } from "../context/UserDataContext.jsx";
import { useNavigate } from "react-router-dom";

const Customize = () => {
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

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
      <div
        className="absolute top-[30px] left-[30px] bg-white/20 p-2 rounded-full cursor-pointer 
                      hover:bg-white/30 transition duration-200"
      >
        <MdArrowBack
          className="text-white w-[25px] h-[25px]"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#c8e3ea] mb-10">
        Select your <span className="text-blue-300">Assistant Image</span>
      </h1>
      <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030348] border-2 border-[#080862] rounded-2xl overflow-hidden cursor-pointer 
  hover:shadow-[0_0_25px_5px_rgba(0,153,255,0.8)] hover:border-[#00ccff] 
  hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center  ${
    selectedImage == "input"
      ? "border-4 border-white shadow-[0_0_25px_5px_rgba(0,153,255,0.8)]"
      : null
  }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <LuImagePlus className="text-[#00ccff] text-5xl opacity-70 hover:opacity-100 transition-opacity duration-300" />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          className="mt-8 px-8 py-3 bg-gradient-to-r from-[#00ccff] to-[#0066ff] text-white font-semibold text-lg rounded-full shadow-lg 
             hover:shadow-[0_0_20px_4px_rgba(0,153,255,0.8)] hover:scale-105 hover:from-[#00e6ff] hover:to-[#3388ff]
             transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => {
            navigate("/Customize2");
          }}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
