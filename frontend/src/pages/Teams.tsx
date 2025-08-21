import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../api/http";
import { usePermissions } from "../lib/usePermissions";

type Team = { id: string; name: string; created_by: string; created_at: string; player_one?: string|null; player_two?: string|null };

export default function Teams() {
  const api = useApi();
  const { canReadTeams } = usePermissions();
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Team[]>("/teams");
        setTeams(res.data || []);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load teams");
      } finally {
        setLoading(false);
      }
    })();
  }, [api]);

  if (!canReadTeams) return <div style={{ padding: 24 }}>You don't have access to view teams.</div>;
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Link to="/" style={{ 
          padding: "10px 20px", 
          backgroundColor: "#007bff", 
          color: "white", 
          textDecoration: "none", 
          borderRadius: "6px",
          fontSize: "14px",
          display: "inline-block",
          marginBottom: "20px"
        }}>
          ← Back to Home
        </Link>
        <h2 style={{ margin: 0 }}>Teams</h2>
      </div>
      {teams.length === 0 && <p style={{ opacity: 0.7 }}>No teams yet.</p>}
      <ul>
        {teams.map((t) => {
          const count = (t.player_one ? 1 : 0) + (t.player_two ? 1 : 0);
          return (
            <li key={t.id} style={{ marginBottom: 8 }}>
              <strong>{t.name}</strong> <span style={{ opacity: 0.6 }}>({count}/2 players)</span>
              <div style={{ fontSize: 14, opacity: 0.8 }}>
                {t.player_one || t.player_two ? (
                  <>
                    {t.player_one && <div>• {t.player_one}</div>}
                    {t.player_two && <div>• {t.player_two}</div>}
                  </>
                ) : (
                  <div>No players yet.</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
