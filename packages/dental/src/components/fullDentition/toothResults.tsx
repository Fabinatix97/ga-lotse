/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { formatList } from "@eshg/lib-portal";

import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import {
  Tooth,
  ToothContext,
  hasPreviousExaminationResult,
  isAddableTooth,
} from "../../stores/examination/types";

import { ResultInputField } from "./ResultInputField";

interface MainResultFieldProps {
  tooth: Tooth;
  toothContext: ToothContext;
  isTabFocusable: boolean;
  "aria-labelledby": string;
}

export function MainResultField(props: MainResultFieldProps) {
  const { tooth, ...inputProps } = props;
  const setMainResult = useExaminationStore((state) => state.setMainResult);

  if (isAddableTooth(tooth)) {
    return null;
  }

  return (
    <ResultInputField
      {...inputProps}
      field="mainResultField"
      result={tooth.mainResult}
      isTabFocusable={props.isTabFocusable}
      setResultAction={setMainResult}
    />
  );
}

interface SecondaryResultFieldProps {
  tooth: Tooth;
  toothContext: ToothContext;
  "aria-labelledby": string;
}

export function SecondaryResultField(props: SecondaryResultFieldProps) {
  const { tooth, ...inputProps } = props;
  const setSecondaryResult = useExaminationStore(
    (state) => state.setSecondaryResult,
  );

  if (isAddableTooth(tooth)) {
    return null;
  }

  return (
    <ResultInputField
      {...inputProps}
      field="secondaryResultField"
      result={tooth.secondaryResult}
      setResultAction={setSecondaryResult}
    />
  );
}

interface PreviousResultsCellProps {
  tooth: Tooth;
}

export function PreviousResultsList(props: PreviousResultsCellProps) {
  const { tooth } = props;

  if (!hasPreviousExaminationResult(tooth)) {
    return null;
  }

  return (
    <Typography color="warning">
      {formatList(tooth.previousResults, ", ")}
    </Typography>
  );
}
