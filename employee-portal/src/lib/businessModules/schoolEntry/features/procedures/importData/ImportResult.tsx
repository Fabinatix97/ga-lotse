/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiImportStatistics,
  ApiSchoolEntryFeature,
} from "@eshg/employee-portal-api/schoolEntry";
import { Stack, Typography } from "@mui/joy";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { ImportResultProceduresSummary } from "@/lib/businessModules/schoolEntry/features/procedures/importData/ImportResultProceduresSummary";
import { FileDownloadButton } from "@/lib/shared/components/buttons/FileDownloadButton";

import { ImportResultItem, ImportResultSummary } from "./ImportResultSummary";
import {
  formatDuplicatedCount,
  formatFailedCount,
  formatImportedCount,
  formatTotalCount,
} from "./formatters";

function buildStatisticItems(
  statistics: ApiImportStatistics,
): ImportResultItem[] {
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

function getStatusHeading(
  statistics: ApiImportStatistics,
  isMergeEnabled: boolean,
) {
  if (isMergeEnabled) {
    return "Vorgänge";
  } else {
    if (statistics.total === 0 || statistics.created === 0) {
      return "Keine Vorgänge angelegt";
    }

    return `${formatImportedCount(statistics.created)} erfolgreich neu angelegt`;
  }
}

interface ImportResultProps {
  file: File;
  statistics: ApiImportStatistics;
}

export function ImportResult(props: ImportResultProps) {
  const isMergeEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.MergeProceduresOnImport,
  );

  return (
    <Stack gap={3}>
      <ImportResultSummary items={buildStatisticItems(props.statistics)} />
      <Stack gap={3}>
        <Stack gap={1}>
          <Typography level="h4" component="h2" data-testid="statusHeading">
            {getStatusHeading(props.statistics, isMergeEnabled)}
          </Typography>
          {isMergeEnabled && (
            <ImportResultProceduresSummary result={props.statistics} />
          )}
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
