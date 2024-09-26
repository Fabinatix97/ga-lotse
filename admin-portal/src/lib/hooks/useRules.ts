/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminActor,
  ApiAdminPartialRule,
  ApiAdminRule,
  ApiAdminStagedEntityAdminPartialActor,
  ApiAdminStagedEntityAdminPartialRule,
  ApiGetRulesResponse,
  ServiceDirectoryAdminApi,
} from "@eshg/admin-portal-api/serviceDirectory";
import { useQuery } from "@tanstack/react-query";
import { prop, sortBy } from "remeda";

import { BackendError, useAdminApi } from "@/lib/api/clients";
import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import { minutes } from "@/lib/helpers/datetime";
import { OverridableEntity } from "@/lib/helpers/entities";

export type PartialRuleWithId = Omit<ApiAdminPartialRule, "id"> & {
  id: string;
};
export type StagedRuleWithEntityId = Omit<
  ApiAdminStagedEntityAdminPartialRule,
  "entity"
> & {
  entity?: PartialRuleWithId;
};
export type Rule = PartialRuleWithId &
  OverridableEntity<Rule> & {
    _staged: StagedRuleWithEntityId[];
    _matchingClientActors: PartialActorWithId[];
    _matchingServerActors: PartialActorWithId[];
    author?: string;
    _type: "rule";
    _parent?: Rule;
  };
export const RULES_QUERY = ["rules"];

export function fetchRules(adminApi: ServiceDirectoryAdminApi) {
  return async (): Promise<ApiGetRulesResponse> => {
    return await adminApi.getAllRules().then(
      (response) => {
        const id = prop<
          | ApiAdminActor
          | ApiAdminRule
          | ApiAdminStagedEntityAdminPartialActor
          | ApiAdminStagedEntityAdminPartialRule,
          "id"
        >("id");
        return {
          rules: sortBy(response.rules, id),
          stagedRules: sortBy(response.stagedRules, id),
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

const queryKey = RULES_QUERY;

export function useRulesQuery() {
  const adminApi = useAdminApi();
  return useQuery({
    queryKey,
    queryFn: fetchRules(adminApi),
    refetchOnWindowFocus: true,
    refetchInterval: minutes(1),
    throwOnError: false,
  });
}

export function useAuditedRules(): PartialRuleWithId[] {
  const adminApi = useAdminApi();
  const { isPending, isError, data } = useQuery({
    queryKey: RULES_QUERY,
    queryFn: fetchRules(adminApi),
    throwOnError: false,
  });

  if (isPending || isError) {
    return [];
  }
  return data.rules;
}
