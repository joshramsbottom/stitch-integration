import { createContext } from "preact";

const Auth = createContext({
  token: "",
  setToken: () => {},
});

export default Auth;
