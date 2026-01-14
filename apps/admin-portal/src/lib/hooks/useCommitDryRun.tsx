/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { isObjectType, isString, last } from "remeda";

import { useSnackbar } from "@eshg/lib-portal";

import { useAdminApi } from "@/lib/api/clients";
import { EntityLink } from "@/lib/components/layout/nav/EntityLink";
import { getAdminName } from "@/lib/helpers/adminName";
import { entityToString } from "@/lib/helpers/entityToString";
import { partitionByUuids } from "@/lib/helpers/uuid";
import { useEntities } from "@/lib/hooks/useEntities";

class ErrorMessage {
  message: string;

  tokens: string[];
  ids: string[];

  table?: string;
  columns?: string[];

  constructor(message: string) {
    this.message = message;
    this.tokens = partitionByUuids(message);
    this.ids = this.tokens.filter((_, i) => i % 2);
    const groupsIterator =
      last(this.tokens)?.matchAll(/\(([\w-]+)\.([\w-]+)\)/g) ?? [];
    for (const groups of groupsIterator) {
      if (groups?.length === 3 && groups[1] && groups[2]) {
        this.table = groups[1];
        this.columns = [...(this.columns ?? []), groups[2]];
      }
    }
  }
}

const COMMIT_ERROR_SNACK_KEY = "commit-dry-run-error";

export function useCommitDryRun() {
  const adminApi = useAdminApi();
  const snackbar = useSnackbar();
  const [key, entityIds] = useOwnStagedEntityIds();
  const debouncedKey = useDebounce(key, 5000);

  function queryFn() {
    return entityIds.length
      ? adminApi
          .commitStaged(undefined, entityIds, true)
          .then(() => null, toError)
      : Promise.resolve(null);
  }

  const { data } = useQuery<Error | null>({
    queryKey: ["query-dry-run", debouncedKey],
    queryFn,
  });

  const errorMessage = useMemo(
    () => (data?.message ? new ErrorMessage(data.message) : undefined),
    [data?.message],
  );

  useEffect(() => {
    if (errorMessage) {
      snackbar.error(<FormatedErrorMessage error={errorMessage} />, {
        key: COMMIT_ERROR_SNACK_KEY,
      });
    } else {
      snackbar.close(COMMIT_ERROR_SNACK_KEY);
    }
  }, [snackbar, data, errorMessage]);

  return errorMessage;
}

function useOwnStagedEntityIds() {
  const adminName = getAdminName();

  const { stagedOrgUnits, stagedActors } = useEntities();

  return useMemo<[string, string[]]>(() => {
    const orgUnits = stagedOrgUnits.filter((ou) => ou.author === adminName);
    const actors = stagedActors.filter((a) => a.author === adminName);
    const key = JSON.stringify({ orgUnits, actors }, (k, v: unknown) =>
      k.startsWith("_") ? undefined : v,
    );
    return [key, [...orgUnits.map((ou) => ou.id), ...actors.map((a) => a.id)]];
  }, [adminName, stagedOrgUnits, stagedActors]);
}

function FormatedErrorMessage({ error }: { error: ErrorMessage }): ReactNode {
  const { allOrgUnits, allActors } = useEntities();

  const entitiesById = useMemo(() => {
    return Object.fromEntries(
      [
        ...allOrgUnits.map((ou) => ({
          ...ou,
          linkTo: "org-units",
        })),
        ...allActors.map((a) => ({
          ...a,
          linkTo: "actors",
        })),
      ].map((e) => [e.id, e]),
    );
  }, [allOrgUnits, allActors]);

  return (
    <span>
      {error.tokens.map((t, i) => {
        if (i % 2 === 0) {
          return t;
        }
        const entity = entitiesById[t];
        if (!entity) {
          return t;
        }
        return (
          <EntityLink key={t} linkTo={entity.linkTo} value={t}>
            {entityToString(entity)}
          </EntityLink>
        );
      })}
    </span>
  );
}

function useDebounce<T>(value: T, delayInMsecs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayInMsecs);

    // Return timeout cleanup function
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayInMsecs]);

  return debouncedValue;
}

function toError(e: unknown): Error {
  if (isObjectType(e) && "message" in e && isString(e.message)) {
    return new Error(e.message);
  }
  return new Error(JSON.stringify(e));
}
