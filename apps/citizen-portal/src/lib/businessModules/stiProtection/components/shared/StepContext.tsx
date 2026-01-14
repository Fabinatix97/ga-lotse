/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";

interface StepContextProps {
  totalSteps: number;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onShowOverviewChange: (showOverview: boolean) => void;
  isShowOverview: boolean;
  goForward: (numOfSteps?: number) => void;
  goBack: (numOfSteps?: number) => void;
}
const StepContext = createContext<StepContextProps | null>(null);

type ReactComponent = () => ReactNode;

interface StepContextProviderProps {
  steps: Readonly<[ReactComponent, ...ReactComponent[]]>;
}

export function Stepper({ steps }: StepContextProviderProps) {
  const [currentStepIndex, changeCurrentStepIndex] = useReducer(
    (stepIndex: number, change: number) =>
      Math.min(Math.max(stepIndex + change, 0), steps.length - 1),
    0,
  );

  const [isShowOverview, setIsShowOverview] = useState(true);
  const CurrentStep = steps[currentStepIndex];
  if (CurrentStep === undefined) {
    throw new Error("Current step is undefined");
  }

  const goForward = useCallback(
    (numOfSteps = 1) => changeCurrentStepIndex(numOfSteps),
    [changeCurrentStepIndex],
  );
  const goBack = useCallback(
    (numOfSteps = 1) => changeCurrentStepIndex(-numOfSteps),
    [changeCurrentStepIndex],
  );

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const contextValue = useMemo(
    () => ({
      goForward,
      goBack,
      currentStepIndex,
      totalSteps: steps.length,
      isFirstStep,
      isLastStep,
      onShowOverviewChange: setIsShowOverview,
      isShowOverview,
    }),
    [
      goForward,
      goBack,
      currentStepIndex,
      setIsShowOverview,
      isShowOverview,
      isFirstStep,
      isLastStep,
      steps.length,
    ],
  );

  return (
    <StepContext value={contextValue}>
      <CurrentStep />
    </StepContext>
  );
}

export function useStepContext() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used with a Stepper");
  }
  return context;
}
