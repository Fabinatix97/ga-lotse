/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import "@eshg/employee-portal-api/travelMedicine";
import { ApiCreatedByUserType } from "@eshg/employee-portal-api/travelMedicine";
import { Grid } from "@mui/joy";

import { translateCreatedByUserType } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

interface ProcedureOriginProps {
  initialValues: ProcedureOriginValues;
}

interface ProcedureOriginValues {
  createdByUserType: ApiCreatedByUserType;
}

export function ProcedureCreatedByTile(props: Readonly<ProcedureOriginProps>) {
  return (
    <>
      <DetailsSection
        data-testid="procedure"
        title="Vorgangsdaten"
        canEdit={false}
      >
        <Grid xs={12} pl={0} py={0}>
          <DetailsCell
            name="createdBy"
            label={"Vorgang erstellt von:"}
            value={translateCreatedByUserType(
              props.initialValues.createdByUserType,
            )}
          />
        </Grid>
      </DetailsSection>
    </>
  );
}
