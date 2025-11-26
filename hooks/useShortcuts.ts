import { useState, useEffect, useCallback, useRef } from "react";
import { ShortcutAction, getShortcutBySequence } from "../lib/shortcuts";

interface UseShortcutsOptions {
  onShortcutTriggered?: (shortcut: ShortcutAction) => void;
  onInvalidSequence?: (sequence: string) => void;
  enabled?: boolean;
}

export const useShortcuts = (options: UseShortcutsOptions = {}) => {
  const [currentSequence, setCurrentSequence] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onShortcutTriggered, onInvalidSequence, enabled = true } = options;

  // Reset sequence after timeout
  const resetSequence = useCallback(() => {
    setCurrentSequence("");
    setIsListening(false);
  }, []);

  // Handle key input
  const handleKeyInput = useCallback(
    (key: string) => {
      if (!enabled) return;

      // Start listening if we get an asterisk
      if (key === "*") {
        setCurrentSequence("*");
        setIsListening(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set timeout to reset sequence
        timeoutRef.current = setTimeout(resetSequence, 3000); // 3 second timeout
        return;
      }

      // If we're listening, add to sequence
      if (isListening) {
        const newSequence = currentSequence + key;
        setCurrentSequence(newSequence);

        // Check if sequence is complete (ends with *)
        if (key === "*") {
          // Clear timeout since sequence is complete
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Execute shortcut if valid
          const shortcut = getShortcutBySequence(newSequence);
          if (shortcut) {
            shortcut.action();
            onShortcutTriggered?.(shortcut);
          } else {
            onInvalidSequence?.(newSequence);
          }

          // Reset sequence
          resetSequence();
        }
      }
    },
    [
      enabled,
      isListening,
      currentSequence,
      onShortcutTriggered,
      onInvalidSequence,
      resetSequence,
    ]
  );

  // Handle numeric input (for number pad)
  const handleNumericInput = useCallback(
    (number: string) => {
      if (!enabled || !isListening) return;

      const newSequence = currentSequence + number;
      setCurrentSequence(newSequence);

      // Check if this creates a valid shortcut
      const potentialShortcut = newSequence + "*";
      const shortcut = getShortcutBySequence(potentialShortcut);

      if (shortcut) {
        // Clear timeout since we found a potential shortcut
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Wait a bit to see if user completes the sequence
        timeoutRef.current = setTimeout(() => {
          if (currentSequence === newSequence) {
            // User didn't complete, execute the shortcut
            shortcut.action();
            onShortcutTriggered?.(shortcut);
            resetSequence();
          }
        }, 1000); // 1 second delay
      }
    },
    [enabled, isListening, currentSequence, onShortcutTriggered, resetSequence]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Manual shortcut execution
  const executeShortcut = useCallback(
    (sequence: string) => {
      const shortcut = getShortcutBySequence(sequence);
      if (shortcut) {
        shortcut.action();
        onShortcutTriggered?.(shortcut);
        return true;
      }
      return false;
    },
    [onShortcutTriggered]
  );

  // Start listening for shortcuts
  const startListening = useCallback(() => {
    setIsListening(true);
  }, []);

  // Stop listening for shortcuts
  const stopListening = useCallback(() => {
    setIsListening(false);
    setCurrentSequence("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    currentSequence,
    isListening,
    handleKeyInput,
    handleNumericInput,
    executeShortcut,
    startListening,
    stopListening,
    resetSequence,
  };
};
