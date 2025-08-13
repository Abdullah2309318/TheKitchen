import { useEffect, useState } from "react";
import { useApi } from "../api/http";
import { usePermissions } from "../lib/usePermissions";

type Team = { id: string; name: string; player_one: string | null; player_two: string | null };

export default function EditTeams() {
  const api = useApi();
  const { canManageTeams } = usePermissions();
  const [teams, setTeams] = useState<Team[]>([]);
  const [newName, setNewName] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get<Team[]>("/teams");
      setTeams(res.data || []);
      setErr(null);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load teams");
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (id: string) => {
    try {
      const name = (newName[id] || "").trim();
      if (!name) return;
      await api.post(`/teams/${id}/players`, { name });
      setNewName((s) => ({ ...s, [id]: "" }));
      setMsg("Player added.");
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to add player");
    }
  };

  const remove = async (id: string, slot: 1 | 2) => {
    try {
      await api.delete(`/teams/${id}/players/${slot}`);
      setMsg("Player removed.");
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to remove player");
    }
  };

  if (!canManageTeams) return <div style={{ padding: 24 }}>You don't have manage:teams.</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2>Edit Teams</h2>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <ul>
        {teams.map((t) => {
          const count = (t.player_one ? 1 : 0) + (t.player_two ? 1 : 0);
          const full = count >= 2;
          return (
            <li key={t.id} style={{ marginBottom: 14 }}>
              <strong>{t.name}</strong> <span style={{ opacity: 0.6 }}>({count}/2)</span>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                {t.player_one && (
                  <div>
                    • {t.player_one}{" "}
                    <button onClick={() => remove(t.id, 1)} style={{ marginLeft: 8 }}>Remove</button>
                  </div>
                )}
                {t.player_two && (
                  <div>
                    • {t.player_two}{" "}
                    <button onClick={() => remove(t.id, 2)} style={{ marginLeft: 8 }}>Remove</button>
                  </div>
                )}
                {!t.player_one && !t.player_two && <div>No players yet.</div>}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={newName[t.id] || ""}
                  onChange={(e) => setNewName((s) => ({ ...s, [t.id]: e.target.value }))}
                  placeholder={full ? "Team already has two players" : "Add player name"}
                  disabled={full}
                />
                <button onClick={() => add(t.id)} disabled={full || !(newName[t.id] || "").trim()}>
                  Add
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
