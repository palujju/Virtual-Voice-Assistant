import React, { useState, useContext } from "react";
import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserDataContext.jsx";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; 

const SignUp = () => {
  const Navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(UserDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSingUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data);
            Swal.fire({
              toast: true,
              position: "top-start",
              icon: "success",
              title: "SignUp Successful 🎉",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
      Navigate("/Customize");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "Something went wrong");
         Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: error.response?.data?.message || "Login Failed ❌",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center bg-no-repeat flex justify-center items-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black"
      ></motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="relative z-10 w-[90%] max-w-[500px] bg-[#0000002a] backdrop-blur-xl shadow-xl shadow-black 
        flex flex-col items-center justify-center gap-[20px] px-[20px] py-[30px] rounded-2xl"
        onSubmit={handleSingUp}
      >
        <h1 className="text-white text-[28px] sm:text-[32px] font-semibold mb-[10px] tracking-wide text-center">
          Register To{" "}
          <span className="text-blue-400 drop-shadow-md">
            Virtual Assistant
          </span>
        </h1>

        {/* Name */}
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#60a5fa" }}
          type="text"
          placeholder=" Enter your Name"
          className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white 
          placeholder-gray-300 px-[20px] rounded-full text-[16px] sm:text-[18px] transition-all duration-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#60a5fa" }}
          type="email"
          placeholder=" Enter your Email"
          className="w-full h-[55px] outline-none border-2 border-white bg-transparent text-white 
          placeholder-gray-300 px-[20px] rounded-full text-[16px] sm:text-[18px] transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="w-full h-[55px] border-2 border-white bg-transparent text-white rounded-full relative transition-all duration-300 focus-within:border-blue-400">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="w-full h-full bg-transparent text-white rounded-full placeholder-gray-300 px-[20px] outline-none text-[16px] sm:text-[18px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!showPassword ? (
            <IoEye
              className="absolute top-[15px] right-[20px] w-[24px] h-[24px] text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:text-blue-400"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <FaEyeSlash
              className="absolute top-[15px] right-[20px] w-[24px] h-[24px] text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:text-blue-400"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {/* Error */}
        {err.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-[15px] sm:text-[17px] text-center"
          >
            *{err}
          </motion.p>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-w-[140px] sm:min-w-[160px] h-[55px] sm:h-[60px] bg-white rounded-full mt-[15px] 
          text-black font-semibold text-[17px] sm:text-[19px] hover:bg-blue-400 hover:text-white transition-colors duration-300 shadow-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </motion.button>

        {/* Sign In redirect */}
        <p className="text-white text-[16px] sm:text-[18px] mt-[10px] text-center">
          Already Have An Account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => Navigate("/signIn")}
          >
            Sign In
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default SignUp;
