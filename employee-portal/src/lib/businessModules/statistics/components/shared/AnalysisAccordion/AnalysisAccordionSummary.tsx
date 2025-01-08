/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Tooltip, Typography } from "@mui/joy";

import { Analysis } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  diagramTypeIcons,
  diagramTypeNames,
} from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";

export interface AnalysisAccordionSummaryProps {
  analysis: Analysis;
}

export function AnalysisAccordionSummary(props: AnalysisAccordionSummaryProps) {
  const diagramCount = props.analysis.numberOfDiagrams;
  const diagramType = props.analysis.diagramConfiguration.type;
  const ChartIcon = diagramTypeIcons[diagramType];

  return (
    <Stack flex={1} direction="row" spacing={3} alignItems="center">
      <Typography level="title-lg" sx={{ flex: 1 }}>
        {props.analysis.name}
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
