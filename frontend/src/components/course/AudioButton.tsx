import { useEffect, useRef, useState } from "react";
import { Volume2, Volume1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioButtonProps {
  text: string;
  slow?: boolean;
  label?: string;
  className?: string;
}

/**
 * Player de pronúncia em espanhol usando a Web Speech API nativa do navegador.
 * Funciona como placeholder até que tenhamos áudios gravados.
 */
export const AudioButton = ({ text, slow = false, label, className }: AudioButtonProps) => {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const ref = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES";
    utt.rate = slow ? 0.6 : 1;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    ref.current = utt;
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  const Icon = slow ? Volume1 : Volume2;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={speak}
      disabled={!supported}
      title={!supported ? "Áudio indisponível neste navegador" : label ?? (slow ? "Lento" : "Ouvir")}
      className={cn("h-8 px-2 gap-1.5", speaking && "text-primary animate-pulse", className)}
    >
      <Icon className="w-4 h-4" />
      {label && <span className="text-xs font-semibold">{label}</span>}
    </Button>
  );
};
