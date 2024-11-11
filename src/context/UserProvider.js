import { useState } from "react";
import { userContext } from "./UserContext";
import axios from "axios";

const url = "http://localhost:3001/"

export default function UserProvider({ children }) {
  const userFromSessionStorage = sessionStorage.getItem("user");
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : { email: "", password: "" }
  );

  const signUp = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      const response = await axios.post(url + "user/register", json, headers);
      const token = response.data.token;
      setUser(response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      setUser({ email: "", password: "" });
      throw error;
    }
  };

  const signIn = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      const response = await axios.post(url + "user/login", json, headers);
      const token = response.data.token;
      setUser(response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      setUser({ email: "", password: "" });
      throw error;
    }
  };

  return (
    <userContext.Provider value={{ user, setUser, signUp, signIn }}>
      {children}
    </userContext.Provider>
  );
}