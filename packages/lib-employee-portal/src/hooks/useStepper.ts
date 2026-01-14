/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useReducer } from "react";

interface Step<TProps, TData> {
  title: string;
  subTitle?: string;
  fields: (props: TProps) => ReactNode;
  validate?: (form: TData) => Partial<Record<keyof TData, string>> | undefined;
}

export interface UseStepperArgs<TData, TStep> {
  steps: Step<TStep, TData>[];
  onFinalSubmit: (form: TData) => Promise<unknown> | void;
  onNext?: (form: TData) => Promise<unknown> | void;
}

export function useStepper<TData, TStep>({
  steps,
  onFinalSubmit,
  onNext,
}: UseStepperArgs<TData, TStep>) {
  const lastStepIndex = steps.length - 1;
  const [stepIndex, changeToStep] = useReducer(
    (_index: number, newIndex: number) =>
      Math.max(Math.min(newIndex, lastStepIndex), 0),
    0,
  );

  const step = steps[stepIndex]!;

  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;

  async function handleNext(newValues: TData) {
    if (isOnLastStep) {
      return onFinalSubmit(newValues);
    }
    await onNext?.(newValues);
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
