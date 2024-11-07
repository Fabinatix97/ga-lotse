/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";

interface EvaluationDiagramProps {
  description: string | undefined;
  filterLabels: string[];
  evaluatedDataAmount: number;
  evaluatedDataAmountTotal: number;
  header?: ReactNode;
  chart: ReactNode;
}

export function EvaluationDiagramBox({
  description,
  filterLabels,
  evaluatedDataAmount,
  evaluatedDataAmountTotal,
  header,
  chart,
}: EvaluationDiagramProps) {
  return (
    <Stack
      flex="1"
      display="flex"
      minWidth={0}
      data-testid="evaluation-diagram"
      sx={{
        minHeight: "31rem",
        borderRadius: "sm",
        padding: 2,
        backgroundColor: "background.level1",
      }}
    >
      {header}
      {chart}
      <Stack gap={2} marginTop={2}>
        <Divider />
        <Typography
          level="body-md"
          data-testid="evaluation-diagram-description"
        >
          {description}
        </Typography>
        <Stack gap={0.5}>
          <Typography
            level="body-xs"
            textColor="text.secondary"
            data-testid="evaluation-diagram-filter"
          >
            Filter: {filterLabels.join(" | ")}
          </Typography>
          <Typography
            level="body-xs"
            textColor="text.secondary"
            data-testid="evaluation-diagram-evaluated-data"
          >
            {`Ausgewertete Daten: ${evaluatedDataAmount} von ${evaluatedDataAmountTotal}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
