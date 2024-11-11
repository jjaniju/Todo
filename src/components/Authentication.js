import { Link, useNavigate } from "react-router-dom";
import "./Authentication.css";
import React from "react";
import { useUser } from "../context/useUser";

export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});

export default function Authentication({ authenticationMode }) {
  const { user, setUser, signUp, signIn } = useUser();
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp();
        Navigate("/signin");
      } else {
        await signIn();
        Navigate("/");
      }
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.error
          : error;
      alert(message);
    }
  };

  return (
    <div>
      <h3>
        {authenticationMode === AuthenticationMode.Login
          ? "Sign in"
          : "Sign up"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <div>
          <button>
            {authenticationMode === AuthenticationMode.Login
              ? "Sign in"
              : "Sign up"
              }
          </button>
        </div>
        <div>
          <Link
            to={
              authenticationMode === authenticationMode.Login
                ? "/signin"
                : "/signup"
            }
          >
            {authenticationMode === AuthenticationMode.Login
              ? "No account? signup"
              : "Already signed up? sign in"}
              
              
            
          </Link>
        </div>
      </form>
    </div>
  );
}