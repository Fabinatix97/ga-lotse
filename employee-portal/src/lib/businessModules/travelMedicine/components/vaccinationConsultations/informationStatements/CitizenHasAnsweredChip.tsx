/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

export const AnswerStatus = {
  Answered: "ANSWERED",
  NotAnswered: "NOT_ANSWERED",
} as const;
export type AnswerStatus = (typeof AnswerStatus)[keyof typeof AnswerStatus];

const statusNames = {
  [AnswerStatus.Answered]: "Ausgefüllt",
  [AnswerStatus.NotAnswered]: "Nicht ausgefüllt",
} satisfies Record<AnswerStatus, string>;

const statusColors = {
  [AnswerStatus.Answered]: "success",
  [AnswerStatus.NotAnswered]: "warning",
} satisfies Record<AnswerStatus, ChipProps["color"]>;

export function CitizenHasAnsweredStatusChip({
  value,
}: {
  value: AnswerStatus;
}) {
  return (
    <Chip color={statusColors[value]} size="md">
      {statusNames[value]}
    </Chip>
  );
}
