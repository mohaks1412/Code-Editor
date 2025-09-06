import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Input from './Input';
import Button from './Button';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import authService from '../auth/authService';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/userSlice';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null); // Add state for error message

    const login = (data) => {
        console.log('Logging in with:', data);
        setError(null); // Clear any previous errors

        authService.login(data)
            .then((res) => {
                const payload = {
                    id: res.id || res._id,
                    username: res.username,
                    name: res.name,
                    email: res.email,
                    bio: res.bio,
                    skills: res.skills,
                    github: res.github,
                    website: res.website,
                };
                dispatch(updateProfile(res));
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                setError("Invalid credentials. Please try again."); // Set the error message
            });
    };

    return (
        <div className="login-container">
            <h1>Login to Code<span className='word2'>Amigo</span>!</h1>

            {error && <p className="error-message">{error}</p>} {/* Display error message here */}

            <form onSubmit={handleSubmit(login)}>

                <Input
                    label="Email :"
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                            message: "Invalid email"
                        }
                    })}
                />

                <Input
                    label="Password :"
                    placeholder="Enter your password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                />

                <Button type="submit">Log in!</Button>

            </form>
        </div>
    );
};

export default Login;