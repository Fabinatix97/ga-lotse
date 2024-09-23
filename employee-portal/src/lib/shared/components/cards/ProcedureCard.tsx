/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Chip, Grid, Sheet, Typography } from "@mui/joy";
import { useId } from "react";

import { Row } from "@/lib/shared/Row";
import { ProcedureLiteItem } from "@/lib/shared/components/legacyPersonSidebar/LegacyPersonSidebar";
import {
  procedureStatusNames,
  statusColors,
} from "@/lib/shared/components/procedures/constants";

export function ProcedureCard({ procedure }: { procedure: ProcedureLiteItem }) {
  const reportingDateLabelId = useId();
  const reportingReasonLabelId = useId();

  return (
    <Sheet sx={{ marginBottom: 2 }}>
      <Row marginBottom={1} justifyContent="space-between">
        <Chip color={statusColors[procedure.status]}>
          {procedureStatusNames[procedure.status]}
        </Chip>
        <InternalLinkIconButton
          target={"_blank"}
          variant="plain"
          color="primary"
          size="sm"
          href={procedure.link}
          aria-label="Fall öffnen"
          title="Fall öffnen"
        >
          <OpenInNewIcon />
        </InternalLinkIconButton>
      </Row>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography id={reportingDateLabelId}>Meldedatum:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography
            fontWeight={700}
            aria-labelledby={reportingDateLabelId}
            textOverflow="ellipsis"
            overflow="hidden"
            title="Meldedatum"
          >
            {formatDate(procedure.reportingDate)}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={5}>
          <Typography id={reportingReasonLabelId}>Meldegrund:</Typography>
        </Grid>
        <Grid xs={5}>
          <Typography
            fontWeight={700}
            aria-labelledby={reportingReasonLabelId}
            textOverflow="ellipsis"
            overflow="hidden"
            title="Meldegrund"
          >
            {procedure.reportingReason ?? "–"}
          </Typography>
        </Grid>
      </Grid>
    </Sheet>
  );
}
