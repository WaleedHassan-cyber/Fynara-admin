import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, type = "protected" }) {
  const [auth, setAuth] = useState(null);
   const URL = import.meta.env.VITE_API_URL
  useEffect(() => {
    fetch(`${URL}/api/check-auth`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) setAuth(true);
        else setAuth(false);
      })
      .catch(() => setAuth(false));
  }, [window.location.pathname]);

  if (auth === null) return <><Loader/></>;

  // Route type: "protected" => allow only if logged in
  if (type === "protected" && !auth) return <Navigate to="/" />;

  // Route type: "public" => block if already logged in
  if (type === "public" && auth) return <Navigate to="/dashboard" />;

  return children;
}
