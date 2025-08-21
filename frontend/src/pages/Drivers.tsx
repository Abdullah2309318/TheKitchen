import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../api/http";
import { usePermissions } from "../lib/usePermissions";
import DriverCard from "../components/DriverCard";

type Driver = {
  driver_id: string;
  driver_number: number;
  first_name: string;
  last_name: string;
  name_acronym: string;
  country_code: string | null;
};

export default function Drivers() {
  const api = useApi();
  const { canReadTeams } = usePermissions(); // Reusing existing permission for now
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Simple cache to prevent unnecessary re-fetches
  const driversCache = useMemo(() => new Map<string, Driver[]>(), []);

  const fetchDrivers = useCallback(async () => {
    // Check cache first
    const cacheKey = 'drivers';
    if (driversCache.has(cacheKey)) {
      setDrivers(driversCache.get(cacheKey) || []);
      setHasLoaded(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add minimum loading time to prevent flickering
      const startTime = Date.now();
      const res = await api.get<Driver[]>("/drivers");
      const driversData = res.data || [];
      
      // Ensure minimum loading time of 500ms
      const elapsed = Date.now() - startTime;
      if (elapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsed));
      }
      
      setDrivers(driversData);
      setHasLoaded(true);
      
      // Cache the result
      driversCache.set(cacheKey, driversData);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load drivers");
      setDrivers([]); // Clear drivers on error
    } finally {
      setLoading(false);
    }
  }, [api, driversCache]);

  useEffect(() => {
    if (!hasLoaded) {
      fetchDrivers();
    }
  }, [fetchDrivers, hasLoaded]);

  if (!canReadTeams) return <div style={{ padding: 24 }}>You don't have access to view drivers.</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
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
        <h2 style={{ margin: 0 }}>F1 Drivers</h2>
      </div>
      
      {loading && !hasLoaded && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "24px",
          padding: "20px 0",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "20px",
              height: "200px",
              animation: "pulse 1.5s ease-in-out infinite"
            }}>
              <div style={{ 
                background: "#e9ecef", 
                width: "50px", 
                height: "50px", 
                borderRadius: "50%",
                marginBottom: "16px"
              }} />
              <div style={{ 
                background: "#e9ecef", 
                height: "20px", 
                marginBottom: "8px",
                borderRadius: "4px"
              }} />
              <div style={{ 
                background: "#e9ecef", 
                height: "24px", 
                marginBottom: "8px",
                borderRadius: "4px",
                width: "60%"
              }} />
            </div>
          ))}
        </div>
      )}
      
      {!loading && hasLoaded && drivers.length === 0 && (
        <p style={{ opacity: 0.7, textAlign: "center" }}>No drivers found.</p>
      )}
      
      {hasLoaded && drivers.length > 0 && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "24px",
          padding: "20px 0",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {drivers.map((driver) => (
            <DriverCard key={driver.driver_id} driver={driver} />
          ))}
        </div>
      )}
    </div>
  );
}
