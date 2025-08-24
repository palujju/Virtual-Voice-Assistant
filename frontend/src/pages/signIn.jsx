import React, { useState, useContext } from "react";
import bg from "../assets/authBg.png";
import { IoEye } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserDataContext.jsx";
import axios from "axios";
import Swal from "sweetalert2"; 

const SignIn = () => {
  const Navigate = useNavigate();
  const { serverUrl, setUserData } = useContext(UserDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSingIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data);

      // ✅ Success popup
      Swal.fire({
        toast: true,
        position: "top-start",
        icon: "success",
        title: "Login Successful 🎉",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
   
      Navigate("/");
    } catch (error) {
      console.log(error);
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);

      // ❌ Error popup
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
      className="w-full h-[100vh] flex justify-center items-center bg-center bg-no-repeat bg-cover relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Background Overlay Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black"
      ></motion.div>

      {/* Sign In Form */}
      <motion.form
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="relative z-10 w-[90%] h-[600px] max-w-[500px] bg-[#0000002a] backdrop-blur-xl shadow-xl shadow-black 
      flex flex-col items-center justify-center gap-[20px] px-[20px] rounded-2xl"
        onSubmit={handleSingIn}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px] tracking-wide">
          Sign In To{" "}
          <span className="text-blue-400 drop-shadow-md">
            Virtual Assistant
          </span>
        </h1>

        {/* Email */}
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#60a5fa" }}
          type="email"
          placeholder=" Enter your Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white 
        placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative transition-all duration-300 focus-within:border-blue-400">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="w-full h-full bg-transparent text-white rounded-full placeholder-gray-300 px-[20px] py-[10px] outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!showPassword ? (
            <IoEye
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer 
            transition-all duration-300 hover:scale-110 hover:text-blue-400"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <FaEyeSlash
              className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer 
            transition-all duration-300 hover:scale-110 hover:text-blue-400"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {/* Error */}
        {err.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-[17px]"
          >
            *{err}
          </motion.p>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="min-w-[150px] h-[60px] bg-white rounded-full mt-[30px] text-black font-semibold 
        text-[19px] hover:bg-blue-400 hover:text-white transition-colors duration-300 shadow-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </motion.button>

        {/* Sign Up */}
        <p className="text-white text-[18px] cursor-pointer">
          Want to Create a new Account ?{" "}
          <span
            className="text-blue-400 hover:underline"
            onClick={() => Navigate("/signUp")}
          >
            Sign Up
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default SignIn;
