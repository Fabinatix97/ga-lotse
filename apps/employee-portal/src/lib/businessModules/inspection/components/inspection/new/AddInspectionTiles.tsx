/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";

import { ApiUser } from "@eshg/base-api";
import {
  ApiInspection,
  ApiObjectType,
  ApiObjectTypeHierarchyTreeNode,
} from "@eshg/inspection-api";

import { useEditFacilitySidebar } from "@/lib/businessModules/inspection/components/inspection/EditFacilitySidebar";
import { FacilityTile } from "@/lib/businessModules/inspection/components/inspection/common/facility/FacilityTile";
import { AdditionalInfoTile } from "@/lib/businessModules/inspection/components/inspection/new/AdditionalInfoTile";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export function AddInspectionTiles({
  inspection,
  objectTypes,
  selfUser,
  allAssignableUsers,
}: Readonly<{
  inspection: ApiInspection;
  objectTypes: ApiObjectTypeHierarchyTreeNode[] | ApiObjectType[];
  allAssignableUsers: ApiUser[];
  selfUser: ApiUser;
}>) {
  const editFacilitySidebar = useEditFacilitySidebar();
  const facility = inspection.facility;

  function openEdit() {
    editFacilitySidebar.open({
      inspectionId: inspection.externalId,
    });
  }

  // stack tiles vertically on small screens
  //  to avoid the form buttons of AdditionalInfoTile from overflowing
  return (
    <Grid container spacing={3} direction={{ xs: "column", xl: "row" }}>
      <Grid xl={9}>
        <FacilityTile
          inspection={inspection}
          getSyncRoute={routes.procedures.newSyncFacility}
          onEdit={openEdit}
        />
      </Grid>
      <Grid xl={3} sx={{ flex: 1 }}>
        <AdditionalInfoTile
          procedureId={inspection.externalId}
          objectTypes={objectTypes}
          facility={facility}
          selfUser={selfUser}
          allAssignableUsers={allAssignableUsers}
        />
      </Grid>
    </Grid>
  );
}
