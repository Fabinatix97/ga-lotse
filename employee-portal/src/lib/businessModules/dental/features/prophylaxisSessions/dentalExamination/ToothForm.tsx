/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Typography } from "@mui/joy";

import { ResultInputField } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/ResultInputField";
import {
  RemovableToothIcon,
  ToothIcon,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Teeth";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import {
  QuadrantNumber,
  ToothContext,
  ToothWithDiagnosis,
  hasPreviousExaminationResult,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";

interface ToothFormProps {
  quadrantNumber: QuadrantNumber;
  index: number;
  tooth: ToothWithDiagnosis;
}

export function ToothForm(props: ToothFormProps) {
  const { tooth, quadrantNumber, index } = props;
  const toothContext: ToothContext = { quadrantNumber, toothIndex: index };

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
    <>
      {tooth.isRemovable ? (
        <RemovableToothIcon tooth={tooth} toothContext={toothContext} />
      ) : (
        <ToothIcon tooth={tooth} toothContext={toothContext} />
      )}
      <ResultInputField
        result={tooth.mainResult}
        toothContext={toothContext}
        setResultAction={setMainResult}
        field="main"
        variant={isEmptyString(tooth.mainResult.value) ? "soft" : "outlined"}
        aria-label="Hauptbefund"
      />
      <ResultInputField
        result={tooth.secondaryResult1}
        toothContext={toothContext}
        setResultAction={setSecondaryResult1}
        field="secondary1"
        aria-label="Nebenbefund 1"
      />
      <ResultInputField
        result={tooth.secondaryResult2}
        toothContext={toothContext}
        setResultAction={setSecondaryResult2}
        field="secondary2"
        aria-label="Nebenbefund 2"
      />
      {hasPreviousExaminationResult(tooth) && (
        <Typography color="danger">
          {tooth.previousResults.join(",")}
        </Typography>
      )}
    </>
  );
}
