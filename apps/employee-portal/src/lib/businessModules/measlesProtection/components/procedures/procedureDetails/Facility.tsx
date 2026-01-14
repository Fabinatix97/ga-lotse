/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SxProps } from "@mui/joy/styles/types";

import {
  DetailsItem,
  EditButton,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import { isNonEmptyString } from "@eshg/lib-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiFacilitySync,
  ApiMeaslesProtectionProcedure,
  ApiProcedureStatus,
} from "@eshg/measles-protection-api";

import { facilityTypeNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { useUpdateFacilitySidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/UpdateFacilitySidebar";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

import { FacilityContacts } from "./FacilityContact";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function Facility({
  procedure,
}: {
  procedure: ApiMeaslesProtectionProcedure | ApiDraftMeaslesProcedure;
}) {
  const facility = procedure.facility!;
  const updateFacilitySidebar = useUpdateFacilitySidebar();
  const syncRoute =
    procedure.procedureStatus === ApiProcedureStatus.Draft
      ? routes.procedures
          .draft(procedure.id)
          .syncFacility(
            facility.facilitySync?.fileStateId ?? "",
            facility.facilitySync?.version ?? 0,
          )
      : routes.procedures
          .details(procedure.id)
          .syncFacility(
            facility.facilitySync?.fileStateId ?? "",
            facility.facilitySync?.version ?? 0,
          );
  const facilitySync: ApiFacilitySync = {
    fileStateId: procedure.facility?.facilitySync?.fileStateId ?? "",
    version: procedure.facility?.facilitySync?.version ?? 0,
    outdated: procedure.facility?.facilitySync?.outdated ?? false,
  };
  const { syncBarrier } = useSyncBarrier(syncRoute, facilitySync);

  function openUpdateFacilitySidebar() {
    updateFacilitySidebar.open({
      procedureId: procedure.id,
      facility: facility,
    });
  }

  if (!procedure?.facility) {
    return null;
  }

  function procedureOpen() {
    return (
      procedure.procedureStatus === ApiProcedureStatus.Draft ||
      procedure.procedureStatus === ApiProcedureStatus.Open ||
      procedure.procedureStatus === ApiProcedureStatus.InProgress
    );
  }

  return (
    facility && (
      <>
        <InfoTile
          title="Einrichtung"
          name="facility"
          controls={
            procedureOpen() && (
              <SyncBarrier
                outdated={procedure.facility?.facilitySync?.outdated ?? false}
                syncHref={syncRoute}
              >
                <EditButton
                  aria-label="Einrichtung bearbeiten"
                  onClick={syncBarrier(openUpdateFacilitySidebar)}
                />
              </SyncBarrier>
            )
          }
        >
          <CentralFileFacilityDetails
            facility={{
              ...facility,
              // TODO: The API type here is wrong, these should both be lists
              emailAddresses: isNonEmptyString(facility.emailAddress)
                ? [facility.emailAddress]
                : [],
              phoneNumbers: isNonEmptyString(facility.phoneNumber)
                ? [facility.phoneNumber]
                : [],
            }}
            columnSx={COLUMN_STYLE}
          >
            <DetailsItem
              label="Einrichtungsart"
              value={facilityTypeNames[facility.type]}
            />
            <DetailsItem
              label="Anderer Einrichtungstyp"
              value={facility.otherFacilityTypeInformation}
            />
          </CentralFileFacilityDetails>
        </InfoTile>
        <FacilityContacts persons={facility.contactPersons} />
      </>
    )
  );
}
