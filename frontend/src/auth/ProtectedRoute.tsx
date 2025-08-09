import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

type ProtectedProps = {
  component: React.ComponentType;
};

export default function ProtectedRoute({ component: Component }: ProtectedProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: window.location.pathname } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!isAuthenticated) return null; // redirecting

  return <Component />;
}
