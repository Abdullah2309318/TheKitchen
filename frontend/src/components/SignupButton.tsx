import { useAuth0 } from "@auth0/auth0-react";

export default function SignupButton() {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
      style={{ padding: 8 }}
    >
      Sign up
    </button>
  );
}
