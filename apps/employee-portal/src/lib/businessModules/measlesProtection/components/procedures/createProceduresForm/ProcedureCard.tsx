/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Chip, Grid, Sheet, Typography } from "@mui/joy";

import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_NAMES,
} from "@eshg/lib-employee-portal";
import { InternalLinkIconButton, Row, formatDate } from "@eshg/lib-portal";
import {
  ApiProcedureForPerson,
  ApiProcedureStatus,
} from "@eshg/measles-protection-api";

import { reportingReasonNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

export function ProcedureCard(props: { procedure: unknown }) {
  const procedure = props.procedure as ApiProcedureForPerson;

  return (
    <Sheet sx={{ marginBottom: 2 }}>
      <Row marginBottom={1} justifyContent="space-between">
        <Chip color={PROCEDURE_STATUS_COLORS[procedure.procedureStatus]}>
          {PROCEDURE_STATUS_NAMES[procedure.procedureStatus]}
        </Chip>
        <InternalLinkIconButton
          color="primary"
          size="sm"
          href={
            procedure.procedureStatus === ApiProcedureStatus.Draft
              ? routes.procedures.draft(procedure.externalId).index
              : routes.procedures.details(procedure.externalId).index
          }
          aria-label="Vorgang öffnen"
        >
          <OpenInNewIcon />
        </InternalLinkIconButton>
      </Row>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Meldedatum:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>
            {formatDate(procedure.reportingDate)}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography>Meldegrund:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography fontWeight={700}>
            {procedure.reportingReason
              ? reportingReasonNames[procedure.reportingReason]
              : "–"}
          </Typography>
        </Grid>
      </Grid>
    </Sheet>
  );
}
