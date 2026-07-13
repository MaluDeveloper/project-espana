import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageContext";

interface GoogleAuthButtonProps {
  label?: string;
  /**
   * Called when the user clicks the button. If omitted, a placeholder
   * flow runs that simulates Google sign-in and stores a fake user in
   * localStorage (matches the rest of the auth flow until a real backend
   * is wired up).
   */
  onClick?: () => Promise<void> | void;
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.806.54-1.8368.8595-3.0477.8595-2.344 0-4.3282-1.5832-5.036-3.7104H.9573v2.3318C2.4382 15.9831 5.4818 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z"
    />
    <path
      fill="#EA4335"
      d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.3459l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z"
    />
  </svg>
);

export const GoogleAuthButton = ({ label, onClick }: GoogleAuthButtonProps) => {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (onClick) {
        await onClick();
      } else {
        // Frontend-only placeholder: simulate OAuth round-trip.
        await new Promise((r) => setTimeout(r, 900));
        const fakeUser = {
          name: "Usuário Google",
          email: "google.user@example.com",
          picture: null,
        };
        localStorage.setItem("spanish-ai-user", JSON.stringify(fakeUser));
        toast.success(t.auth.google.success);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(t.auth.google.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 hover:shadow-md"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <GoogleIcon className="mr-1" />
          {label ?? t.auth.google.continue}
        </>
      )}
    </Button>
  );
};
