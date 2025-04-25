/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";

import { ApiLabStatus } from "@eshg/sti-protection-api";

import { LAB_STATUS_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";

import { StatusIndicator } from "./StatusIndicator";

const DISPLAYED_STATUS = [
  ApiLabStatus.TestsRequested,
  ApiLabStatus.TestsConducted,
  ApiLabStatus.ResultsRecorded,
  ApiLabStatus.ResultsCommunicated,
];

function getLabStatusProgress(status: ApiLabStatus): number {
  const statuses = Object.values(ApiLabStatus);
  return statuses.indexOf(status);
}

export interface LabStatusIndicatorProps {
  labStatus: ApiLabStatus;
}

export function LabStatusIndicator(props: LabStatusIndicatorProps) {
  const { labStatus } = props;
  const progress = getLabStatusProgress(labStatus);

  return (
    <Sheet>
      <Typography level={"h3"} mb={3}>
        Labortests Fortschritt
      </Typography>
      <Stack
        component="section"
        gap={1}
        aria-label={"Fortschritsanzeige der Labortests"}
      >
        {DISPLAYED_STATUS.map((status, index) => (
          <StatusIndicator
            key={status}
            name={LAB_STATUS_VALUES[status]}
            phase={index + 1}
            progress={progress}
          />
        ))}
      </Stack>
    </Sheet>
  );
}
