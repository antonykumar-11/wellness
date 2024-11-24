import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetSingleUserQuery,
  usePatchUserMutation,
  useDeleteUserMutation,
} from "../store/api/userapi";
import AuthContext from "../auth/AuthContext";
const Profile = () => {
  const { id } = useParams(); // Get user ID from URL params
  const { login: setAuthTrue } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",

    companyName: "",
    mobileNumber: "",
    invoiceType: "",
    description:
      "i/we hereby declare that since our aggregate turnover in any preceding financial year from 2024-25 onwords is not more than the aggregate turnover notified under sub-rule(4) of rule 48 , we are required to prepare an invoice in terms of the provisions of the said sub-rule",
    address2: "",
    address3: "",
    address4: "",
    address1: "",
    gstNumber: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    pancardnumber: "",
  });

  const [avatar, setAvatar] = useState("");
  console.log("userData", avatar);
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
      console.log("Fetched user:", user);
      setUserData({
        name: user.user.name,
        email: user.user.email,
        password: "", // Ensure password is blank initially to prevent overwriting
        avatar: user.user.avatar,
        companyName: user.user.companyName || "",
        address1: user.user.address1 || "",
        address2: user.user.address2 || "",
        address3: user.user.address3 || "",
        address4: user.user.address4 || "",
        gstNumber: user.user.gstNumber || "",
        mobileNumber: user.user.mobileNumber || "",
        invoiceType: user.user.invoiceType || "",
        bankName: user.user.bankName || "",
        accountNumber: user.user.accountNumber || "",
        description: user.user.description || userData.description,
        ifsc: user.user.ifsc || "",
        branch: user.user.branch || "",
        pancardnumber: user.user.pancardnumber || "",
      });
      setAvatarPreview(user.user.avatar); // Make sure avatar is set
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

    // Prepare the form data
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("avatar", avatar);
    formData.append("companyName", userData.companyName);
    formData.append("mobileNumber", userData.mobileNumber);
    formData.append("gstNumber", userData.gstNumber);
    formData.append("address1", userData.address1);
    formData.append("address2", userData.address2);
    formData.append("address3", userData.address3);
    formData.append("address4", userData.address4);
    formData.append("invoiceType", userData.invoiceType);
    formData.append("bankName", userData.bankName);
    formData.append("accountNumber", userData.accountNumber);
    formData.append("description", userData.description);
    formData.append("ifsc", userData.ifsc);
    formData.append("branch", userData.branch);
    formData.append("pancardnumber", userData.pancardnumber);

    try {
      if (id) {
        const response = await patchUser({ id, data: formData }).unwrap();
        console.log("Response:", response);

        // Update auth context and localStorage after successful update
        setAuthTrue({ ...response.user, token: response.token }); // Store user info and token
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Reset form and state after submission
        setUserData({
          name: "",
          email: "",
          password: "",
          avatar: "",
          companyName: "",
          address1: "",
          address2: "",
          address3: "",
          address4: "",
          gstNumber: "",
          mobileNumber: "",
          invoiceType: "",
          bankName: "",
          accountNumber: "",
          ifsc: "",
          branch: "",
          pancardnumber: "",
        });
        setAvatar(null);
        setAvatarPreview(null);
        setError("");
        navigate("/admin"); // Navigate to admin page after update
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4"
    >
      <div className="w-full max-w-6xl bg-white -mt-24 bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg">
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
        {/* fffff */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            <label htmlFor="gstNumber" className="block text-white">
              Pan Number
            </label>
            <input
              id="pancardnumber"
              name="pancardnumber"
              value={userData.pancardnumber}
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
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Address 1
            </label>
            <input
              id="address1"
              name="address1"
              value={userData.address1}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Address 2
            </label>
            <input
              id="address2"
              name="address2"
              value={userData.address2}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Address 3
            </label>
            <input
              id="address3"
              name="address3"
              value={userData.address3}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Address 4
            </label>
            <input
              id="address4"
              name="address4"
              value={userData.address4}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Invoice Type (Tax Invoice)
            </label>
            <input
              id="invoiceType"
              name="invoiceType"
              value={userData.invoiceType}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Bank Name
            </label>
            <input
              id="bankName"
              name="bankName"
              value={userData.bankName}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Account Number
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              value={userData.accountNumber}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              ifsc code
            </label>
            <input
              id="ifsc"
              name="ifsc"
              value={userData.ifsc}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-white">
              Branch
            </label>
            <input
              id="branch"
              name="branch"
              value={userData.branch}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="block text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={userData.description}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 w-full sm:w-auto"
            type="submit"
            disabled={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? "Submitting..." : "Submit"}
          </button>
          {id && (
            <button
              onClick={deleteHandler}
              className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 w-full sm:w-auto"
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
