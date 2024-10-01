/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAdminActor,
  ApiAdminActorType,
  ApiAdminPartialActor,
  ApiAdminStagedEntityAdminPartialActor,
  ApiAdminStagedEntityType,
  ApiGetOrgUnitsResponse,
} from "@eshg/admin-portal-api/serviceDirectory";
import { createColumnHelper, filterFns } from "@tanstack/react-table";
import { useMemo } from "react";

import { DeleteRow } from "@/lib/components/table/DeleteRow";
import { EditableTable } from "@/lib/components/table/EditableTable";
import {
  getFilterFn,
  matchingClientRulesFilterFn,
  matchingServerRulesFilterFn,
  orgUnitFilterFn,
} from "@/lib/components/table/Filter";
import { NewEntityParentRow } from "@/lib/components/table/NewEntityParentRow";
import { CertificateCell } from "@/lib/components/table/cell/CertificateCell";
import { EditableActiveCell } from "@/lib/components/table/cell/EditableActiveCell";
import { EditableCommonNameCell } from "@/lib/components/table/cell/EditableCommonNameCell";
import { EditableEnumCell } from "@/lib/components/table/cell/EditableEnumCell";
import { EditableOrgUnitCell } from "@/lib/components/table/cell/EditableOrgUnitCell";
import { EditableStringCell } from "@/lib/components/table/cell/EditableStringCell";
import { RulesCell } from "@/lib/components/table/cell/ForeignKeyCell";
import { MetadataCell } from "@/lib/components/table/cell/MetadataCell";
import { PageContent } from "@/lib/components/view/PageContent";
import { useFilterActorBySelector } from "@/lib/helpers/actorSelector";
import { OverridableEntity } from "@/lib/helpers/entities";
import { isValidActor } from "@/lib/helpers/entityValidation";
import { useActorsApi } from "@/lib/hooks/useActorsApi";
import {
  PartialOrgUnitWithId,
  useOrgUnitsQuery,
} from "@/lib/hooks/useOrgUnits";
import { PartialRuleWithId, useAuditedRules } from "@/lib/hooks/useRules";

export type PartialActorWithId = Omit<ApiAdminPartialActor, "id"> & {
  id: string;
};

export type StagedActorWithEntityId = Omit<
  ApiAdminStagedEntityAdminPartialActor,
  "entity"
> & {
  entity?: PartialActorWithId;
};

export type Actor = PartialActorWithId &
  OverridableEntity<Actor> & {
    metadata?: ApiAdminActor["metadata"];
    naturalId?: ApiAdminActor["naturalId"];
    _orgUnit?: PartialOrgUnitWithId;
    _staged: StagedActorWithEntityId[];
    author?: string;
    _matchingClientRules: PartialRuleWithId[];
    _matchingServerRules: PartialRuleWithId[];
    _type: "actor";
    _parent?: Actor;
  };

export const NEW_ACTOR_PARENT_ID = "NEW_ACTOR_PARENT_ID";

const columnHelper = createColumnHelper<Actor>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `actorColumnHeader.${id}`,
    ...c,
    filterFn: getFilterFn(c.filterFn, [NEW_ACTOR_PARENT_ID]),
  });
};

const columns = [
  accessor(
    (row) => (row.author ? `${row.author} (${row.id})` : row.naturalId),
    {
      id: "id",
      enableColumnFilter: true,
      filterFn: filterFns.includesString,
    },
  ),
  accessor("readableName", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    cell: EditableStringCell,
  }),
  accessor("_orgUnit", {
    enableColumnFilter: true,
    filterFn: orgUnitFilterFn,
    cell: EditableOrgUnitCell,
    meta: { linkTo: "org-units" },
  }),
  accessor("type", {
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    cell: EditableEnumCell,
    meta: {
      options: Object.values(ApiAdminActorType),
      multiFilter: true,
    },
  }),
  accessor("commonName", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    cell: EditableCommonNameCell,
  }),
  accessor("networkId", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    cell: EditableStringCell,
    meta: {
      optional: true,
    },
  }),
  accessor("active", {
    enableColumnFilter: true,
    filterFn: filterFns.equals,
    cell: EditableActiveCell,
    meta: {
      options: [false, true],
      stringToValue: (v) => v === "true",
    },
  }),
  accessor("metadata", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    cell: MetadataCell,
  }),
  accessor("currentCertificate", {
    enableColumnFilter: true,
    cell: CertificateCell,
  }),
  accessor("previousCertificate", {
    enableColumnFilter: true,
    cell: CertificateCell,
  }),
  accessor("_matchingClientRules", {
    enableColumnFilter: true,
    filterFn: matchingClientRulesFilterFn,
    cell: RulesCell,
    meta: { linkTo: "rules" },
  }),
  accessor("_matchingServerRules", {
    enableColumnFilter: true,
    filterFn: matchingServerRulesFilterFn,
    cell: RulesCell,
    meta: { linkTo: "rules" },
  }),
];

export function ActorTable() {
  return (
    <PageContent
      title="actorHeader"
      query={useOrgUnitsQuery()}
      renderContent={(data) => <ActorTableContent data={data} />}
    />
  );
}

