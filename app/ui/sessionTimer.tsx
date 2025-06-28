// app/ui/components/sessionTimer.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearSessionCookie } from "@/utils/cookies";

interface SessionTimerProps {
  expiresAt: string;
  onExpired?: () => void;
  redirectTo?: string;
  className?: string;
}

export default function SessionTimer({ 
  expiresAt, 
  onExpired, 
  redirectTo = "/",
  className = "" 
}: SessionTimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
    total: number;
  }>({ minutes: 0, seconds: 0, total: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const difference = expiry - now;

    if (difference <= 0) {
      return { minutes: 0, seconds: 0, total: 0 };
    }

    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { minutes, seconds, total: difference };
  }, [expiresAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);

      // Warning when 2 minutes left
      if (time.total <= 2 * 60 * 1000 && time.total > 0) {
        setIsWarning(true);
      }

      // Session expired
      if (time.total <= 0 && !isExpired) {
        setIsExpired(true);
        clearInterval(timer);
        
        // Clear session cookie
        clearSessionCookie();
        
        // Show toast notification
        toast.error("Sesi Anda telah berakhir. Silakan booking ulang.");
        
        // Call onExpired callback if provided
        if (onExpired) {
          onExpired();
        } else {
          // Default redirect
          setTimeout(() => {
            router.push(redirectTo);
          }, 2000);
        }
      }
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [calculateTimeLeft, isExpired, onExpired, redirectTo, router]);

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-red-100 border border-red-300 rounded-lg text-red-700 ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">Sesi Berakhir</span>
      </div>
    );
  }

  const getTimerColor = () => {
    if (timeLeft.total <= 1 * 60 * 1000) return "text-red-600 bg-red-50 border-red-200"; // Last 1 minute
    if (timeLeft.total <= 2 * 60 * 1000) return "text-orange-600 bg-orange-50 border-orange-200"; // Last 2 minutes
    if (timeLeft.total <= 5 * 60 * 1000) return "text-yellow-600 bg-yellow-50 border-yellow-200"; // Last 5 minutes
    return "text-green-600 bg-green-50 border-green-200";
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all duration-300 ${getTimerColor()} ${className}`}>
      <Clock className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-xs opacity-75">Sesi berakhir dalam</span>
        <span className="text-sm font-mono font-bold">
          {formatTime(timeLeft.minutes, timeLeft.seconds)}
        </span>
      </div>
      {isWarning && (
        <div className="animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-500" />
        </div>
      )}
    </div>
  );
}