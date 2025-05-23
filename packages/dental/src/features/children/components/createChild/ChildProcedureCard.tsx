/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNew } from "@mui/icons-material";
import { Chip, Grid, Sheet, Typography } from "@mui/joy";

import { ApiChild } from "@eshg/dental-api";
import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_NAMES,
  formatSchoolYear,
} from "@eshg/lib-employee-portal";
import { InternalLinkIconButton, Row, formatDate } from "@eshg/lib-portal";

import { routes } from "../../../../config/routes";

export function ChildProcedureCard(props: { procedure: ApiChild }) {
  const child = props.procedure;

  return (
    <Sheet sx={{ marginBottom: 2 }}>
      <Row marginBottom={1} justifyContent="space-between">
        <Chip color={PROCEDURE_STATUS_COLORS[child.status]}>
          {PROCEDURE_STATUS_NAMES[child.status]}
        </Chip>
        <InternalLinkIconButton
          color="primary"
          size="sm"
          href={routes.children.byId(child.id).details}
          aria-label="Kinddetails öffnen"
        >
          <OpenInNew />
        </InternalLinkIconButton>
      </Row>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Vorname:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>{child.firstName}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Nachname:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>{child.lastName}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Geburtstag:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>
            {formatDate(child.dateOfBirth)}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Schule:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>{child.institution.name}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Schuljahr:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>
            {formatSchoolYear(child.year)}
          </Typography>
        </Grid>
      </Grid>
    </Sheet>
  );
}
