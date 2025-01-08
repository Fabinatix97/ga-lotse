/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiChildDetails } from "@eshg/employee-portal-api/dental";
import { Row } from "@eshg/lib-portal/components/Row";
import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Chip, Grid, Sheet, Typography } from "@mui/joy";

import { routes } from "@/lib/businessModules/dental/shared/routes";
import {
  procedureStatusNames,
  statusColors,
} from "@/lib/shared/components/procedures/constants";
import { formatSchoolYear } from "@/lib/shared/helpers/formatters";

export function ChildProcedureCard(props: { procedure: ApiChildDetails }) {
  const child = props.procedure;

  return (
    <Sheet sx={{ marginBottom: 2 }}>
      <Row marginBottom={1} justifyContent="space-between">
        <Chip color={statusColors[child.status]}>
          {procedureStatusNames[child.status]}
        </Chip>
        <InternalLinkIconButton
          color="primary"
          size="sm"
          href={routes.children.byId(child.id).details}
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
