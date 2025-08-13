import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export function usePermissions() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [canReadTeams, setRead] = useState(false);
  const [canManageTeams, setManage] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        setRead(false); setManage(false);
        return;
      }
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
        });
        const payload = JSON.parse(atob(token.split(".")[1]));
        const perms: string[] = payload.permissions || [];
        setRead(perms.includes("read:teams") || perms.includes("manage:teams"));
        setManage(perms.includes("manage:teams"));
      } catch {
        setRead(false); setManage(false);
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently]);

  return { canReadTeams, canManageTeams };
}
