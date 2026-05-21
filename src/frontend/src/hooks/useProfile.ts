import { QUERY_KEYS } from "@/api";
import { createActor } from "@/backend";
import { Variant_accountant_owner_viewer } from "@/backend";
import type { UserProfile } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: QUERY_KEYS.userProfile,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile() as Promise<UserProfile | null>;
    },
    enabled: !!actor && !isFetching,
  });

  const roleQuery = useQuery<string>({
    queryKey: QUERY_KEYS.userRole,
    queryFn: async () => {
      if (!actor) return "guest";
      const role = await actor.getCallerUserRole();
      return role.toString();
    },
    enabled: !!actor && !isFetching,
  });

  const saveProfile = useMutation({
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile({
        name: profile.name,
        role: Variant_accountant_owner_viewer.owner,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile });
    },
  });

  return {
    profile: profileQuery.data ?? null,
    role: roleQuery.data ?? "guest",
    isLoading: profileQuery.isLoading,
    saveProfile: saveProfile.mutate,
    isSaving: saveProfile.isPending,
  };
}
