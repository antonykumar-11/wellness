import React, { useState } from "react";
import { useRegisterMutation } from "../store/api/userapi";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    avatar: "",
  });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.bio ||
      !avatar
    ) {
      setError("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("bio", userData.bio);
    formData.append("avatar", avatar);

    try {
      await register(formData).unwrap();
      setUserData({
        name: "",
        email: "",
        password: "",
        bio: "",
        avatar: "",
      });
      setAvatar(null);
      setAvatarPreview(null);
      setError("");
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    >
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 text-white text-center">
          User Profile Edit
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex items-center mb-6">
          <img
            src={avatarPreview || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-20 h-20 rounded-full shadow-md"
          />
          <label
            htmlFor="avatar"
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300"
          >
            Add Image
          </label>
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={onChange}
            className="hidden"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-white">
            Bio
          </label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="mt-4 text-center text-white">
            Already have an account?{" "}
            <Link
              className="text-indigo-300 hover:text-indigo-500 focus:outline-none"
              to="/login"
            >
              Login
            </Link>
          </p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Register;
