/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EditButton,
  SyncBarrier,
  useSidebarWithFormRef,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import {
  ApiEmployeeOmsProcedureDetails,
  ApiFacilitySync,
  ApiProcedureStatus,
} from "@eshg/official-medical-service-api";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { AddFacility } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AddFacility";
import { UpdateFacilitySidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/UpdateFacilitySidebar";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function FacilityPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const updateFacilitySidebar = useSidebarWithFormRef({
    component: UpdateFacilitySidebar,
  });

  function openUpdateFacilitySidebar() {
    updateFacilitySidebar.open({
      procedureId: procedure.id,
      facility: procedure.facility!,
    });
  }

  const syncRoute =
    procedure.facility?.facilitySync !== undefined
      ? routes.procedures
          .byId(procedure.id)
          .syncFacility(
            procedure.facility.facilitySync.fileStateId,
            procedure.facility.facilitySync.version,
          )
      : "";
  const facilitySync: ApiFacilitySync = {
    fileStateId: procedure.facility?.facilitySync?.fileStateId ?? "",
    version: procedure.facility?.facilitySync?.version ?? 0,
    outdated: procedure.facility?.facilitySync?.outdated ?? false,
  };
  const { syncBarrier } = useSyncBarrier(syncRoute, facilitySync);

  function procedureClosed() {
    return procedure.status === ApiProcedureStatus.Closed;
  }

  function procedureDraft() {
    return procedure.status === ApiProcedureStatus.Draft;
  }

  return (
    <InfoTile
      data-testid="facility"
      name="facility"
      title="Auftraggeber"
      controls={
        isDefined(procedure.facility) &&
        !procedureClosed() && (
          <SyncBarrier
            outdated={procedure.facility?.facilitySync?.outdated ?? false}
            syncHref={syncRoute}
          >
            <EditButton
              aria-label="Auftraggeber bearbeiten"
              onClick={syncBarrier(openUpdateFacilitySidebar)}
            />
          </SyncBarrier>
        )
      }
    >
      {procedureDraft() && !isDefined(procedure.facility) ? (
        <AddFacility id={procedure.id} />
      ) : (
        <CentralFileFacilityDetails
          facility={{ ...procedure.facility! }}
          showContactPersonChip={true}
          columnSx={COLUMN_STYLE}
        />
      )}
    </InfoTile>
  );
}