function ActorTableContent({
  data,
}: Readonly<{ data: ApiGetOrgUnitsResponse }>) {
  const actors = useActorsWithStagedSubRows(data);
  const getSubRows = useGetSubRows();
  const { api } = useActorsApi();

  return (
    actors && (
      <EditableTable
        columns={columns}
        data={actors}
        getSubRows={getSubRows(data)}
        api={api}
        initialColumnVisibility={{
          metadata: false,
          networkId: false,
          _matchingServerRules: false,
          _matchingClientRules: false,
          commonName: false,
          currentCertificate: false,
          previousCertificate: false,
        }}
      />
    )
  );
}

function getStagedActors(
  stagedActors: ApiAdminStagedEntityAdminPartialActor[],
  id: string | undefined,
): StagedActorWithEntityId[] {
  return stagedActors
    .filter((sa) => sa.originalEntityId === id)
    .map((sa) => ({
      ...sa,
      entity: sa.entity ? { ...sa.entity, id: sa.id } : undefined,
    }));
}

function useActorsWithStagedSubRows(
  orgUnits?: ApiGetOrgUnitsResponse,
): Actor[] | undefined {
  const rules = useAuditedRules();
  const filterActorBySelector = useFilterActorBySelector(true);

  return useMemo<Actor[] | undefined>(() => {
    if (!orgUnits) {
      return undefined;
    }

    const mergedActors: Actor[] = orgUnits.orgUnits.flatMap((ou) =>
      ou.actors.map((a) => ({
        ...a,
        _orgUnit: ou,
        _staged: getStagedActors(orgUnits.stagedActors, a.id),
        _matchingClientRules: rules.filter((r) =>
          filterActorBySelector(r.client, { ...a, orgUnitId: ou.id }),
        ),
        _matchingServerRules: rules.filter((r) =>
          filterActorBySelector(r.server, { ...a, orgUnitId: ou.id }),
        ),
        _type: "actor",
      })),
    );

    const stagedActorsWithoutOriginal = getStagedActors(
      orgUnits.stagedActors,
      undefined,
    );
    if (stagedActorsWithoutOriginal.length) {
      mergedActors.push({
        id: NEW_ACTOR_PARENT_ID,
        active: false,
        commonName: "",
        readableName: "",
        type: ApiAdminActorType.Gm,
        _staged: stagedActorsWithoutOriginal,
        _override: NewEntityParentRow,
        _orgUnit: undefined,
        _matchingClientRules: [],
        _matchingServerRules: [],
        _type: "actor",
      });
    }
    return mergedActors;
  }, [filterActorBySelector, orgUnits, rules]);
}

function getOrgUnit(
  orgUnits: ApiGetOrgUnitsResponse | undefined,
  id: string | undefined,
): PartialOrgUnitWithId | undefined {
  if (!id) {
    return undefined;
  }
  const orgUnit = orgUnits?.orgUnits.find((ou) => ou.id === id);
  if (orgUnit) {
    return orgUnit;
  }
  const stagedOrgUnit = orgUnits?.stagedOrgUnits.find((sou) => sou.id === id);
  if (stagedOrgUnit) {
    return {
      ...stagedOrgUnit.entity,
      id: stagedOrgUnit.id,
    };
  }
  // eslint-disable-next-line no-console
  console.error("Could not find OrgUnit", id);
  return undefined;
}

function useGetSubRows() {
  const rules = useAuditedRules();
  const filterActorBySelector = useFilterActorBySelector(true);

  return (orgUnits: ApiGetOrgUnitsResponse | undefined) => {
    return (originalRow: Actor): Actor[] | undefined => {
      return originalRow._staged.map((sa) => {
        if (sa.entity) {
          const ou = getOrgUnit(orgUnits, sa.entity.orgUnitId);
          const isValid = isValidActor(sa.entity);
          const _matchingClientRules = isValid
            ? rules.filter((r) =>
                filterActorBySelector(r.client, {
                  id: sa.id,
                  ...sa.entity,
                  orgUnitId: ou?.id,
                }),
              )
            : [];
          const _matchingServerRules = isValid
            ? rules.filter((r) =>
                filterActorBySelector(r.server, {
                  id: sa.id,
                  ...sa.entity,
                  orgUnitId: ou?.id,
                }),
              )
            : [];
          return {
            ...sa.entity,
            _staged: [],
            _orgUnit: ou,
            metadata: originalRow.metadata,
            author: sa.author,
            _matchingClientRules,
            _matchingServerRules,
            stagedEntityType: sa.stagedEntityType,
            _type: "actor",
            _parent: originalRow,
          };
        } else {
          return {
            id: sa.id,
            active: false,
            commonName: "",
            readableName: "",
            type: ApiAdminActorType.Gm,
            _staged: [],
            author: sa.author,
            _override: DeleteRow,
            _orgUnit: originalRow._orgUnit,
            _matchingClientRules: [],
            _matchingServerRules: [],
            stagedEntityType: ApiAdminStagedEntityType.Del,
            stagingStatus: sa.stagingStatus,
            _type: "actor",
            _parent: originalRow,
          };
        }
      });
    };
  };
}
