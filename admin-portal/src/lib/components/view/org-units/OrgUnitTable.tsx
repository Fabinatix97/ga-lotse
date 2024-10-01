/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAdminOrgUnitType,
  ApiAdminStagedEntityAdminPartialOrgUnit,
  ApiAdminStagedEntityType,
  ApiFederalState,
  ApiGetOrgUnitsResponse,
  ApiOrgUnitType,
} from "@eshg/admin-portal-api/serviceDirectory";
import { createColumnHelper, filterFns } from "@tanstack/react-table";
import { useMemo } from "react";

import { DeleteRow } from "@/lib/components/table/DeleteRow";
import { EditableTable } from "@/lib/components/table/EditableTable";
import { actorsFilterFn, getFilterFn } from "@/lib/components/table/Filter";
import { NewEntityParentRow } from "@/lib/components/table/NewEntityParentRow";
import { EditableActiveCell } from "@/lib/components/table/cell/EditableActiveCell";
import { EditableEnumCell } from "@/lib/components/table/cell/EditableEnumCell";
import { EditableStringCell } from "@/lib/components/table/cell/EditableStringCell";
import { ActorsCell } from "@/lib/components/table/cell/ForeignKeyCell";
import { PageContent } from "@/lib/components/view/PageContent";
import { PartialActorWithId } from "@/lib/components/view/actors/ActorTable";
import {
  OrgUnit,
  StagedOrgUnitWithEntityId,
  useOrgUnitsQuery,
} from "@/lib/hooks/useOrgUnits";
import { useOrgUnitsApi } from "@/lib/hooks/useOrgUnitsApi";

export const NEW_ORG_UNIT_PARENT_ID = "NEW_ORG_UNIT_PARENT_ID";

const columnHelper = createColumnHelper<OrgUnit>();
// eslint-disable-next-line func-style
const accessor: (typeof columnHelper)["accessor"] = (a, c) => {
  const id = c.id ?? String(a);
  return columnHelper.accessor(a, {
    id,
    header: `orgUnitColumnHeader.${id}`,
    ...c,
    filterFn: getFilterFn(c.filterFn, [NEW_ORG_UNIT_PARENT_ID]),
  });
};

const columns = [
  accessor(
    (row) =>
      row.author
        ? `${row.author} (${row.id})`
        : `${row.federalState}/${row.type}/${row.readableName}`,
    {
      id: "id",
      enableColumnFilter: true,
      filterFn: filterFns.includesString,
    },
  ),
  accessor("federalState", {
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    cell: EditableEnumCell,
    meta: {
      options: Object.values(ApiFederalState),
      multiFilter: true,
    },
  }),
  accessor("type", {
    enableColumnFilter: true,
    filterFn: filterFns.arrIncludesSome,
    cell: EditableEnumCell,
    meta: {
      options: Object.values(ApiAdminOrgUnitType),
      multiFilter: true,
    },
  }),
  accessor("readableName", {
    enableColumnFilter: true,
    filterFn: filterFns.includesString,
    cell: EditableStringCell,
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
  accessor("actors", {
    enableColumnFilter: true,
    filterFn: actorsFilterFn,
    cell: ActorsCell,
  }),
];

export function OrgUnitTable() {
  return (
    <PageContent
      title="orgUnitHeader"
      query={useOrgUnitsQuery()}
      renderContent={(data) => <OrgUnitTableContent data={data} />}
    />
  );
}

function OrgUnitTableContent({
  data,
}: Readonly<{
  data: ApiGetOrgUnitsResponse;
}>) {
  const orgUnits = useOrgUnitsWithStagedSubRows(data);
  const { api } = useOrgUnitsApi();

  return (
    orgUnits && (
      <EditableTable
        columns={columns}
        data={orgUnits}
        getSubRows={getSubRows(data)}
        api={api}
      />
    )
  );
}

function getStagedOrgUnits(
  stagedOrgUnits: ApiAdminStagedEntityAdminPartialOrgUnit[],
  id: string | undefined,
): StagedOrgUnitWithEntityId[] {
  return stagedOrgUnits
    .filter((sou) => sou.originalEntityId === id)
    .map((sou) => ({
      ...sou,
      entity: sou.entity ? { ...sou.entity, id: sou.id } : undefined,
    }));
}

function useOrgUnitsWithStagedSubRows(orgUnits?: ApiGetOrgUnitsResponse) {
  return useMemo<OrgUnit[] | undefined>(() => {
    if (!orgUnits) {
      return undefined;
    }
    const mergedOrgUnits: OrgUnit[] = orgUnits.orgUnits.map((ou) => ({
      ...ou,
      _staged: getStagedOrgUnits(orgUnits.stagedOrgUnits, ou.id),
      _type: "orgUnit",
    }));
    const stagedOrgUnitsWithoutOriginal = getStagedOrgUnits(
      orgUnits.stagedOrgUnits,
      undefined,
    );
    if (stagedOrgUnitsWithoutOriginal.length) {
      mergedOrgUnits.push({
        id: NEW_ORG_UNIT_PARENT_ID,
        active: false,
        actors: [],
        readableName: "",
        type: ApiOrgUnitType.Ga,
        _staged: stagedOrgUnitsWithoutOriginal,
        _override: NewEntityParentRow,
        _type: "orgUnit",
      });
    }
    return mergedOrgUnits;
  }, [orgUnits]);
}

function getActors(
  orgUnits: ApiGetOrgUnitsResponse | undefined,
  originalRow: OrgUnit,
  id: string,
): PartialActorWithId[] {
  if (originalRow.id !== NEW_ORG_UNIT_PARENT_ID) {
    return originalRow.actors;
  }
  return orgUnits?.stagedActors.filter((a) => a.entity?.orgUnitId === id) ?? [];
}

function getSubRows(orgUnits: ApiGetOrgUnitsResponse | undefined) {
  return (originalRow: OrgUnit): OrgUnit[] | undefined => {
    return originalRow._staged.map((sou) =>
      sou.entity
        ? {
            ...sou.entity,
            id: sou.id,
            actors: getActors(orgUnits, originalRow, sou.id),
            _staged: [],
            author: sou.author,
            stagedEntityType: sou.stagedEntityType,
            _type: "orgUnit",
            _parent: originalRow,
          }
        : {
            id: sou.id,
            active: false,
            actors: [],
            readableName: "",
            type: ApiOrgUnitType.Ga,
            _staged: [],
            author: sou.author,
            _override: DeleteRow,
            stagedEntityType: ApiAdminStagedEntityType.Del,
            stagingStatus: sou.stagingStatus,
            _type: "orgUnit",
            _parent: originalRow,
          },
    );
  };
}
