/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMainResult } from "@eshg/dental-api";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack, Typography } from "@mui/joy";

import { AddToothButton } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/AddToothButton";
import { Quadrant } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Quadrant";
import { ToothIcon } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Teeth";
import { ToothNumber } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/ToothNumber";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import {
  QuadrantNumber,
  ToothWithDiagnosis,
  isAddableTooth,
  isToothWithDiagnosis,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

import { ResultInputField } from "./ResultInputField";

export function GeneralJawForm(props: { quadrantNumber: QuadrantNumber }) {
  const setMainResult = useDentalExaminationStore(
    (state) => state.setMainResult,
  );
  const setSecondaryResult1 = useDentalExaminationStore(
    (state) => state.setSecondaryResult1,
  );
  const setSecondaryResult2 = useDentalExaminationStore(
    (state) => state.setSecondaryResult2,
  );

  return (
    <Quadrant quadrantNumber={props.quadrantNumber}>
      {(tooth, index) => (
        <Stack key={tooth.toothNumber} sx={{ gap: 2, alignItems: "center" }}>
          {isToothWithDiagnosis(tooth) && (
            <>
              <ToothNumber tooth={tooth} />
              <ToothIcon tooth={tooth} />
              <ResultInputField
                result={tooth.mainResult}
                index={index}
                quadrantNumber={props.quadrantNumber}
                setResultAction={setMainResult}
                field="main"
                variant={
                  isEmptyString(tooth.mainResult.value) ? "soft" : "outlined"
                }
              />
              <ResultInputField
                result={tooth.secondaryResult1}
                index={index}
                quadrantNumber={props.quadrantNumber}
                setResultAction={setSecondaryResult1}
                field="secondary1"
              />
              <ResultInputField
                result={tooth.secondaryResult2}
                index={index}
                quadrantNumber={props.quadrantNumber}
                setResultAction={setSecondaryResult2}
                field="secondary2"
              />
              {hasPreviousExaminationResult(tooth) && (
                <Typography color="danger">
                  {tooth.previousResults.join(",")}
                </Typography>
              )}
            </>
          )}
          {isAddableTooth(tooth) && (
            <AddToothButton
              index={index}
              quadrantNumber={props.quadrantNumber}
            />
          )}
        </Stack>
      )}
    </Quadrant>
  );
}

export function hasPreviousExaminationResult(
  tooth: ToothWithDiagnosis,
): boolean {
  return (
    tooth.previousResults.length > 0 &&
    tooth.previousResults[0] !== ApiMainResult.S
  );
}
