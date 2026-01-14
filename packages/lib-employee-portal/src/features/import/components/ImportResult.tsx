/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";

import {
  ResultItem,
  UpdateResultSummary,
} from "../../../components/UpdateResultSummary";
import { ImportStatistics } from "../types/ImportStatistics";
import {
  formatDuplicatedRecordCount,
  formatFaultyRecordCount,
  formatTotalRecordCount,
} from "../utils/formatters";

import { FileDownloadButton } from "./FileDownloadButton";
import { ImportResultProceduresSummary } from "./ImportResultProceduresSummary";

function buildStatisticItems(statistics: ImportStatistics): ResultItem[] {
  if (statistics.total === 0) {
    return [
      {
        type: "error",
        value: formatTotalRecordCount(statistics.total),
      },
    ];
  }

  return [
    {
      type: "info",
      value: formatTotalRecordCount(statistics.total),
    },
    {
      type: statistics.duplicated === 0 ? "success" : "warning",
      value: formatDuplicatedRecordCount(statistics.duplicated),
    },
    {
      type: statistics.failed === 0 ? "success" : "error",
      value: formatFaultyRecordCount(statistics.failed),
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
      <UpdateResultSummary items={buildStatisticItems(props.statistics)} />
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
