import React, {useEffect, useState} from "react"
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import AboutMe from './components/AboutMe'
import {Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import NewProject from './components/NewProject'
import DsaWorkspace from './components/DSA/DsaWorkSpace'
import DevWorkspace from './components/Dev/DevWorkspace'
import AssignmentWorkspace from './components/Assignments/AssignmentWorkspace'
import Signup from './components/Signup'
import UserProfile from "./components/Utils/user/UserProfile"
import LogoutButton from "./components/LogoutButton"
import PrivateRoute from "./components/PtivateRoute"
import MyProjects from "./components/MyProjects"
import ProjectLoader from "./components/ProjectLoader"
import axios from "axios"
import { updateProfile } from "./store/userSlice"
import { useDispatch } from "react-redux"
import JoinProject from "./components/JoinProject"
function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          withCredentials: true,
        });
        dispatch(updateProfile(res.data)); // hydrate redux with user info
        
      } catch {
        dispatch(updateProfile(null)); // clear user info if unauthenticated
      }
      finally{
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);


  return loading?(<h1>Loading...</h1>) : (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PrivateRoute><ProjectLoader /></PrivateRoute>}>
          <Route path="/dsa/:projectId" element={<DsaWorkspace />} />
          <Route path="/dev/:projectId" element={<DevWorkspace />} />
          <Route path="/assignment/:projectId" element={<AssignmentWorkspace />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new-project" element={<PrivateRoute><NewProject /></PrivateRoute>} />
        <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/logout" element={<LogoutButton/>} />
        <Route path="/my-projects" element={<MyProjects/>} />
        <Route path="/join-project" element={<JoinProject/>} />
        
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </div>
  )
}

export default App
