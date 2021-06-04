import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import queryString from "query-string";
import Auth from "../../context/auth";
import useLocalStorage from "../../hooks/use-local-storage";

export default function Return({ code, state }) {
  const [localState] = useLocalStorage(state, null);
  const [tokenResponse, setTokenResponse] = useState({});
  const { setToken } = useContext(Auth);

  useEffect(() => {
    const doTokenRequest = async () => {
      const { verifier } = localState;
      const body = {
        grant_type: "authorization_code",
        client_id: "test-18fbd892-3b73-43c3-a854-c6f78c681349",
        code,
        redirect_uri: "https://localhost:8080/return",
        code_verifier: verifier,
      };

      await fetch("https://secure.stitch.money/connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: queryString.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => setTokenResponse(data));
    };

    if (localState !== null) {
      doTokenRequest();
    }

    return () => window.localStorage.removeItem(state);
  }, [code, localState, state]);

  useEffect(() => {
    if (tokenResponse.access_token) {
      setToken(tokenResponse.access_token);
      route("/");
    }
  }, [tokenResponse, setToken]);

  return (
    <div>
      {code ? (
        <div>Account linked successfully, redirecting...</div>
      ) : (
        <div>
          Looks like we couldn't link your bank account, would you like to{" "}
          <a href="/">try again</a>?
        </div>
      )}
    </div>
  );
}
