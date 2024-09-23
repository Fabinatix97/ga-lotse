/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useCallback, useContext, useState } from "react";

interface StepContextProps {
  steps: JSX.Element[];
  totalSteps: number;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onStepChange: (curStep: number) => void;
  onShowOverviewChange: (showOverview: boolean) => void;
  isShowOverview: boolean;
}

interface StepContextProviderProps extends RequiresChildren {
  steps: JSX.Element[];
}

export const StepContext = createContext<StepContextProps | null>(null);

export function StepContextProvider(props: Readonly<StepContextProviderProps>) {
  const steps = props.steps;
  const totalSteps = steps.length;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isShowOverview, setIsShowOverview] = useState(true);

  const onStepChange = useCallback((newStep: number) => {
    setCurrentStepIndex(newStep);
  }, []);

  const onShowOverviewChange = useCallback((displayOverview: boolean) => {
    setIsShowOverview(displayOverview);
  }, []);

  return (
    <StepContext.Provider
      value={{
        steps,
        totalSteps,
        currentStepIndex,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === totalSteps - 1,
        onStepChange,
        onShowOverviewChange,
        isShowOverview,
      }}
    >
      {props.children}
    </StepContext.Provider>
  );
}

export function useStepContext() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStepContext must be used with a StepContextProvider");
  }
  return context;
}
