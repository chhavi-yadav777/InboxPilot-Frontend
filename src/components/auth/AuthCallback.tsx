import React, { useEffect, useState } from "react";
import { finishGoogleSignIn, startGoogleSignIn } from "../../services/api";
import { Sparkles, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

export const AuthCallback: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleExchange() {
      try {
        await finishGoogleSignIn();
        if (mounted) {
          onComplete();
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to complete Google Sign-In");
        }
      }
    }

    handleExchange();

    return () => {
      mounted = false;
    };
  }, [onComplete]);

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#f5f0e9] p-4 text-center">
        <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">Sign-In Failed</h2>
          <p className="text-xs text-stone-600">{error}</p>
          <div className="pt-2 flex items-center justify-center space-x-2">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
            >
              Return Home
            </button>
            <button
              onClick={() => {
                startGoogleSignIn().catch((e) => {
                  setError(e.message || "Failed to restart sign-in");
                });
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Restart Sign-In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#f5f0e9] p-4 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col items-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="w-7 h-7 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Authenticating with Google</h2>
        <p className="text-xs text-stone-500">
          Validating OAuth state and exchanging credentials with InboxPilot API...
        </p>
        <RefreshCw className="w-5 h-5 text-brand-500 animate-spin mt-2" />
      </div>
    </div>
  );
};
