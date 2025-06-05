/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";

import { DetailsItem, DetailsSection } from "@eshg/lib-employee-portal";
import { ApiCreatedByUserType } from "@eshg/travel-medicine-api";

import { translateCreatedByUserType } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";

interface ProcedureOriginProps {
  initialValues: ProcedureOriginValues;
}

interface ProcedureOriginValues {
  createdByUserType: ApiCreatedByUserType;
}

export function ProcedureCreatedByTile(props: Readonly<ProcedureOriginProps>) {
  return (
    <DetailsSection
      data-testid="procedure"
      title="Vorgangsdaten"
      canEdit={false}
    >
      <Grid xs={12} pl={0} py={0}>
        <DetailsItem
          label="Vorgang erstellt von:"
          value={translateCreatedByUserType(
            props.initialValues.createdByUserType,
          )}
        />
      </Grid>
    </DetailsSection>
  );
}
