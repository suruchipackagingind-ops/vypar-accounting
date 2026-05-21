import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear, isAuthenticated } =
    useInternetIdentity();

  const isLoading =
    loginStatus === "logging-in" || loginStatus === "initializing";
  const principal = identity?.getPrincipal();

  return {
    identity,
    principal,
    isAuthenticated,
    isLoading,
    loginStatus,
    login,
    logout: clear,
  };
}
