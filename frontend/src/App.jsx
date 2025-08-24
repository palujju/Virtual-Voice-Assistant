
import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/signUp'
import SignIn from './pages/signIn'
import Customize from './pages/Customize'
import { UserDataContext } from './context/UserDataContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

const App = () => {

  const {userData,Loading} = useContext(UserDataContext)
  if(Loading){
    return <div className="text-white text-center mt-10">Loading...</div>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/Customize"} />
          )
        }
      />
      <Route
        path="/signUp"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signIn"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route path="/Customize" element={userData?<Customize />:<Navigate to={'/signUp'}/>} />
      <Route path="/Customize2" element={userData?<Customize2 />:<Navigate to={'/signUp'}/>} />

    </Routes>
  );
}

export default App