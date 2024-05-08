import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const setData = (e) => {
    let { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { email, password } = input;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const db = getFirestore();
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
      console.log("Document created");
      navigate("/login");
      toast.success("Registration successful. Please login to continue.");
    } catch (error) {
      console.error("Firebase authentication error:", error.message);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto justify-center">
      <h1 className="my-4 text-2xl text-center text-black font-bold">
        Register Your Account
      </h1>
      <div className="max-w-md  mx-auto p-6 bg-white rounded-md shadow-md">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            name="email"
            value={input.email}
            onChange={setData}
            placeholder="Enter Your Email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={setData}
            placeholder="Enter Your Password"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Register
          </button>
        </form>
        <div className="my-2">
          <p className="text-sm text-gray-400">
            Your Already have Account?
            <Link
              to={"/Login"}
              className="ml-2 text-red-500 hover:text-red-600 text-sm hover:underline "
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
