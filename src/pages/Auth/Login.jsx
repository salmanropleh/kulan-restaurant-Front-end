import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Utensils, Sprout, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/ui/Toast/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("kulanRememberEmail");
    const savedRememberMe = localStorage.getItem("kulanRememberMe");

    if (savedRememberMe === "true" && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle remember me functionality
  const handleRememberMe = (checked) => {
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem("kulanRememberEmail");
      localStorage.removeItem("kulanRememberMe");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToastMessage("Please fill in all fields");
      setShowToast(true);
      return;
    }

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem("kulanRememberEmail", email);
      localStorage.setItem("kulanRememberMe", "true");
    } else {
      localStorage.removeItem("kulanRememberEmail");
      localStorage.removeItem("kulanRememberMe");
    }

    const result = await login(email, password);

    if (result.success) {
      setToastMessage("🎉 Login successful!");
      setShowToast(true);
      setTimeout(() => {
        // SIMPLIFIED: Redirect based on user role only
        if (result.user.is_staff || result.user.is_superuser) {
          // Admin users always go to admin dashboard
          navigate("/admin", { replace: true });
        } else {
          // Regular users always go to home page
          navigate("/", { replace: true });
        }
      }, 1500);
    } else {
      setToastMessage(result.error || "Login failed");
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 m-0 p-0 overflow-hidden">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastMessage.includes("successful") ? "success" : "error"}
      />

      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8 sm:my-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel */}
          <div className="hidden lg:block bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-white">
            <div className="h-full flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6">
                Welcome to Kulan Restaurant
              </h2>
              <p className="text-orange-100 mb-8">
                Experience culinary excellence with our authentic flavors,
                premium ingredients, and exceptional dining atmosphere that
                celebrates the art of fine cuisine.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <p>Authentic recipes passed down through generations</p>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <p>Fresh, locally-sourced ingredients daily</p>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Star className="h-5 w-5" />
                  </div>
                  <p>Award-winning chefs and premium service</p>
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-white/20">
                <p className="text-sm text-orange-200">
                  New to Kulan Restaurant?
                </p>
                <Link
                  to="/signup"
                  className="inline-block mt-2 bg-white text-orange-600 py-2 px-6 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to your account</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-500 hover:text-orange-600 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => handleRememberMe(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign up link for mobile */}
            <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-orange-600 font-medium hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Admin notice */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Admin Access
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Admin accounts must be created in the backend
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Use Django admin or management commands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
