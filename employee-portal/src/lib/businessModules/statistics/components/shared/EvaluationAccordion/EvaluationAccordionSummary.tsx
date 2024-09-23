/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Tooltip, Typography } from "@mui/joy";

import { Evaluation } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import {
  diagramTypeIcons,
  diagramTypeNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";

export interface EvaluationAccordionSummaryProps {
  evaluation: Evaluation;
}

export function EvaluationAccordionSummary(
  props: EvaluationAccordionSummaryProps,
) {
  const diagramCount = props.evaluation.numberOfDiagrams;
  const diagramType = props.evaluation.diagramConfiguration.type;
  const ChartIcon = diagramTypeIcons[diagramType];

  return (
    <Stack flex={1} direction="row" spacing={3} alignItems="center">
      <Typography level="title-lg" sx={{ flex: 1 }}>
        {props.evaluation.name}
      </Typography>
      <Typography level="body-md">
        Diagramme: <strong>{diagramCount}</strong>
      </Typography>
      <Tooltip title={diagramTypeNames[diagramType]}>
        <ChartIcon
          sx={{
            "--Icon-color": (theme) => theme.palette.text.tertiary,
          }}
        />
      </Tooltip>
    </Stack>
  );
}
