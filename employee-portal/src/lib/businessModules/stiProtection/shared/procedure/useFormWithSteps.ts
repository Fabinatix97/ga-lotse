/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode, useReducer } from "react";

export interface Step<TProps, TForm> {
  title: string;
  subTitle: string;
  fields: (props: TProps) => ReactNode;
  validate?: (form: TForm) => Partial<Record<keyof TForm, string>> | undefined;
}

export interface useFormWithStepsArgs<TForm, TStep> {
  steps: Step<TStep, TForm>[];
  onFinalSubmit: (form: TForm) => Promise<unknown>;
}

export function useFormWithSteps<TForm, TStep>(
  args: useFormWithStepsArgs<TForm, TStep>,
) {
  const { steps, onFinalSubmit } = args;

  const lastStepIndex = steps.length - 1;
  const [stepIndex, changeToStep] = useReducer(
    (_index: number, newIndex: number) =>
      Math.max(Math.min(newIndex, lastStepIndex), 0),
    0,
  );

  const step = steps[stepIndex]!;

  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;

  function handleNext(newValues: TForm) {
    if (isOnLastStep) {
      return onFinalSubmit(newValues);
    }
    changeToStep(stepIndex + 1);
  }

  function handlePrev() {
    changeToStep(stepIndex - 1);
  }

  const Fields = step.fields;

  return {
    Fields,
    handleNext,
    handlePrev,
    changeToStep,
    step,
    isOnFirstStep,
    isOnLastStep,
  };
}
