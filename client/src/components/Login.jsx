import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );
      const user = userCredentials.user;
      console.log(userCredentials);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials. Please check your email and password.");
    }
  };

  const handlePasswordReset = async () => {
    const email = prompt("Please enter your email");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully.");
        toast.success(
          "An email with password reset instructions has been sent to your inbox."
        );
      } catch (error) {
        console.error("Password reset error:", error.code, error.message);
        handleAuthError(error.code);
      }
    }
  };

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        toast.error("Invalid email address. Please enter a valid email.");
        break;
      case "auth/user-not-found":
        toast.error("Email not found. Please check your email address.");
        break;
      case "auth/network-request-failed":
        toast.error(
          "Network request failed. Please check your internet connection."
        );
        break;
      default:
        toast.error("An error occurred. Please try again later.");
        break;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google sign-in successful:", user);
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error.code, error.message);
      toast.error("Google sign-in error. Please try again later.");
    }
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("GitHub sign-in successful:", user);
      navigate("/");
    } catch (error) {
      console.error("GitHub sign-in error:", error.code, error.message);
      toast.error("GitHub sign-in error. Please try again later.");
    }
  };

  const handlePhoneLogin = () => {
    return navigate("/phone-login");
  };

  return (
    <div className="mx-auto">
      <h1 className="my-4 text-2xl text-center text-black font-bold">
        Login Your Account
      </h1>
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <form onSubmit={submithandler}>
          <input
            type="text"
            name="email"
            value={input.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Login
          </button>
          <div className="flex flex-col md:flex-row my-2 justify-between">
            <p
              className="text-sm text-blue-500 cursor-pointer"
              onClick={handlePasswordReset}
            >
              Forget password
            </p>
            <p className="text-sm  text-gray-400">
              can you register?
              <Link
                to={"/Register"}
                className="ml-2 text-red-500 hover:text-red-600 text-sm hover:underline "
              >
                Register Account
              </Link>
            </p>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={loginWithGoogle}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
          >
            Login With Google
          </button>
          <button
            onClick={loginWithGithub}
            className="w-full py-2 px-4 mt-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
          >
            Login With GitHub
          </button>
        </div>
        <button
          onClick={handlePhoneLogin}
          className="w-full py-2 px-4 mt-2 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:bg-green-900"
        >
          Login With Phone
        </button>
      </div>
    </div>
  );
}

export default Login;
