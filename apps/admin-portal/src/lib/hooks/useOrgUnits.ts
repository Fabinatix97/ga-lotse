/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { prop, sortBy } from "remeda";

import {
  ApiAdminActor,
  ApiAdminOrgUnit,
  ApiAdminPartialOrgUnit,
  ApiAdminStagedEntityAdminPartialActor,
  ApiAdminStagedEntityAdminPartialOrgUnit,
  ApiAdminStagedEntityType,
  ApiGetOrgUnitsResponse,
  ServiceDirectoryAdminApi,
} from "@eshg/service-directory-api";

import { BackendError, useAdminApi } from "@/lib/api/clients";
import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import { minutes } from "@/lib/helpers/datetime";
import { OverridableEntity } from "@/lib/helpers/entities";

export type PartialOrgUnitWithId = Omit<ApiAdminPartialOrgUnit, "id"> & {
  id: string;
};
export type StagedOrgUnitWithEntityId = Omit<
  ApiAdminStagedEntityAdminPartialOrgUnit,
  "entity"
> & {
  entity?: PartialOrgUnitWithId;
};
export type OrgUnit = PartialOrgUnitWithId &
  OverridableEntity<OrgUnit> & {
    actors: PartialActorWithId[];
    _staged: StagedOrgUnitWithEntityId[];
    author?: string;
    _type: "orgUnit";
    _parent?: OrgUnit;
  };

export const ORG_UNITS_QUERY = ["org-units"];

function fetchOrgUnits(
  adminApi: ServiceDirectoryAdminApi,
): () => Promise<ApiGetOrgUnitsResponse> {
  return async (): Promise<ApiGetOrgUnitsResponse> => {
    return await adminApi.getAllOrgUnits().then(
      (response) => {
        const id = prop<
          | ApiAdminActor
          | ApiAdminOrgUnit
          | ApiAdminStagedEntityAdminPartialActor
          | ApiAdminStagedEntityAdminPartialOrgUnit,
          "id"
        >("id");
        return {
          orgUnits: sortBy(
            response.orgUnits.map((ou) => ({
              ...ou,
              actors: sortBy(ou.actors, id),
            })),
            id,
          ),
          stagedActors: sortBy(response.stagedActors, id),
          stagedOrgUnits: sortBy(response.stagedOrgUnits, id),
        };
      },
      (error: BackendError | Error) => {
        if (error.message.startsWith("Failed to fetch"))
          throw new Error("FetchFailed");
        if ("status" in error) throw new Error(error.status.toString());
        else throw new Error(error.message);
      },
    );
  };
}

const queryKey = ORG_UNITS_QUERY;

export function useOrgUnitsQuery() {
  const adminApi = useAdminApi();

  return useQuery({
    queryKey,
    queryFn: fetchOrgUnits(adminApi),
    refetchOnWindowFocus: true,
    refetchInterval: minutes(1),
    throwOnError: false,
  });
}

export function useOrgUnits(): PartialOrgUnitWithId[] {
  const { isPending, isError, data } = useOrgUnitsQuery();
  return useMemo(() => {
    if (isPending || isError) {
      return [];
    }
    const orgUnits = data.orgUnits;
    const orgUnitIds = orgUnits.map((a) => a.id);

    const stagedOrgUnits =
      data.stagedOrgUnits
        ?.filter((a) => a.stagedEntityType !== ApiAdminStagedEntityType.Del)
        .filter((a) => !orgUnitIds.includes(a.id))
        .map((a) => ({ ...a.entity, id: a.id, author: a.author })) ?? [];

    return [...orgUnits, ...stagedOrgUnits];
  }, [data, isError, isPending]);
}

export function useOrgUnitsById(): Record<string, PartialOrgUnitWithId> {
  const orgUnits = useOrgUnits();
  return useMemo(
    () => Object.fromEntries(orgUnits.map((ou) => [ou.id, ou])),
    [orgUnits],
  );
}
