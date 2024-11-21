/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";

import { useInboxProcedureApi } from "@/lib/businessModules/inspection/api/clients";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { useCloseInboxProcedureTemplate } from "@/lib/shared/components/procedures/inbox/mutations/useCloseInboxProcedureStatusTemplate";

export function useCloseInboxProcedure() {
  return useCloseInboxProcedureTemplate(useInboxProcedureApi);
}

export function useCreateInboxProcedure(inboxProcedureId: string) {
  const router = useRouter();
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();
  return function () {
    router.push(
      buildRoutePreservingSearchParams(routes.inbox.create(inboxProcedureId)),
    );
  };
}
