/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikProps, FormikValues } from "formik";
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface MultiStepFormContextProps {
  currentStep: number;
  totalSteps: number;
  goForward: () => void;
  goBack: () => void;
  setStep: (step: number) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextProps>({
  currentStep: 1,
  totalSteps: 0,
  goForward: () => {
    throw new Error(
      "Trying to use MultiStepFormContext#goForward without using MultiStepForm",
    );
  },
  goBack: () => {
    throw new Error(
      "Trying to use MultiStepFormContext#goBack without using MultiStepForm",
    );
  },
  setStep: () => {
    throw new Error(
      "Trying to use MultiStepFormContext#setStep without using MultiStepForm",
    );
  },
});

export type StepFactory<TValues> = (props: FormikProps<TValues>) => ReactNode;

interface MultiStepFormProps<TValues extends FormikValues = FormikValues> {
  steps: StepFactory<TValues>[];
  children: (
    values: {
      Outlet: FunctionComponent<FormikProps<TValues>>;
    } & MultiStepFormContextProps,
  ) => ReactNode;
}

export function MultiStepForm<TValues extends FormikValues = FormikValues>({
  steps,
  children,
}: MultiStepFormProps<TValues>) {
  const [currentStep, setStep] = useState(1);
  const totalSteps = steps.length;
  const currentNode = steps[currentStep - 1];
  if (currentNode === undefined) {
    throw new Error(
      `StepFactory[] out of bounds. Tried to access index ${currentStep - 1} but length is ${steps.length}`,
    );
  }

  const goForward = useCallback(
    function () {
      if (currentStep < steps.length) {
        setStep((prev) => prev + 1);
      }
    },
    [currentStep, steps, setStep],
  );

  const goBack = useCallback(
    function () {
      if (currentStep > 1) {
        setStep((prev) => prev - 1);
      }
    },
    [currentStep, setStep],
  );

  const setStepClamped = useCallback(
    function (step: number) {
      setStep(Math.max(1, Math.min(step, totalSteps)));
    },
    [setStep, totalSteps],
  );

  const contextValue = useMemo(
    () => ({
      goForward,
      goBack,
      currentStep,
      totalSteps,
      setStep: setStepClamped,
    }),
    [goForward, goBack, currentStep, totalSteps, setStepClamped],
  );

  return (
    <MultiStepFormContext value={contextValue}>
      {children({
        Outlet: currentNode,
        ...contextValue,
      })}
    </MultiStepFormContext>
  );
}

export function useMultiStepForm() {
  return useContext(MultiStepFormContext);
}
