import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { PropsWithChildren } from "react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string;

export default function Auth0ProviderWithNavigate({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  if (!domain || !clientId) {
    console.warn("Missing Auth0 env vars (VITE_AUTH0_DOMAIN / VITE_AUTH0_CLIENT_ID).");
  }

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    // go back to intended route, or home by default
    navigate(appState?.returnTo || "/", { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback",
        audience, // so access tokens include your API audience
      }}
      useRefreshTokens
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
