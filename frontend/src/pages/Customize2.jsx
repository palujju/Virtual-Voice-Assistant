import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserDataContext";
import axios from "axios";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
    const navigate = useNavigate();
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(UserDataContext)
    const [assistantName,setAssistantName] = useState(userData?.assistantName || "")
    const [loading,setLoading] = useState(false)
    const handleUpdateAssistant = async ()=>{
      setLoading(true)
        try {
          let formData = new FormData();
          formData.append("assistantName", assistantName);
          if (backendImage) {
            formData.append("assistantImage", backendImage);
          } else {
            formData.append("imageUrl", selectedImage);
          }

          const result = await axios.post(
            `${serverUrl}/api/user/update`,
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setLoading(false)
          console.log(result.data);
          setUserData(result.data);
          
          navigate('/')
          // console.log(userData)
        } catch (error) {
          setLoading(false)
            console.log(error);
        }
    }
    
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
        <div
          className="absolute top-[30px] left-[30px] bg-white/20 p-2 rounded-full cursor-pointer 
                hover:bg-white/30 transition duration-200"
        >
          <MdArrowBack className="text-white w-[25px] h-[25px]" onClick={()=>{navigate('/Customize')}}/>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#c8e3ea] mb-10">
          Enter Your <span className="text-blue-300">Assistant Name</span>
        </h1>
        <input
          type="text"
          placeholder="Eg. Nova"
          className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => {
            setAssistantName(e.target.value);
          }}
          value={assistantName}
        />
        {assistantName && (
          <button
            className="mt-8 px-8 py-3 bg-gradient-to-r from-[#00ccff] to-[#0066ff] text-white font-semibold text-lg rounded-full shadow-lg 
             hover:shadow-[0_0_20px_4px_rgba(0,153,255,0.8)] hover:scale-105 hover:from-[#00e6ff] hover:to-[#3388ff]
             transition-all duration-300 ease-in-out cursor-pointer"
            disabled={loading}
            onClick={() => {
              handleUpdateAssistant();
            }}
          >
            {!loading ? "Create Assistant" : "Loading..."}
          </button>
        )}
      </div>
    );
};

export default Customize2;
