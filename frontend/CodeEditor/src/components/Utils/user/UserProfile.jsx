import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../store/userSlice";
import Input from "../../Input";
import Button from "../../Button";
import "./UserProfile.css";
import axios from "axios";
import { viewFile } from "../../appwrite/appwriteService";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const [profilePic, setProfilePic] = useState(user.profileImage || null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    username: user.username || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    // ADDED: New fields to match the backend
    skills: user.skills || [],
    github: user.github || "",
  });

  const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          withCredentials: true,
        });
        const profileData = response.data;
        console.log(profileData);
        
        // Populate local component state with fetched data
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          username: profileData.username || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
          skills: profileData.skills || [],
          github: profileData.github || "",
        });

        
        setProfilePic(viewFile(profileData.profileImage) || null);
        


        // Dispatch to update Redux state
        dispatch(updateProfile(profileData));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [dispatch]);

  const handleImageUpload = (e) => {
    if (!isEditing) return;
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  const handleChange = (field) => (e) => {
    if (!isEditing) return;
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const userData = new FormData();

    // Append text fields from the state
    userData.append("name", formData.name);
    userData.append("username", formData.username);
    userData.append("bio", formData.bio);
    userData.append("website", formData.website);
    // ADDED: Append the new fields
    userData.append("skills", formData.skills);
    userData.append("github", formData.github);

    if (profilePicFile) {
      userData.append("profileImage", profilePicFile);
    }
    console.log("Sending : ", userData);
    
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        userData,
        { withCredentials: true }
      );

      // Dispatch action to update Redux store with new data from backend

      console.log("Front reciever after updation : ", res.data);
      
      dispatch(updateProfile(res.data));
      setIsEditing(false);
      navigate("/home");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="user-profile-container">
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h2 style={{ color: "#ff8c00", marginBottom: "1.5rem" }}>Your Profile</h2>

        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        )}
      </div>

      {/* Profile Picture Upload */}
      <label htmlFor="profilePic" className="profile-pic-wrapper">
        {profilePic ? (
          <img src={profilePic} alt="Profile" className="profile-pic" />
        ) : (
          <span className="upload-placeholder">Upload</span>
        )}
      </label>
      {isEditing && (
        <input
          type="file"
          id="profilePic"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
      )}

      {/* Profile Fields */}
      <Input
        label="Full Name"
        value={formData.name}
        onChange={handleChange("name")}
        readOnly={!isEditing}
      />
      <Input label="Email" type="email" value={formData.email} readOnly />
      <Input
        label="Username"
        value={formData.username}
        onChange={handleChange("username")}
        readOnly={!isEditing}
      />
      <Input
        label="Bio"
        multiline
        value={formData.bio}
        onChange={handleChange("bio")}
        readOnly={!isEditing}
      />

      <Input
        label="Website"
        value={formData.website}
        onChange={handleChange("website")}
        readOnly={!isEditing}
      />
      {/* ADDED: New fields */}
      <Input
        label="Skills"
        value={formData.skills}
        onChange={handleChange("skills")}
        readOnly={!isEditing}
      />
      <Input
        label="GitHub"
        value={formData.github}
        onChange={handleChange("github")}
        readOnly={!isEditing}
      />
    </div>
  );
};

export default UserProfile;
