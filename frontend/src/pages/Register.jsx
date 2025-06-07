import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from "../services/api";
import { getDeviceInfo } from "../../utils/UserDeviceInfo";

export default function Register() {
  const RECAPTCHA_ID = import.meta.env.VITE_RECAPTCHA_ID;

  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    // Get user device info on component mount
    useEffect(() => {
      setDeviceInfo(getDeviceInfo());
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error("Please verify the CAPTCHA!");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        fullname: fullName,
        email,
        password: password,
        phone,
        captcha_token: captchaToken,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        screen_width: deviceInfo.screenWidth,
        screen_height: deviceInfo.screenHeight,
        userAgent: deviceInfo.userAgent,
        platform: deviceInfo.platform,
      };
      console.log(userData)
      
      const data = await registerUser(userData);
      console.log(data)
      
      toast.success("Registration successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(error.detail || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center bg-[#fff] p-4">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Section */}
      <div className="w-full md:w-1/2 p-8 text-center md:text-left">
        <h1 className="text-3xl md:text-[60px] lg:text-[100px] font-bold text-[#2E86AB]">ZapSync</h1>
        <h2 className="mt-6 text-2xl font-semibold">Register Your Account</h2>
        <p className="text-gray-600">Create an account to join the ZapSync community</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{10}"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {/* CAPTCHA Verification */}
          <ReCAPTCHA
            sitekey={RECAPTCHA_ID}
            onChange={(token) => setCaptchaToken(token)}
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/"><span className="text-blue-500 hover:underline">Sign in</span></Link>
        </p>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden md:flex w-1/2 justify-center">
        <img src="/login image.png" alt="Cloud storage" className="max-w-md" />
      </div>
    </div>
  );
}
