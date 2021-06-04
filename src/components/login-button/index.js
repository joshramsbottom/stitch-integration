import queryString from "query-string";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import useLocalStorage from "../../hooks/use-local-storage";

function base64UrlEncode(byteArray) {
  const charCodes = String.fromCharCode(...byteArray);
  return btoa(charCodes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function sha256(value) {
  const msgBuffer = new TextEncoder("utf-8").encode(value);
  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  return new Uint8Array(hashBuffer);
}

async function generateAuthParams(state, verifier) {
  return {
    client_id: "test-18fbd892-3b73-43c3-a854-c6f78c681349",
    scope: ["openid", "accounts", "balances"],
    response_type: "code",
    redirect_uri: "https://localhost:8080/return",
    nonce: base64UrlEncode(crypto.getRandomValues(new Uint8Array(32))),
    state,
    code_challenge: await sha256(verifier).then(base64UrlEncode),
    code_challenge_method: "S256",
  };
}

export default function LoginButton({ children }) {
  const [state] = useState(() =>
    base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)))
  );
  const [verifier] = useState(() =>
    base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)))
  );
  const [, setLocalState] = useLocalStorage(state, {});
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const getAuthParams = async () => {
      const params = await generateAuthParams(state, verifier);
      setQueryParams(params);
    };
    getAuthParams();
  }, [state, verifier]);

  return (
    <button
      type="button"
      onClick={() => setLocalState({ verifier, nonce: queryParams.nonce })}
    >
      <a
        href={`https://secure.stitch.money/connect/authorize?${queryString.stringify(
          queryParams,
          { arrayFormat: "separator", arrayFormatSeparator: " " }
        )}`}
      >
        {children}
      </a>
    </button>
  );
}
