import { useState, useRef, useEffect } from "react";

export const useTextToSpeech = (onSpeakingChange) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const synthRef = useRef(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!isSupported) return;
    synthRef.current = window.speechSynthesis;

    const updateVoices = () => setVoices(synthRef.current.getVoices());
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();

    return () => synthRef.current?.cancel();
  }, [isSupported]);

  const speakText = (text) => {
    if (!synthRef.current || !isSupported) return;

    synthRef.current.cancel(); // stop previous speech if any

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[0] || null;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakingChange?.(true); // Notify STT
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  };

  return { isSpeaking, speakText, stopSpeaking, isSupported };
};
