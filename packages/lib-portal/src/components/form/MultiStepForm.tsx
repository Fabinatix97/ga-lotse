/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikProps, FormikValues } from "formik";
import {
  FunctionComponent,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isDefined } from "remeda";

interface MultiStepFormContextProps {
  currentStep: number;
  totalSteps: number;
  goForward: () => void;
  goBack: () => void;
  setStep: (step: number) => void;
  /**
   * Use `titleRef` to set focus on `PageTitle` when
   *  - goForward
   *  - goBack
   *  - the form is initialized
   * To set focus on other components, `tabindex="-1"` is also needed
   */
  titleRef?: RefObject<HTMLDivElement | null>;
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

export interface MultiStepFormProps<
  TValues extends FormikValues = FormikValues,
> {
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
  const titleRef = useRef<HTMLDivElement>(null);
  const [currentStep, setStep] = useState(1);
  const totalSteps = steps.length;
  const currentNode = steps[currentStep - 1];
  if (currentNode === undefined) {
    throw new Error(
      `StepFactory[] out of bounds. Tried to access index ${currentStep - 1} but length is ${steps.length}`,
    );
  }

  // Focus the title once the form is loaded
  useEffect(() => {
    if (currentStep === 1) {
      focusTitle();
    }
  }, [currentStep]);

  const goForward = useCallback(
    function () {
      if (currentStep < steps.length) {
        setStep((prev) => prev + 1);
        focusTitle();
      }
    },
    [currentStep, steps, setStep],
  );

  const goBack = useCallback(
    function () {
      if (currentStep > 1) {
        setStep((prev) => prev - 1);
        focusTitle();
      }
    },
    [currentStep, setStep],
  );

  const setStepClamped = useCallback(
    function (step: number) {
      setStep(Math.max(1, Math.min(step, totalSteps)));
      focusTitle();
    },
    [setStep, totalSteps],
  );

  function focusTitle() {
    if (isDefined(titleRef.current)) {
      titleRef.current?.focus();
    }
  }

  const contextValue = useMemo(
    () => ({
      goForward,
      goBack,
      currentStep,
      totalSteps,
      setStep: setStepClamped,
      titleRef,
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
