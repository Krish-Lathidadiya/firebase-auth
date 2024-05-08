import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PhoneLogin() {
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const navigate = useNavigate();

  console.log(phone);

  const sendOtp = (e) => {
    e.preventDefault();
    // const appVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
    //   'size': 'invisible',
    //   'callback': () => {
    //     console.log('Recaptcha verification successful');
    //   },
    //   'expired-callback': () => {
    //     console.log('Recaptcha verification expired');
    //   }
    // });
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

    signInWithPhoneNumber(auth, formattedPhone, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setIsOtp(true);
        toast.success("OTP sent successfully");
      })
      .catch((error) => {
        console.error("Error sending OTP:", error.message);
        toast.error("Error sending OTP. Please try again.");
      });
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential)
      .then((userCredential) => {
        console.log("OTP verified, user signed in:", userCredential.user);
        toast.success("OTP verified. You are now signed in.");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error.message);
        toast.error("Error verifying OTP. Please try again.");
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      {isOtp ? (
        <>
          <form action="" onSubmit={verifyOtp}>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Verify OTP
            </button>
          </form>
        </>
      ) : (
        <>
          <div id="recaptcha-container" className="mb-4"></div>
          <form action="" onSubmit={sendOtp}>
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(value) => setPhone(value)}
              inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Send OTP
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default PhoneLogin;
