/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImportStatistics } from "@eshg/lib-employee-portal/api/models/import/ImportStatistics";
import {
  formatDuplicatedCount,
  formatFailedCount,
  formatTotalCount,
} from "@eshg/lib-employee-portal/helpers/import";
import { Stack, Typography } from "@mui/joy";

import { FileDownloadButton } from "@/lib/shared/components/buttons/FileDownloadButton";
import { ImportResultProceduresSummary } from "@/lib/shared/components/import/ImportResultProceduresSummary";
import {
  ImportResultItem,
  ImportResultSummary,
} from "@/lib/shared/components/import/ImportResultSummary";

function buildStatisticItems(statistics: ImportStatistics): ImportResultItem[] {
  if (statistics.total === 0) {
    return [
      {
        type: "error",
        value: formatTotalCount(statistics.total),
      },
    ];
  }

  return [
    {
      type: "info",
      value: formatTotalCount(statistics.total),
    },
    {
      type: statistics.duplicated === 0 ? "success" : "warning",
      value: formatDuplicatedCount(statistics.duplicated),
    },
    {
      type: statistics.failed === 0 ? "success" : "error",
      value: formatFailedCount(statistics.failed),
    },
  ];
}

interface ImportResultProps {
  file: File;
  statistics: ImportStatistics;
  isImportWithMerge: boolean;
}

export function ImportResult(props: ImportResultProps) {
  return (
    <Stack gap={3}>
      <ImportResultSummary items={buildStatisticItems(props.statistics)} />
      <Stack gap={3}>
        <Stack gap={1}>
          <Typography level="h4" component="h2" data-testid="statusHeading">
            Vorgänge
          </Typography>
          <ImportResultProceduresSummary
            result={props.statistics}
            isImportWithMerge={props.isImportWithMerge}
          />
        </Stack>
        {props.statistics.total > 0 && (
          <Stack gap={1}>
            <Typography fontSize="sm" data-testid="statusText">
              Bitte speichern Sie sich die Datei!
            </Typography>
            <FileDownloadButton
              file={props.file}
              color={
                props.statistics.failed > 0
                  ? "danger"
                  : props.statistics.duplicated > 0 ||
                      props.statistics.mergeFailed > 0
                    ? "warning"
                    : "success"
              }
              variant="soft"
            >
              {props.file.name}
            </FileDownloadButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
