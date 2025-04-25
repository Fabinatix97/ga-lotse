/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createStore } from "zustand";

import { ApiDentitionType, ApiTooth } from "@eshg/dental-api";

import {
  ExaminationResult,
  ExaminationResultWithDate,
  ScreeningExaminationResult,
} from "@/api/models/ExaminationResult";
import { ToothDiagnosis } from "@/api/models/ToothDiagnosis";

import { calculateDmftValuesByDentitionType } from "./actions/dmftValues";
import { setFocus } from "./actions/focus";
import { NavigateDirection, navigateFrom } from "./actions/navigateFrom";
import { navigateTo } from "./actions/navigateTo";
import {
  hasAnyResult,
  setMainResult,
  setSecondaryResult1,
  setSecondaryResult2,
} from "./actions/result";
import { SubmitResult, submit } from "./actions/submit";
import { addTooth, removeTooth, toggleToothType } from "./actions/tooth";
import { createDentitionByType } from "./factories";
import {
  Dentition,
  DmftValues,
  ElementContext,
  ExaminationView,
  ToothContext,
} from "./types";

export interface ExaminationState {
  currentView: ExaminationView;
  currentFocus: ElementContext | undefined;
  dentition: Dentition;
  dmftValues: DmftValuesByDentitionType;
  previousToothDiagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>;
  dirty: boolean;
  hasResult: boolean;
}

interface ExaminationActions {
  setView: (newView: ExaminationView) => void;
  setFocus: (focus: ElementContext | undefined) => void;
  navigateFrom: (direction: NavigateDirection) => void;
  navigateTo: (toothContext: ToothContext) => void;

  addTooth: ToothAction;
  removeTooth: ToothAction;
  toggleToothType: ToothAction;

  setMainResult: SetToothResultAction;
  setSecondaryResult1: SetToothResultAction;
  setSecondaryResult2: SetToothResultAction;
  submit: () => SubmitResult;

  toggleDentition: (dentitionType: ApiDentitionType) => void;
}

type ToothAction = (toothContext: ToothContext) => void;
export type SetToothResultAction = (
  toothContext: ToothContext,
  newValue: string,
) => void;

export type ExaminationStore = ExaminationState & ExaminationActions;

export type DmftValuesState = Pick<ExaminationState, "dmftValues">;
export type DirtyState = Pick<ExaminationState, "dirty">;
export type HasResultState = Pick<ExaminationState, "hasResult">;
export type PreviousDiagnosesState = Pick<
  ExaminationState,
  "previousToothDiagnoses"
>;

export interface DmftValuesByDentitionType {
  primaryTeeth: DmftValues;
  secondaryTeeth: DmftValues;
}

export function initExaminationStore(
  examinationResult: ExaminationResult | undefined,
  defaultDentitionType: ApiDentitionType = ApiDentitionType.Mixed,
  previousExaminationResult: ExaminationResultWithDate | undefined,
): ExaminationState {
  const isScreening = examinationResult?.type === "screening";
  const previousWasScreening =
    previousExaminationResult?.result?.type === "screening";

  const toothDiagnoses = isScreening ? examinationResult.toothDiagnoses : {};
  const previousToothDiagnoses = previousWasScreening
    ? (previousExaminationResult.result as ScreeningExaminationResult)
        .toothDiagnoses
    : {};

  const dentitionType =
    (isScreening ? examinationResult.dentitionType : undefined) ??
    defaultDentitionType;
  const dentition = createDentitionByType(
    dentitionType,
    toothDiagnoses,
    previousToothDiagnoses,
  );

  const currentView: ExaminationView = "UPPER_JAW";

  return {
    currentView,
    dentition,
    currentFocus: undefined,
    dmftValues: calculateDmftValuesByDentitionType(dentition),
    previousToothDiagnoses,
    dirty: false,
    hasResult: hasAnyResult(dentition),
  };
}

export function createExaminationStore(initialState: ExaminationState) {
  return createStore<ExaminationStore>()((set, get) => ({
    ...initialState,
    setView: (newView: ExaminationView) => set({ currentView: newView }),
    addTooth: (toothContext: ToothContext) => {
      set((state) => addTooth(toothContext, state.dentition));
    },
    removeTooth: (toothContext: ToothContext) => {
      set((state) => removeTooth(toothContext, state.dentition));
    },
    toggleToothType: (toothContext: ToothContext) => {
      set((state) =>
        toggleToothType(
          toothContext,
          state.dentition,
          state.previousToothDiagnoses,
        ),
      );
    },
    setFocus: (newFocus: ElementContext | undefined) => {
      set(setFocus(newFocus));
    },
    setMainResult: (toothContext: ToothContext, newValue: string) =>
      set((state) => setMainResult(toothContext, newValue, state)),
    setSecondaryResult1: (toothContext: ToothContext, newValue: string) =>
      set((state) => setSecondaryResult1(toothContext, newValue, state)),
    setSecondaryResult2: (toothContext: ToothContext, newValue: string) =>
      set((state) => setSecondaryResult2(toothContext, newValue, state)),
    submit: () => submit(get(), set),
    navigateFrom: (direction) => set((state) => navigateFrom(direction, state)),
    navigateTo: (toothContext) =>
      set((state) => navigateTo(toothContext, "auto", state)),
    toggleDentition: (dentitionType) =>
      set(() => ({
        dentition: createDentitionByType(dentitionType),
      })),
  }));
}
