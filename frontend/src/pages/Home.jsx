import React, { useContext, useEffect, useState, useRef } from "react";
import { UserDataContext } from "../context/UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CgMenuRightAlt, CgClose } from "react-icons/cg";

const Home = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);

  const [userText, setUserText] = useState("");
    const [spokenText, setSpokenText] = useState("");
  const [aiText, setAiText] = useState("");
  const [listening, setListening] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signIn");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        // setListening(false);
        console.log("Recognition Requested Start")
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Recogniton error", error);
        }
      }
    }
  };

  const speak = (text) => {
    synth.cancel(); // stop previous speech
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    const voices = synth.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterence.voice = hindiVoice;

    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(()=>{
        startRecognition();

      },800)
    };
    synth.cancel();
    synth.speak(utterence);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator_open") {
      window.open(`https://google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to Start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    // const safeRecognition = () => {
    //   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    //     try {
    //       recognition.start();
    //     } catch (error) {
    //       if (error.name !== "InvalidStateError") {
    //         console.error("Recognition start error:", error);
    //       }
    //     }
    //   }
    // };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              // safeRecognition();
              recognition.start();
              console.log("Recognition Started");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current && isMounted) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log(error);
              }
            }
          }
        }, 1000);
      }
    };

    // userData.history.map((res)=>{
    //   console.log(res);

    // })

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      // console.log("heard:- ", transcript);
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        // console.log(data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
      // console.log(e)
    };
    // ✅ Reusable Speak Function
    const speak = (text, options = {}) => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); // pehle se bol raha hai to stop
      }
      setSpokenText(text);
     
      const utterance = new SpeechSynthesisUtterance(text);

      // default values
      utterance.lang =  "hi-IN"; // language
      utterance.rate =  1; // speed
      utterance.pitch =  1; // pitch
      utterance.volume =  1; // volume

      // Voice selection (agar available ho to hi-IN choose karega)
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => v.lang === utterance.lang);
      if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onend = () => {
    setSpokenText("");
  };
      // Speak
      window.speechSynthesis.speak(utterance);
    };

    // ✅ Greeting Logic
    const greetUser = (userName) => {
      // random greetings attractive banane ke liye
      const greetings = [
        `Hello ${userName}, Welcome back! How can I assist you today?`,
        `Hey ${userName}, glad to see you again. What can I do for you?`,
        `Namaste ${userName}, main aapki kis tarah madad kar sakta hoon aaj?`,
        `Good day ${userName}! Ready to get started?`,
      ];

      // ek random greeting pick karo
      const message = greetings[Math.floor(Math.random() * greetings.length)];

      // speak it
      speak(message, { lang: "hi-IN", rate: 1, pitch: 1.1 });
    };


    // ✅ Usage Example
    greetUser(userData.name);


    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      synth.cancel();
      setListening(false);
      isRecognizingRef.current = false;
      // clearInterval(fallback);
    };
  }, []);

  return (
    <div
      className="w-full h-[100vh] bg-gradient-to-br from-black via-[#0a0a3f] to-[#02024a] 
      flex justify-center items-center flex-col gap-6 p-6 relative overflow-hidden"
    >
      {/* Top Nav */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-white p-2 rounded-full bg-white/10 
          backdrop-blur-md border border-white/20 shadow-md 
          hover:bg-white/20 transition-all"
        >
          <CgMenuRightAlt className="w-6 h-6 cursor-pointer" />
        </button>

        {/* Desktop Buttons */}
        <div className="hidden lg:block gap-7">
          <button
            className="px-6 py-2 mx-[10px] bg-white/10 backdrop-blur-md border border-white/20 
              text-white font-medium rounded-full shadow-lg 
              hover:bg-white/20 hover:border-cyan-400 hover:scale-105 
              transition-all duration-300 ease-in-out cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 
              text-white font-medium rounded-full shadow-lg 
              hover:bg-white/20 hover:border-cyan-400 hover:scale-105 
              transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate("/customize")}
          >
            Customize Avatar
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] sm:w-[300px] 
          bg-[#0000003c] backdrop-blur-lg border-l border-white/20 
          shadow-[0_0_30px_rgba(0,200,255,0.2)] z-50 p-6 
          transform transition-transform duration-500 ease-in-out 
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-lg font-semibold tracking-wide">
            Menu
          </h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <CgClose className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <button
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 
              text-white rounded-xl shadow-md hover:bg-white hover:text-black hover:font-semibold hover:border-cyan-400 
              transition-all duration-300 text-left cursor-pointer"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>

          <button
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 
              text-white rounded-xl shadow-md hover:bg-white hover:text-black hover:font-semibold hover:border-cyan-400 
              transition-all duration-300 text-left cursor-pointer"
            onClick={() => {
              navigate("/customize");
              setMenuOpen(false);
            }}
          >
            Customize Avatar
          </button>
        </div>

        <hr className="text-white my-[10px]" />
        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[400px] gap-[10px] overflow-y-auto my-[10px]">
          {userData?.history?.length > 0 ? (
            userData.history.map((his, index) => (
              <span
                key={index}
                className=" my-[30px] px-2 py-[5px] rounded text-white font-semibold text-[20px] truncate hover:text-cyan-300 cursor-pointer z-[10]"
              >
                {his} <br />
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No history yet...</p>
          )}
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-3xl bottom-10 right-10 animate-ping"></div>

      {/* Assistant Card */}
      <div
        className="w-[300px] h-[400px] rounded-3xl overflow-hidden 
          shadow-[0_0_30px_rgba(0,200,255,0.5)] border border-white/20 
          bg-white/5 backdrop-blur-md flex justify-center items-center relative group"
      >
        <img
          src={userData?.assistantImage}
          alt="assistant"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-md mt-4">
        I’m <span className="text-cyan-300">{userData?.assistantName}</span>
      </h1>

      {/* Speaking Avatar */}
      <div className="relative mt-6">
        <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400/30 blur-xl"></div>
        <img
          src={aiText ? aiImg : userImg}
          alt="avatar"
          className="w-[100px] h-[100px] object-cover rounded-full border-4 border-cyan-600
            shadow-[0_0_25px_rgba(0,200,255,0.7)] transition-all duration-500 ease-in-out transform hover:scale-110 relative z-10"
        />
      </div>

      <div className="p-4">
        {/* ✅ Show text if speaking */}
        {spokenText && (
          <p className="text-white text-xl px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
            {spokenText}
          </p>
        )}
      </div>

      <h1 className="text-white text-[20px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>

  );
};

export default Home;