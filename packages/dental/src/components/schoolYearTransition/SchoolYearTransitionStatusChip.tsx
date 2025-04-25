/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { ApiSchoolYearTransitionStatus } from "@eshg/dental-api";

import { SCHOOL_YEAR_TRANSITION_STATUS } from "@/translations/schoolYearTransition";

const statusColors: Record<ApiSchoolYearTransitionStatus, ChipProps["color"]> =
  {
    COMPLETE: "success",
    INCOMPLETE: "neutral",
  };

interface SchoolYearTransitionStatusChipProps {
  status: ApiSchoolYearTransitionStatus;
}

export function SchoolYearTransitionStatusChip(
  props: SchoolYearTransitionStatusChipProps,
) {
  return (
    <Chip variant="soft" color={statusColors[props.status]}>
      {SCHOOL_YEAR_TRANSITION_STATUS[props.status]}
    </Chip>
  );
}
