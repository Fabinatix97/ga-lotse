/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isDefined } from "remeda";

interface StepContextProps {
  totalSteps: number;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onShowOverviewChange: (showOverview: boolean) => void;
  isShowOverview: boolean;
  goForward: (numOfPages?: number) => void;
  goBack: (numOfPages?: number) => void;
  currentNode?: ReactElement;
}
export const TravelMedicineStepContext = createContext<StepContextProps | null>(
  null,
);

interface StepContextProviderProps {
  steps: ReactElement[];
  children: (values: StepContextProps) => ReactNode;
}

/***
 * This component was originally imported from the travel medicine module.
 * It was moved here because travel medicine replaced it with the MultiStepForm component in ISSUE-8102.
 *
 * Should be replaced by the sti protection StepContext or MultiStepForm.
 * @deprecated
 */
export function StepContextProvider({
  steps,
  children,
}: StepContextProviderProps) {
  const totalSteps = steps.length;

  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [isShowOverview, setIsShowOverview] = useState(true);
  const currentNode = steps[currentStepIndex - 1];
  if (currentNode === undefined) {
    throw new Error(
      `StepFactory[] out of bounds. Tried to access index ${currentStepIndex - 1} but length is ${steps.length}`,
    );
  }

  const onShowOverviewChange = useCallback((displayOverview: boolean) => {
    setIsShowOverview(displayOverview);
  }, []);

  const goForward = useCallback(
    function (numOfPages?: number) {
      if (currentStepIndex < steps.length) {
        setCurrentStepIndex(
          (prev) => prev + (isDefined(numOfPages) ? numOfPages : 1),
        );
      }
    },
    [currentStepIndex, steps, setCurrentStepIndex],
  );

  const goBack = useCallback(
    function (numOfPages?: number) {
      if (currentStepIndex > 1) {
        setCurrentStepIndex(
          (prev) => prev - (isDefined(numOfPages) ? numOfPages : 1),
        );
      }
    },
    [currentStepIndex, setCurrentStepIndex],
  );

  const isFirstStep = currentStepIndex === 1;
  const isLastStep = currentStepIndex === totalSteps;

  const contextValue = useMemo(
    () => ({
      goForward,
      goBack,
      currentStepIndex,
      totalSteps,
      isFirstStep,
      isLastStep,
      onShowOverviewChange,
      isShowOverview,
      currentNode,
    }),
    [
      goForward,
      goBack,
      currentStepIndex,
      totalSteps,
      onShowOverviewChange,
      isShowOverview,
      isFirstStep,
      isLastStep,
      currentNode,
    ],
  );

  return (
    <TravelMedicineStepContext value={contextValue}>
      {children({
        ...contextValue,
      })}
    </TravelMedicineStepContext>
  );
}

/***
 * @deprecated
 */
export function useStepContext() {
  const context = useContext(TravelMedicineStepContext);
  if (!context) {
    throw new Error("useStepContext must be used with a StepContextProvider");
  }
  return context;
}
