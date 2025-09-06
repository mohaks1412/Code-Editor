import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './JoinProject.css'

const JoinProject = () => {
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      alert("Please enter a valid code!");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/projects/add-member/${inviteCode}`,
        {},
        { withCredentials: true }
      );

      console.log("Joined Project:", res.data);
      navigate(`/projects/${inviteCode}`);
    } catch (err) {
      console.error("Error adding member:", err.response?.data || err.message);
    }
  };

  return (
    <div className="joinproject-container">
      <h1 className="joinproject-title">Have an Invite Code?</h1>

      <div className="joinproject-input">
        <Input
          label="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
      </div>

      <div className="joinproject-button">
        <Button onClick={handleJoin}>Join Project!</Button>
      </div>
    </div>
  );
};

export default JoinProject;
