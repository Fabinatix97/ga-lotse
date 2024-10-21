/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/employee-portal-api/inspection";
import { Grid } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { useUpdateInspectionFacility } from "@/lib/businessModules/inspection/api/mutations/facility";
import { getInspectionQuery } from "@/lib/businessModules/inspection/api/queries/inspection";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { InspectionTypeCard } from "@/lib/businessModules/inspection/components/inspection/basedata/InspectionTypeCard";
import { BillingAddressTile } from "@/lib/businessModules/inspection/components/inspection/basedata/billingaddress/BillingAddressTile";
import { ContactPersonTile } from "@/lib/businessModules/inspection/components/inspection/basedata/contactperson/ContactPersonTile";
import { FacilityTile } from "@/lib/businessModules/inspection/components/inspection/common/facility/FacilityTile";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";
import {
  LegacyFacilitySidebar,
  Mode,
} from "@/lib/shared/components/facilitySidebar/LegacyFacilitySidebar";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import { mapApiFacilityStateToBaseFacility } from "@/lib/shared/helpers/facilityUtils";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

interface InspectionTabBasedataProps {
  inspectionId: string;
}

export function InspectionTabBasedata({
  inspectionId,
}: Readonly<InspectionTabBasedataProps>) {
  const inspectionApi = useInspectionApi();
  const userApi = useUserApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();

  const [{ data: inspection }, { data: selfUser }] = useSuspenseQueries({
    queries: [
      getInspectionQuery(
        inspectionApi,
        getPreCacheForOfflineModeHeaders,
        inspectionId,
      ),
      getSelfUserQuery(userApi),
    ],
  });

  const { mutateAsync: updateFacility } = useUpdateInspectionFacility();

  const isOffline = useIsOffline();
  const lockedByDifferentUser =
    inspection.lockedByUser !== undefined &&
    selfUser.userId !== inspection.lockedByUser.userId;

  const readonly =
    isOffline ||
    lockedByDifferentUser ||
    !inspectionIsBeforePhase(inspection.phase, ApiInspectionPhase.Executed);

  async function saveFacility(baseFacility: BaseFacility) {
    return await updateFacility({
      procedureId: inspectionId,
      inspectionFacilityId: inspection.facility.id,
      baseFacility,
    });
  }

  const [open, setOpen] = useState(false);

  const sideBarAddress = mapApiFacilityStateToBaseFacility(
    inspection.facility.baseFacility,
  );

  return (
    <>
      <Grid
        container
        spacing={3}
        direction={{ xxs: "column-reverse", lg: "row" }}
      >
        <Grid lg={9}>
          <FacilityTile
            facility={inspection.facility}
            setOpen={setOpen}
            readonly={readonly}
          />
          <Grid container spacing={2} columns={{ xxs: 1, lg: 2 }} mt={1}>
            {(!readonly ||
              inspection.facility.baseFacility.differentBillingAddress) && (
              <Grid xxs={1} display="flex">
                <BillingAddressTile
                  setOpen={setOpen}
                  readonly={readonly}
                  billingAddress={
                    inspection.facility.baseFacility.differentBillingAddress
                  }
                />
              </Grid>
            )}
            {inspection.facility.baseFacility.contactPersons?.map(
              (contactPerson, idx) => (
                <Grid key={`contactPerson-${idx}`} xxs={1} display="flex">
                  <ContactPersonTile
                    contactPerson={contactPerson}
                    readonly={readonly}
                    setOpen={setOpen}
                    index={idx}
                  />
                </Grid>
              ),
            )}
            {!readonly && (
              <Grid xxs={1} display="flex">
                <ContactPersonTile setOpen={setOpen} />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid lg={3}>
          <InspectionTypeCard inspection={inspection} readonly={readonly} />
        </Grid>
      </Grid>

      {open && (
        <LegacyFacilitySidebar
          facility={sideBarAddress}
          open={true}
          onClose={() => setOpen(false)}
          mode={Mode.edit}
          titleEdit="Einrichtung bearbeiten"
          onSubmit={saveFacility}
        />
      )}
    </>
  );
}
