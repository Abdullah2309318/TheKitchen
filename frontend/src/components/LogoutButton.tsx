import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      style={{ 
        padding: '0.5rem 1rem',
        border: '1px solid #fecaca',
        borderRadius: '0.375rem',
        background: 'white',
        color: '#dc2626',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Log out
    </button>
  );
}
