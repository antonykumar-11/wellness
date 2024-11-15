import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetSingleUserQuery,
  usePatchUserMutation,
  useDeleteUserMutation,
} from "../store/api/userapi";

const Profile = () => {
  const { id } = useParams(); // Get user ID from URL params
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    companyName: "",
    address: "",
    gstNumber: "",
  });
  console.log("userData", userData);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [patchUser, { isLoading: isUpdating }] = usePatchUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Fetch single user data by ID
  const { data: user, isLoading } = useGetSingleUserQuery(id);
  console.log("user", user);
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.user.name,
        email: user.user.email,
        password: "",
        avatar: user.user.avatar,
        companyName: user.user.companyName || "",
        address: user.user.address || "",
        gstNumber: user.user.gstNumber || "",
        mobileNumber: user.user.mobileNumber || "",
      });
      setAvatarPreview(user.user.avatar); // Assuming user.avatar is the URL
    }
  }, [user]);

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

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("avatar", avatar);
    formData.append("companyName", userData.companyName);
    formData.append("address", userData.address);
    formData.append("gstNumber", userData.gstNumber);
    formData.append("mobileNumber", userData.mobileNumber);

    try {
      if (id) {
        await patchUser({ id, data: formData }).unwrap();
      }
      setUserData({
        name: "",
        email: "",
        password: "",
        avatar: "",
        companyName: "",
        address: "",
      });
      setAvatar(null);
      setAvatarPreview(null);
      setError("");
      navigate("/admin");
    } catch (error) {
      setError("Operation failed. Please try again later.");
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        navigate("/login"); // Redirect after deletion
      } catch (error) {
        setError("Failed to delete user. Please try again later.");
      }
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center  justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    >
      <div className="w-full max-w-4xl bg-white -mt-24 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 text-white text-center">
          {id ? "Edit Profile" : "User Registration"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
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

          <div className="flex flex-col">
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

          <div className="flex flex-col">
            <label htmlFor="companyName" className="block text-white">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={userData.companyName}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="gstNumber" className="block text-white">
              GST Number
            </label>
            <input
              id="gstNumber"
              name="gstNumber"
              value={userData.gstNumber}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="mobileNumber" className="block text-white">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              value={userData.mobileNumber}
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
        </div>

        <div className="flex flex-col">
          <label htmlFor="address" className="block text-white">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={userData.address}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            type="submit"
            disabled={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? "Submitting..." : "Submit"}
          </button>
          {id && (
            <button
              onClick={deleteHandler}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Profile;
