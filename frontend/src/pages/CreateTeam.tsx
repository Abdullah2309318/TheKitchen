import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../api/http";
import { usePermissions } from "../lib/usePermissions";

type Team = { id: string; name: string; created_by: string; created_at: string; player_one?: string|null; player_two?: string|null };

export default function CreateTeam() {
  const { isAuthenticated } = useAuth0();
  const { canManageTeams } = usePermissions();
  const api = useApi();

  const [name, setName] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMsg(null); setErr(null);
  }, [name, p1, p2]);

  const create = async () => {
    setBusy(true); setMsg(null); setErr(null);
    try {
      const res = await api.post<Team>("/teams", { name });
      const team = res.data;
      // If players provided, set both at once
      if (p1.trim() || p2.trim()) {
        await api.patch(`/teams/${team.id}/players`, {
          player_one: p1.trim() || null,
          player_two: p2.trim() || null
        });
      }
      setMsg("Team created.");
      setName(""); setP1(""); setP2("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to create team");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2>Create Team</h2>
      {!isAuthenticated && <p>Please log in.</p>}
      {!canManageTeams && isAuthenticated && <p style={{ opacity: 0.7 }}>You don't have <code>manage:teams</code>.</p>}

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team name" />
        <input value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Player 1 (optional)" />
        <input value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Player 2 (optional)" />
        <button onClick={create} disabled={!name.trim() || !canManageTeams || busy}>
          {busy ? "Creating..." : "Create"}
        </button>
        {msg && <div>{msg}</div>}
        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </div>
    </div>
  );
}
