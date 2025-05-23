/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Chip, Grid, Sheet, Typography } from "@mui/joy";

import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_NAMES,
  formatSchoolYear,
} from "@eshg/lib-employee-portal";
import { InternalLinkIconButton, Row, formatDate } from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/school-entry-api";

import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

export function ProcedureCard(props: { procedure: ApiProcedureDetails }) {
  const procedure = props.procedure;

  return (
    <Sheet sx={{ marginBottom: 2 }}>
      <Row marginBottom={1} justifyContent="space-between">
        <Chip color={PROCEDURE_STATUS_COLORS[procedure.status]}>
          {PROCEDURE_STATUS_NAMES[procedure.status]}
        </Chip>
        <InternalLinkIconButton
          color="primary"
          size="sm"
          href={routes.procedures.byId(procedure.id).details}
          aria-label="Kinddetails öffnen"
        >
          <OpenInNewIcon />
        </InternalLinkIconButton>
      </Row>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Vorname:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>{procedure.child.firstName}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Nachname:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>{procedure.child.lastName}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Geburtstag:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>
            {formatDate(procedure.child.dateOfBirth)}
          </Typography>
        </Grid>
      </Grid>
      {procedure.school && (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid xs={5}>
            <Typography>Schule:</Typography>
          </Grid>
          <Grid xs={5}>
            <Typography fontWeight={700}>{procedure.school.name}</Typography>
          </Grid>
        </Grid>
      )}
      {procedure.schoolYear && (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid xs={5}>
            <Typography>Schuljahr:</Typography>
          </Grid>
          <Grid xs={5}>
            <Typography fontWeight={700}>
              {formatSchoolYear(procedure.schoolYear)}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Sheet>
  );
}
