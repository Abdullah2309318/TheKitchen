import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import SignupButton from "../components/SignupButton";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const { isAuthenticated } = useAuth0();
  return (
    <div style={{ padding: 24 }}>
      <h1>TheKitchen</h1>
      <p>This is a public page.</p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {!isAuthenticated ? (
          <>
            <LoginButton />
            <SignupButton />
          </>
        ) : (
          <LogoutButton />
        )}
        <Link to="/profile">Go to Profile (protected)</Link>
      </div>
    </div>
  );
}
