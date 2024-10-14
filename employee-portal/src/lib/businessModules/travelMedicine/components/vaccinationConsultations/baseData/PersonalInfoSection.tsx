/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPatient } from "@eshg/employee-portal-api/travelMedicine";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Grid } from "@mui/joy";

import { calculateAge } from "@/lib/businessModules/travelMedicine/shared/helper";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
} from "@/lib/shared/components/personSidebar/constants";

export function PersonalInfoSection({
  patient,
}: Readonly<{ patient: ApiPatient }>) {
  return (
    <Grid xs={4}>
      <Grid container columns={4} spacing={2} pl={0} py={0}>
        <Grid xs={12}>
          <DetailsCell
            name="salutation"
            label="Anrede"
            value={patient.salutation && SALUTATION_VALUES[patient.salutation]}
          />
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="firstName"
            label="Vorname"
            value={patient.firstName}
          />
        </Grid>
        <Grid xs={12}>
          <DetailsCell
            name="lastName"
            label="Nachname"
            value={patient.lastName}
          />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={3}>
            <Grid xs={9}>
              <DetailsCell
                name="dateOfBirth"
                label="Geburtsdatum"
                value={formatDate(patient.dateOfBirth)}
              />
            </Grid>
            <Grid xs={1}>
              <DetailsCell
                name="currentAge"
                label="Alter"
                value={calculateAge(patient.dateOfBirth)}
              />
            </Grid>
            <Grid xs={2}>
              <DetailsCell
                name="gender"
                label="Geschlecht"
                value={patient.gender && GENDER_VALUES[patient.gender]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
