/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { ApiInspectionPhase } from "@eshg/inspection-api";
import { useIsOffline } from "@eshg/lib-employee-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { useUpdateInspectionFacility } from "@/lib/businessModules/inspection/api/mutations/facility";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { useEditFacilitySidebar } from "@/lib/businessModules/inspection/components/inspection/EditFacilitySidebar";
import { InspectionTypeCard } from "@/lib/businessModules/inspection/components/inspection/basedata/InspectionTypeCard";
import { BillingAddressTile } from "@/lib/businessModules/inspection/components/inspection/basedata/billingaddress/BillingAddressTile";
import { ContactPersonTile } from "@/lib/businessModules/inspection/components/inspection/basedata/contactperson/ContactPersonTile";
import { FacilityTile } from "@/lib/businessModules/inspection/components/inspection/common/facility/FacilityTile";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";

interface InspectionTabBasedataProps {
  inspectionId: string;
}

export function InspectionTabBasedata({
  inspectionId,
}: Readonly<InspectionTabBasedataProps>) {
  const inspectionApi = useInspectionApi();
  const userApi = useUserApi();

  const [{ data: inspection }, { data: selfUser }] = useSuspenseQueries({
    queries: [
      getInspectionQuery(inspectionApi, inspectionId),
      getSelfUserQuery(userApi),
    ],
  });

  const { mutateAsync: updateFacility } = useUpdateInspectionFacility();
  const editFacilitySidebar = useEditFacilitySidebar();
  const isOffline = useIsOffline();
  const lockedByDifferentUser =
    inspection.lockedByUser !== undefined &&
    selfUser.userId !== inspection.lockedByUser.userId;

  const readonly =
    isOffline ||
    lockedByDifferentUser ||
    !inspectionIsBeforePhase(inspection.phase, ApiInspectionPhase.Executed);

  async function saveFacility(facility: DefaultFacilityFormValues) {
    await updateFacility({
      procedureId: inspectionId,
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

  return (
    <Grid
      container
      spacing={3}
      direction={{ xxs: "column-reverse", lg: "row" }}
    >
      <Grid lg={9}>
        <FacilityTile
          inspection={inspection}
          readonly={readonly}
          onEdit={openEdit}
        />
        <Grid container spacing={2} columns={{ xxs: 1, lg: 2 }} mt={1}>
          {(!readonly ||
            inspection.facility.baseFacility.differentBillingAddress) && (
            <Grid xxs={1} display="flex">
              <BillingAddressTile
                readonly={readonly}
                billingAddress={
                  inspection.facility.baseFacility.differentBillingAddress
                }
                onEdit={openEdit}
              />
            </Grid>
          )}
          {inspection.facility.baseFacility.contactPersons?.map(
            (contactPerson, idx) => (
              <Grid key={`contactPerson-${idx}`} xxs={1} display="flex">
                <ContactPersonTile
                  contactPerson={contactPerson}
                  readonly={readonly}
                  index={idx}
                  onEdit={openEdit}
                />
              </Grid>
            ),
          )}
          {!readonly && (
            <Grid xxs={1} display="flex">
              <ContactPersonTile onEdit={openEdit} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid lg={3}>
        <InspectionTypeCard inspection={inspection} readonly={readonly} />
      </Grid>
    </Grid>
  );
}
