/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Stack, Typography } from "@mui/joy";

import { ApiInspectionForDuplicateReview } from "@eshg/inspection-api";
import { formatDate, formatTime } from "@eshg/lib-portal";

import { DuplicateTileLine } from "@/lib/businessModules/inspection/components/facility/pending/DuplicateTileLine";
import { formatIncidentCount } from "@/lib/businessModules/inspection/components/processImport/formatters";
import {
  translateInspectionResult,
  translateInspectionType,
} from "@/lib/businessModules/inspection/shared/enums";

interface InspectionDuplicateTileProps {
  inspection: ApiInspectionForDuplicateReview;
  importedInspection: ApiInspectionForDuplicateReview;
  isImportedInspection: boolean;
  testId?: string;
}

export function InspectionDuplicateTile({
  inspection,
  importedInspection,
  isImportedInspection,
  testId,
}: Readonly<InspectionDuplicateTileProps>) {
  const badgeText = isImportedInspection ? "Import" : "Stammdaten";

  return (
    <Sheet
      sx={{
        padding: 2,
        borderRadius: (theme) => theme.radius.lg,
        border: "1px solid",
        borderColor: isImportedInspection ? "warning.300" : "divider",
        backgroundColor: isImportedInspection ? "warning.100" : "transparent",
      }}
      aria-label="Einrichtung"
    >
      <Stack direction="column" gap={2} data-testid={testId}>
        <Typography level="h4" component="p">
          {inspection.title}
        </Typography>
        <Stack direction="column" gap={1}>
          <DuplicateTileLine
            dataset={inspection}
            importedDataset={importedInspection}
            textExtractor={(i) => translateInspectionType(i.type)}
            suppressExclamationMark
          />
          <DuplicateTileLine
            dataset={inspection}
            importedDataset={importedInspection}
            textExtractor={(i) =>
              " Durchgeführt: " +
              formatDate(i.executedTime) +
              ", " +
              formatTime(i.executedTime)
            }
          />
          <DuplicateTileLine
            dataset={inspection}
            importedDataset={importedInspection}
            textExtractor={(i) =>
              "Ergebnis: " + translateInspectionResult(i.result)
            }
            badgeText={
              inspection.numberOfIncidents === 0 ? badgeText : undefined
            }
          />
          {inspection.numberOfIncidents !== 0 && (
            <DuplicateTileLine
              dataset={inspection}
              importedDataset={importedInspection}
              textExtractor={(i) => formatIncidentCount(i.numberOfIncidents)}
              badgeText={
                inspection.numberOfIncidents !== 0 ? badgeText : undefined
              }
            />
          )}
        </Stack>
      </Stack>
    </Sheet>
  );
}
