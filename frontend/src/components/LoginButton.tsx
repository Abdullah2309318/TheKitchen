import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return (
    <button 
      onClick={() => loginWithRedirect()} 
      style={{ 
        padding: '0.5rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        background: 'white',
        color: '#374151',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      Log in
    </button>
  );
}