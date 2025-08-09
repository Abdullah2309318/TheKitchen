import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../api/http";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useAuth0();
  const api = useApi();
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/recipes");
        setRecipes(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [api]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h3 style={{ marginTop: 24 }}>My Recipes (protected API)</h3>
      <pre>{JSON.stringify(recipes, null, 2)}</pre>
    </div>
  );
}
