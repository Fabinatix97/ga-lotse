/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";

import { ToothResult, ToothWithDiagnosis } from "@/stores/examination/types";

interface ExaminationResultProps {
  tooth: ToothWithDiagnosis;
}

export function ReadonlyExaminationResult({ tooth }: ExaminationResultProps) {
  const mainResult = tooth.mainResult;
  const secondaryResult1 = tooth.secondaryResult1;
  const secondaryResult2 = tooth.secondaryResult2;
  return (
    <Stack sx={{ alignItems: "center" }}>
      <Typography color={getColorForResult(mainResult)}>
        {isNonEmptyString(mainResult.value) ? mainResult.value : "-"}
      </Typography>
      {isNonEmptyString(secondaryResult1.value) && (
        <Typography color={getColorForResult(secondaryResult1)}>
          {secondaryResult1.value}
        </Typography>
      )}
      {isNonEmptyString(secondaryResult2.value) && (
        <Typography color={getColorForResult(secondaryResult2)}>
          {secondaryResult2.value}
        </Typography>
      )}
    </Stack>
  );
}

function getColorForResult(result: ToothResult) {
  return result.isInvalid ? "danger" : undefined;
}
