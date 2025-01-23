/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEmployeeOmsProcedureDetails,
  ApiFacilitySync,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/officialMedicalService";
import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { AddFacility } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AddFacility";
import { UpdateFacilitySidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/UpdateFacilitySidebar";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import {
  SyncBarrier,
  useSyncBarrier,
} from "@/lib/shared/components/centralFile/sync/SyncBarrier";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { useSidebarWithFormRef } from "@/lib/shared/hooks/useSidebarWithFormRef";

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
    <Sheet data-testid="facility">
      <DetailsSection
        title={"Auftraggeber"}
        buttons={
          isDefined(procedure.facility) &&
          !procedureClosed() && (
            <SyncBarrier
              outdated={procedure.facility?.facilitySync?.outdated ?? false}
              syncHref={syncRoute}
            >
              <EditButton
                aria-label="Auftraggeber bearbeiten"
                onClick={syncBarrier(() =>
                  updateFacilitySidebar.open({
                    procedureId: procedure.id,
                    facility: procedure.facility!,
                  }),
                )}
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
            columnSx={COLUMN_STYLE}
          ></CentralFileFacilityDetails>
        )}
      </DetailsSection>
    </Sheet>
  );
}
