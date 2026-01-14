/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@tanstack/react-table";

import {
  ApiAdminActorType,
  ApiAdminOrgUnitType,
  ApiAdminStagedEntityType,
  ApiFederalState,
} from "@eshg/service-directory-api";

import { SidebarDetails } from "@/lib/components/sidebar/SidebarDetails";
import { ActiveCell } from "@/lib/components/sidebar/cell/ActiveCell";
import { ActorSelectorCell } from "@/lib/components/sidebar/cell/ActorSelectorCell";
import { ActorsCell } from "@/lib/components/sidebar/cell/ActorsCell";
import { BooleanCell } from "@/lib/components/sidebar/cell/BooleanCell";
import { CertificateCell } from "@/lib/components/sidebar/cell/CertificateCell";
import { CommonNameCell } from "@/lib/components/sidebar/cell/CommonNameCell";
import { EnumCell } from "@/lib/components/sidebar/cell/EnumCell";
import { MetadataCell } from "@/lib/components/sidebar/cell/MetadataCell";
import { OrgUnitCell } from "@/lib/components/sidebar/cell/OrgUnitCell";
import { RulesCell } from "@/lib/components/sidebar/cell/RulesCell";
import { StringCell } from "@/lib/components/sidebar/cell/StringCell";
import { getAdminName } from "@/lib/helpers/adminName";
import {
  Actor,
  EntityWrapper,
  OrgUnit,
  Rule,
  isStagedEntity,
} from "@/lib/hooks/useEntities";

export function OrgUnitSidebarContent({
  row,
}: Readonly<{
  row?: Row<OrgUnit>;
}>) {
  const entity = getEntity(row);
  return (
    <SidebarDetails
      entity={entity}
      headerCells={[
        {
          id: "readableName",
          cell: StringCell,
        },
      ]}
      cells={[
        { id: "active", cell: ActiveCell },
        {
          id: "type",
          cell: EnumCell,
          options: Object.values(ApiAdminOrgUnitType),
        },
        {
          id: "federalState",
          cell: EnumCell,
          options: Object.values(ApiFederalState),
        },
        { id: "_actors", cell: ActorsCell },
      ]}
      naturalId
    />
  );
}

export function ActorSidebarContent({
  row,
}: Readonly<{
  row?: Row<Actor>;
}>) {
  const entity = getEntity(row);
  return (
    <SidebarDetails
      entity={entity}
      headerCells={[
        { id: "readableName", cell: StringCell },
        { id: "_orgUnit", cell: OrgUnitCell },
      ]}
      cells={[
        { id: "active", cell: ActiveCell },
        {
          id: "type",
          cell: EnumCell,
          options: Object.values(ApiAdminActorType),
        },
        { id: "commonName", cell: CommonNameCell },
        { id: "networkId", cell: StringCell, optional: true },
        { id: "metadata", cell: MetadataCell },
        { id: "manualCertificate", cell: BooleanCell },
        { id: "certificate", cell: CertificateCell },
        { id: "_matchingClientRules", cell: RulesCell },
        { id: "_matchingServerRules", cell: RulesCell },
      ]}
      naturalId
    />
  );
}

export function RuleSidebarContent({
  row,
}: Readonly<{
  row?: Row<Rule>;
}>) {
  const entity = getEntity(row);
  return (
    <SidebarDetails
      entity={entity}
      headerCells={[{ id: "description", cell: StringCell, optional: true }]}
      cells={[
        { id: "active", cell: ActiveCell },
        { id: "client", cell: ActorSelectorCell },
        { id: "server", cell: ActorSelectorCell },
      ]}
    />
  );
}

function getEntity<TData extends EntityWrapper>(
  row?: Row<TData>,
): TData | undefined {
  if (!row) return undefined;
  const editRow = row.subRows.find(
    (r) =>
      isStagedEntity(r.original) &&
      r.original.author === getAdminName() &&
      r.original.stagedEntityType !== ApiAdminStagedEntityType.Del,
  );
  return (editRow ?? row).original;
}
