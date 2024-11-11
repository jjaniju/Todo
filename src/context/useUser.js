import { useContext } from "react";
import { userContext } from "./UserContext";

export const useUser = () => {
  return useContext(userContext);
};