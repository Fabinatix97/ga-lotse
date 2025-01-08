/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiEmployeeOmsProcedureDetails } from "@eshg/employee-portal-api/officialMedicalService";
import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { UpdateAffectedPersonSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/UpdateAffectedPersonSidebar";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { useToggle } from "@/lib/shared/hooks/useToggle";

const COLUMN_STYLE: SxProps = {
  flexGrow: 1,
  maxWidth: (theme) => ({ md: `calc(100%/3 - 2 * ${theme.spacing(2)})` }),
};

export function AffectedPersonPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const [editing, toggleEditing] = useToggle(false);
  const title = "Betroffene Person";
  const person = procedure.affectedPerson;

  return (
    person && (
      <>
        <Sheet data-testid="affected-person">
          <DetailsSection
            title={title}
            buttons={
              <EditButton
                aria-label="Person bearbeiten"
                onClick={toggleEditing}
              />
            }
          >
            <CentralFilePersonDetails person={person} columnSx={COLUMN_STYLE} />
          </DetailsSection>
          <UpdateAffectedPersonSidebar
            affectedPerson={person}
            onClose={toggleEditing}
            open={editing}
            procedureId={procedure.id}
          />
        </Sheet>
      </>
    )
  );
}
