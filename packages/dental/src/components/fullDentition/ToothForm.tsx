/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { formatList } from "@eshg/lib-employee-portal";

import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import {
  QuadrantNumber,
  ToothContext,
  ToothDiagnosisResult,
  ToothWithDiagnosis,
  hasPreviousExaminationResult,
} from "../../stores/examination/types";

import { ResultInputField } from "./ResultInputField";
import { RemoveToothButton, ToggleToothTypeButton } from "./toothIconButtons";

interface ToothFormProps {
  quadrantNumber: QuadrantNumber;
  index: number;
  tooth: ToothWithDiagnosis;
}

export function ToothForm(props: ToothFormProps) {
  const { tooth, quadrantNumber, index } = props;
  const toothContext: ToothContext = { quadrantNumber, toothIndex: index };

  const setMainResult = useExaminationStore((state) => state.setMainResult);
  const setSecondaryResult = useExaminationStore(
    (state) => state.setSecondaryResult,
  );

  return (
    <>
      {tooth.isRemovable ? (
        <RemoveToothButton tooth={tooth} toothContext={toothContext} />
      ) : (
        <ToggleToothTypeButton tooth={tooth} toothContext={toothContext} />
      )}
      <ResultInputField
        field="mainResultField"
        aria-label="Hauptbefund"
        result={tooth.mainResult}
        toothContext={toothContext}
        setResultAction={setMainResult}
      />
      <ResultInputField
        field="secondaryResultField"
        aria-label="Nebenbefund"
        result={tooth.secondaryResult}
        toothContext={toothContext}
        setResultAction={setSecondaryResult}
      />
      {hasPreviousExaminationResult(tooth) && (
        <PreviousResultsList values={tooth.previousResults} />
      )}
    </>
  );
}

function PreviousResultsList(props: { values: ToothDiagnosisResult[] }) {
  return (
    <Typography color="warning">{formatList(props.values, ", ")}</Typography>
  );
}
