/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUser } from "@eshg/employee-portal-api/base";
import {
  ApiInspection,
  ApiObjectType,
} from "@eshg/employee-portal-api/inspection";
import { Grid } from "@mui/joy";

import { useUpdateInspectionFacility } from "@/lib/businessModules/inspection/api/mutations/facility";
import { useEditFacilitySidebar } from "@/lib/businessModules/inspection/components/inspection/EditFacilitySidebar";
import { FacilityTile } from "@/lib/businessModules/inspection/components/inspection/common/facility/FacilityTile";
import { AdditionalInfoTile } from "@/lib/businessModules/inspection/components/inspection/new/AdditionalInfoTile";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

export function AddInspectionTiles({
  inspection,
  objectTypes,
  selfUser,
  allAssignableUsers,
}: Readonly<{
  inspection: ApiInspection;
  objectTypes: ApiObjectType[];
  allAssignableUsers: ApiUser[];
  selfUser: ApiUser;
}>) {
  const { mutateAsync: updateFacility } = useUpdateInspectionFacility();
  const editFacilitySidebar = useEditFacilitySidebar();
  const facility = inspection.facility;

  async function saveFacility(facility: DefaultFacilityFormValues) {
    await updateFacility({
      procedureId: inspection.externalId,
      inspectionFacilityId: inspection.facility.id,
      facility,
    });
  }

  function openEdit() {
    editFacilitySidebar.open({
      facility: inspection.facility.baseFacility,
      onSave: saveFacility,
    });
  }

  // stack tiles vertically on small screens
  //  to avoid the form buttons of AdditionalInfoTile from overflowing
  return (
    <Grid container spacing={3} direction={{ xs: "column", xl: "row" }}>
      <Grid xl={9}>
        <FacilityTile facility={facility} onEdit={openEdit} />
      </Grid>
      <Grid xl={3} style={{ flex: 1 }}>
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
