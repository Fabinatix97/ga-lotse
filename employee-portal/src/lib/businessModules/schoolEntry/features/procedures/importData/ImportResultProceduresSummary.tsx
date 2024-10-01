/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert, Stack, Typography } from "@mui/joy";

interface ImportResultProcedures {
  created: number;
  merged: number;
  mergeFailed: number;
}

interface ImportResultProceduresSummaryProps {
  result: ImportResultProcedures;
  isDirectProcedureTypeAssignmentOnImport: boolean;
}

interface SummaryItemProps {
  content: string;
  color: "success" | "primary" | "danger";
}

function SummaryItem(props: SummaryItemProps) {
  return (
    <Alert
      aria-live="polite"
      variant="soft"
      color={props.color}
      sx={{ padding: 1 }}
    >
      <Typography
        fontSize="sm"
        fontWeight="md"
        variant="soft"
        color={props.color}
      >
        {props.content}
      </Typography>
    </Alert>
  );
}

export function ImportResultProceduresSummary(
  props: ImportResultProceduresSummaryProps,
) {
  const createdOrMerged = props.isDirectProcedureTypeAssignmentOnImport
    ? "angelegt"
    : "angelegt oder zusammengeführt";
  const mergeFailedMessage = props.isDirectProcedureTypeAssignmentOnImport
    ? "nicht angelegt wegen Duplikaten im Bestand"
    : "konnten nicht zusammengeführt werden";

  return (
    <Stack gap={1}>
      {props.result.created > 0 && (
        <SummaryItem
          content={`${props.result.created} erfolgreich neu angelegt`}
          color="success"
        />
      )}
      {props.result.merged > 0 && (
        <SummaryItem
          content={`${props.result.merged} erfolgreich zusammengeführt`}
          color="success"
        />
      )}
      {props.result.created == 0 && props.result.merged == 0 && (
        <SummaryItem content={`0 ${createdOrMerged}`} color="primary" />
      )}
      {props.result.mergeFailed > 0 && (
        <SummaryItem
          content={`${props.result.mergeFailed} ${mergeFailedMessage}`}
          color="danger"
        />
      )}
    </Stack>
  );
}
