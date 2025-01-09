/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack } from "@mui/joy";

import { ReportDetailsView } from "@/lib/businessModules/statistics/api/models/reportDetailsViewTypes";
import { AnalysisAccordion } from "@/lib/businessModules/statistics/components/shared/AnalysisAccordion/AnalysisAccordion";

import { ReportDetailsTile, ReportDetailsTileProps } from "./ReportDetailsTile";

export function ReportDetails(props: ReportDetailsView) {
  const reportDetailsTileProps: ReportDetailsTileProps = {
    ...props,
    dataSource: props.dataSource.name,
    datasetAmount: props.dataSource.datasetAmount,
    attributeLabels: props.dataSource.attributeLabels,
    dataSourceSensitivity: props.dataSource.sensitivity,
  };
  return (
    <Stack gap={3} direction={"row"}>
      <Box flex={2}>
        <AnalysisAccordion
          analyses={props.analyses}
          attributes={props.attributes}
          evaluatedDataAmountTotal={props.dataSource.datasetAmount}
          isReport
          dataSourceSensitivity={props.dataSource.sensitivity}
        />
      </Box>
      <ReportDetailsTile {...reportDetailsTileProps} />
    </Stack>
  );
}
