import { h } from "preact";
import { route } from "preact-router";
import { useContext, useState } from "preact/hooks";
import Auth from "../../context/auth";

export default function Search() {
  const { token } = useContext(Auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState("");

  if (token === "") {
    route("/login");
  }

  const handleInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClick = () => {
    const graphql = JSON.stringify({
      query: `query SearchTransactions {
        user {
          bankAccounts {
            accountType
            currentBalance
            transactions(filter: {description: {glob: "*${searchTerm}*"}}) {
              edges {
                node {
                  amount
                  description
                  date
                  id
                }
              }
            }
          }
        }
      }`,
    });

    fetch("https://api.stitch.money/graphql", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: graphql,
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      });
  };

  return (
    <div>
      <form>
        <label>
          Reference: <input value={searchTerm} onChange={handleInput} />
        </label>
        <button type="button" onClick={handleClick}>
          search
        </button>
      </form>

      <div>
        {results.data?.user.bankAccounts.map((account) =>
          account.transactions.edges.map(({ node }) => (
            <div key={node.id}>
              {node.description}: {node.amount.currency} {node.amount.quantity}{" "}
              at {node.date}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
