/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEmployeeOmsProcedureDetails,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/officialMedicalService";
import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isDefined } from "remeda";

import { AddFacility } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AddFacility";
import { UpdateFacilitySidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/UpdateFacilitySidebar";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
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

  function procedureClosed() {
    return procedure.status === ApiProcedureStatus.Closed;
  }

  return (
    <Sheet data-testid="facility">
      <DetailsSection
        title={"Auftraggeber"}
        buttons={
          isDefined(procedure.facility) &&
          !procedureClosed() && (
            <EditButton
              aria-label="Auftraggeber bearbeiten"
              onClick={() =>
                updateFacilitySidebar.open({
                  procedureId: procedure.id,
                  facility: procedure.facility!,
                })
              }
            />
          )
        }
      >
        {!isDefined(procedure.facility) ? (
          <AddFacility id={procedure.id} />
        ) : (
          <CentralFileFacilityDetails
            facility={{ ...procedure.facility }}
            columnSx={COLUMN_STYLE}
          ></CentralFileFacilityDetails>
        )}
      </DetailsSection>
    </Sheet>
  );
}
