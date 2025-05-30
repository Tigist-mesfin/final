import { useState } from "react";
import { useNavigate,  Link } from "react-router-dom";
import { User, Lock } from "lucide-react";




const LoginForm = () => {
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roles = {
    admin: { title: "Admin Login", placeholder: "Admin Username", path: "/admin-dashboard" },
    site_contractor: { title: "Site Construction Login", placeholder: "Site contructor Username", path: "/site-dashboard" },
    client: { title: "Client Login", placeholder: "Client Username", path: "/client-dashboard" }
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors

  // Username validation: letters/numbers only, 4–10 chars
  const usernameRegex = /^[a-zA-Z0-9]{4,10}$/;
  if (!usernameRegex.test(username)) {
    setError("Username must be 4–10 characters and contain only letters and numbers.");
    return;
  }

  // Password length validation: 6–8 characters
  if (password.length < 6 || password.length > 8) {
    setError("Password must be between 6 and 8 characters.");
    return;
  }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }) // Include role in the request
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userRole", role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        navigate(roles[role].path); // Redirect based on role
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white border shadow-lg rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-around mb-4">
          {Object.keys(roles).map((key) => (
            <button
              key={key}
              className={`w-32 px-2 py-2 rounded-lg font-semibold transition duration-300 ${
                role === key ? "bg-sky-800 text-white" : "bg-gray-200  text-black"
              }`}
              onClick={() => setRole(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">{roles[role].title}</h2>
        {error && <p className="text-red-700 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
  {/* Username Field */}
  <div className="flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-Hex2">
    <User className="text-sky-900 mr-2" size={20} />
    <input
      type="text"
      placeholder={roles[role].placeholder}
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full focus:outline-none"
      required
    />
  </div>

  {/* Password Field */}
  <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-Hex2">
    <Lock className="text-sky-900 mr-2" size={20} />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full focus:outline-none"
      required
    />
  </div>
 <p className="text-sm text-center mt-2">
  <Link to="/forgot-password" className="text-sky-700 underline">Forgot Password?</Link>
</p>

  {/* Login Button */}
  <button
    type="submit"
    className="w-full bg-Hex2 text-black  py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
  >
    Login
  </button>
</form>

      </div>
    </div>
  );
};

export default LoginForm;
