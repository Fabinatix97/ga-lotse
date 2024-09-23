/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInspection,
  ApiObjectType,
} from "@eshg/employee-portal-api/inspection";
import { Grid } from "@mui/joy";
import { useState } from "react";

import { useUpdateInspectionFacility } from "@/lib/businessModules/inspection/api/mutations/facility";
import { FacilityTile } from "@/lib/businessModules/inspection/components/inspection/common/facility/FacilityTile";
import { AdditionalInfoTile } from "@/lib/businessModules/inspection/components/inspection/new/AdditionalInfoTile";
import {
  LegacyFacilitySidebar,
  Mode,
} from "@/lib/shared/components/facilitySidebar/LegacyFacilitySidebar";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { mapApiFacilityStateToBaseFacility } from "@/lib/shared/helpers/facilityUtils";

export function AddInspectionTiles({
  inspection,
  objectTypes,
}: Readonly<{
  inspection: ApiInspection;
  objectTypes: ApiObjectType[];
}>) {
  const { mutateAsync: updateFacility } = useUpdateInspectionFacility();
  const facility = inspection.facility;

  async function saveFacility(baseFacility: BaseFacility) {
    return await updateFacility({
      procedureId: inspection.externalId,
      inspectionFacilityId: inspection.facility.id,
      baseFacility,
    });
  }

  const [open, setOpen] = useState(false);

  const sideBarAddress = mapApiFacilityStateToBaseFacility(
    facility.baseFacility,
  );

  // stack tiles vertically on small screens
  //  to avoid the form buttons of AdditionalInfoTile from overflowing
  return (
    <>
      <Grid container spacing={3} direction={{ xs: "column", xl: "row" }}>
        <Grid xl={9}>
          <FacilityTile facility={facility} setOpen={setOpen} />
        </Grid>
        <Grid xl={3} style={{ flex: 1 }}>
          <AdditionalInfoTile
            procedureId={inspection.externalId}
            objectTypes={objectTypes}
            facility={facility}
          />
        </Grid>
      </Grid>
      <LegacyFacilitySidebar
        facility={sideBarAddress}
        open={open}
        onClose={() => setOpen(false)}
        mode={Mode.edit}
        titleEdit="Einrichtung bearbeiten"
        onSubmit={saveFacility}
      />
    </>
  );
}
