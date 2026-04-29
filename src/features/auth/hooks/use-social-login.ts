import { useState } from "react";
import { toast } from "sonner";
import { usePreviousLocation } from "@/hooks/use-previous-location";
import { authClient } from "@/lib/auth/auth.client";
import { getSocialLoginAuthErrorMessage } from "@/lib/auth/auth-errors";
import { m } from "@/paraglide/messages";
import { normalizeRedirectUrl } from "./normalize-redirect-url";

export interface UseSocialLoginOptions {
  redirectTo?: string;
}

export function useSocialLogin(options: UseSocialLoginOptions) {
  const { redirectTo } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const previousLocation = usePreviousLocation();
  const callbackURL = normalizeRedirectUrl(redirectTo, previousLocation);

  const handleGithubLogin = async () => {
    if (isLoading || isGoogleLoading) return;

    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "github",
      errorCallbackURL: `${window.location.origin}/login`,
      callbackURL,
    });

    if (error) {
      toast.error(m.login_toast_social_failed(), {
        description:
          getSocialLoginAuthErrorMessage(error, m) ??
          m.auth_error_default_desc(),
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (isLoading || isGoogleLoading) return;

    setIsGoogleLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      errorCallbackURL: `${window.location.origin}/login`,
      callbackURL,
    });

    if (error) {
      toast.error(m.login_toast_social_failed(), {
        description:
          getSocialLoginAuthErrorMessage(error, m) ??
          m.auth_error_default_desc(),
      });
      setIsGoogleLoading(false);
      return;
    }

    setIsGoogleLoading(false);
  };

  return {
    isLoading,
    isGoogleLoading,
    turnstilePending: false,
    handleGithubLogin,
    handleGoogleLogin,
  };
}

export type UseSocialLoginReturn = ReturnType<typeof useSocialLogin>;
