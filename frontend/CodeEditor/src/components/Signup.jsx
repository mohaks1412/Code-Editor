import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Input from './Input';
import Button from './Button';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import authService from '../auth/authService';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/userSlice';

const Signup = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [apiError, setApiError] = useState(null);

    const signup = async (data) => {
        setApiError(null);

        const payload = {
            name: data.name,
            email: data.email,
            password: data.password
        };

        authService.register(payload)
            .then((res) => {
                dispatch(updateProfile(res));
                localStorage.setItem("user", JSON.stringify(res));
                console.log(res);
                navigate('/user-profile');
            })
            .catch((err) => {
                console.error(err);
                setApiError("Registration failed. This email may already be in use.");
            });
    };

    return (
        <div className="signup-container">
            <h1>Sign up to Code<span className='word2'>Amigo</span>!</h1>

            {apiError && <p className="error-message">{apiError}</p>}

            <form onSubmit={handleSubmit(signup)}>
                <Input
                    label="Full Name :"
                    placeholder="Enter your full name"
                    type="text"
                    {...register("name", {
                        required: "Name is required"
                    })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}

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
                {errors.email && <p className="form-error">{errors.email.message}</p>}

                <Input
                    label="Password :"
                    placeholder="Enter your Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                            message: "Password must have uppercase, lowercase, digit & special char"
                        }
                    })}
                />
                {errors.password && <p className="form-error">{errors.password.message}</p>}

                <Input
                    label="Confirm Password :"
                    placeholder="Confirm your Password"
                    type="password"
                    {...register("ConfirmPassword", {
                        required: "Please confirm your password",
                        validate: value => value === watch("password") || "Passwords do not match"
                    })}
                />
                {errors.ConfirmPassword && <p className="form-error">{errors.ConfirmPassword.message}</p>}

                <Button type="submit">Get Started!</Button>
            </form>
        </div>
    );
};

export default Signup;