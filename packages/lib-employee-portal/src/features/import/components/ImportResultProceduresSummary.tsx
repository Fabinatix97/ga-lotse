/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";

import { SummaryItem } from "./SummaryItem";

interface ImportResultProcedures {
  created: number;
  merged: number;
  mergeFailed: number;
}

interface ImportResultProceduresSummaryProps {
  result: ImportResultProcedures;
  isImportWithMerge: boolean;
}

export function ImportResultProceduresSummary(
  props: ImportResultProceduresSummaryProps,
) {
  const createdOrMerged = props.isImportWithMerge
    ? "angelegt oder zusammengeführt"
    : "angelegt";
  const mergeFailedMessage = props.isImportWithMerge
    ? "konnten nicht zusammengeführt werden"
    : "nicht angelegt wegen Duplikaten im Bestand";

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
      {props.result.created === 0 && props.result.merged === 0 && (
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
