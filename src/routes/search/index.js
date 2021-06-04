import { h } from "preact";
import { route } from "preact-router";
import { useContext, useState } from "preact/hooks";
import Auth from "../../context/auth";

export default function Search() {
  const { token } = useContext(Auth);
  const [query, setQuery] = useState("");

  if (token === "") {
    route("/login");
  }

  const handleInput = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <form>
        <label>
          Reference: <input value={query} onChange={handleInput} />
        </label>
        <button>search</button>
      </form>
    </div>
  );
}
