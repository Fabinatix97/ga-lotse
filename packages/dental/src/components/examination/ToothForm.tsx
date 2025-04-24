/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack, Typography } from "@mui/joy";

import { useExaminationStore } from "@/stores/examination/ExaminationStoreProvider";
import {
  QuadrantNumber,
  ToothContext,
  ToothWithDiagnosis,
  hasPreviousExaminationResult,
} from "@/stores/examination/types";

import { ResultInputField } from "./ResultInputField";
import { RemoveToothButton, ToggleToothTypeButton } from "./ToothIconButtons";

interface ToothFormProps {
  quadrantNumber: QuadrantNumber;
  index: number;
  tooth: ToothWithDiagnosis;
}

export function ToothForm(props: ToothFormProps) {
  const { tooth, quadrantNumber, index } = props;
  const toothContext: ToothContext = { quadrantNumber, toothIndex: index };

  const setMainResult = useExaminationStore((state) => state.setMainResult);
  const setSecondaryResult1 = useExaminationStore(
    (state) => state.setSecondaryResult1,
  );
  const setSecondaryResult2 = useExaminationStore(
    (state) => state.setSecondaryResult2,
  );

  return (
    <>
      {tooth.isRemovable ? (
        <RemoveToothButton tooth={tooth} toothContext={toothContext} />
      ) : (
        <ToggleToothTypeButton tooth={tooth} toothContext={toothContext} />
      )}
      <ResultInputField
        result={tooth.mainResult}
        toothContext={toothContext}
        setResultAction={setMainResult}
        field="mainResultField"
        variant={isEmptyString(tooth.mainResult.value) ? "soft" : "outlined"}
        aria-label="Hauptbefund"
      />
      <ResultInputField
        result={tooth.secondaryResult1}
        toothContext={toothContext}
        setResultAction={setSecondaryResult1}
        field="secondaryResult1Field"
        aria-label="Nebenbefund 1"
      />
      <ResultInputField
        result={tooth.secondaryResult2}
        toothContext={toothContext}
        setResultAction={setSecondaryResult2}
        field="secondaryResult2Field"
        aria-label="Nebenbefund 2"
      />
      {hasPreviousExaminationResult(tooth) && <PreviousResults tooth={tooth} />}
    </>
  );
}

function PreviousResults(props: { tooth: ToothWithDiagnosis }) {
  return (
    <Stack sx={{ alignItems: "center" }}>
      {props.tooth.previousResults.map((result) => (
        <Typography color="danger" key={result}>
          {result}
        </Typography>
      ))}
    </Stack>
  );
}
