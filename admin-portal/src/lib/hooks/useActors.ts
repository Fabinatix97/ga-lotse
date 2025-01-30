/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAdminStagedEntityType } from "@eshg/service-directory-api";
import { useMemo } from "react";

import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import { useOrgUnitsQuery } from "@/lib/hooks/useOrgUnits";

export function useAuditedAndStagedActors(): PartialActorWithId[] {
  const { isPending, isError, data } = useOrgUnitsQuery();
  return useMemo(() => {
    if (isPending || isError) {
      return [];
    }
    const actors: PartialActorWithId[] = data.orgUnits.flatMap((ou) =>
      ou.actors.map((a) => ({
        ...a,
        orgUnitId: ou.id,
      })),
    );
    return [
      ...actors,
      ...(data.stagedActors
        ?.filter((a) => a.stagedEntityType !== ApiAdminStagedEntityType.Del)
        .map((a) => ({ ...a.entity, id: a.id, author: a.author })) ?? []),
    ];
  }, [isPending, isError, data]);
}

export function useAuditedActors(): PartialActorWithId[] {
  const { isPending, isError, data } = useOrgUnitsQuery();
  return useMemo(() => {
    if (isPending || isError) {
      return [];
    }
    return data.orgUnits.flatMap((ou) =>
      ou.actors.map((a) => ({
        ...a,
        orgUnitId: ou.id,
      })),
    );
  }, [isPending, isError, data]);
}
