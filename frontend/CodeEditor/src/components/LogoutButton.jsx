import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetProfile } from "../store/userSlice";
import authService from "../auth/authService";
import { useNavigate } from "react-router-dom";
import { clearAudioKey } from "../store/audioSlice";
import { clearProjects } from "../store/codeSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
        dispatch(clearAudioKey());
    dispatch(clearProjects());
    dispatch(resetProfile());
    authService.logout(); // remove token
 // reset redux state
    navigate("/"); // go home
  }, [dispatch, navigate]);

  return null; // nothing to render
};

export default LogoutButton;
