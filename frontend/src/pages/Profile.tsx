// src/pages/Profile.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../api/http";
import { useEffect, useState } from "react";

type Team = { id: string; name: string; created_by: string; created_at: string };

export default function Profile() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const api = useApi();
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [canManage, setCanManage] = useState(false);

  // Detect manage:teams from the access token (Auth0 usually sends 'permissions' array with RBAC)
  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        });
        const payload = JSON.parse(atob(token.split(".")[1]));
        const perms: string[] = payload.permissions || [];
        setCanManage(perms.includes("manage:teams"));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Load teams
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/teams");
        setTeams(res.data || []);
        setError(null);
      } catch (e: any) {
        console.error(e);
        setError(e?.response?.data?.message || "Failed to load teams");
      }
    })();
  }, [api]);

  const createTeam = async () => {
    try {
      const res = await api.post("/teams", { name });
      setTeams((prev) => [res.data, ...prev]);
      setName("");
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to create team");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2>Profile</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h3 style={{ marginTop: 24 }}>Teams</h3>
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {canManage ? (
        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New team name"
          />
          <button onClick={createTeam} disabled={!name.trim()}>Create</button>
        </div>
      ) : (
        <p style={{ opacity: 0.7 }}>You don’t have <code>manage:teams</code>. Viewing only.</p>
      )}

      <ul>
        {teams.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> <span style={{ opacity: 0.6 }}>({t.created_by})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
