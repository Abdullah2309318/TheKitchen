import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import SignupButton from "../components/SignupButton";
import styles from "./Home.module.css";

const tiles = [
  { title: "Create Team", path: "/one" },
  { title: "Edit Team(s)", path: "/two" },
  { title: "View Team(s)", path: "/three" },
];

export default function Home() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          TheKitchen
        </Link>
        <div className={styles.authArea}>
          {!isAuthenticated ? (
            <>
              <LoginButton />
              <SignupButton />
            </>
          ) : (
            <>
              <Link to="/profile" className={styles.authButton}>
                Profile
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.tilesGrid}>
          {tiles.map((tile) => (
            <Link key={tile.path} to={tile.path} className={styles.tile}>
              <h2 className={styles.tileTitle}>{tile.title}</h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
