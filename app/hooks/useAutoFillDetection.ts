// hooks/useAutoFillDetection.ts
import { useEffect, useRef, useCallback } from 'react';

export const useAutoFillDetection = (
  formRef: React.RefObject<HTMLFormElement>,
  onAutoFillDetected: () => void,
  interval: number = 500,
  duration: number = 30000
) => {
  const checkInterval = useRef<NodeJS.Timeout | null>(null);
  const lastValues = useRef<Record<string, string>>({});

  const checkAutoFill = useCallback(() => {
    if (!formRef.current) return;

    const inputs = formRef.current.querySelectorAll('input[data-autofill-check]');
    let hasChanges = false;

    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      const name = element.name;
      const value = element.value;

      if (lastValues.current[name] !== value) {
        if (value && !lastValues.current[name]) {
          console.log(`🤖 Autofill detected: ${name}`, value);
          
          // Trigger events
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          
          hasChanges = true;
        }
        lastValues.current[name] = value;
      }
    });

    if (hasChanges) {
      onAutoFillDetected();
    }
  }, [formRef, onAutoFillDetected]);

  useEffect(() => {
    const startMonitoring = () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
      
      checkInterval.current = setInterval(checkAutoFill, interval);
      
      setTimeout(() => {
        if (checkInterval.current) {
          clearInterval(checkInterval.current);
          checkInterval.current = null;
        }
      }, duration);
    };

    // Start with delay for Safari
    const timeoutId = setTimeout(startMonitoring, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [checkAutoFill, interval, duration]);

  return checkAutoFill;
};