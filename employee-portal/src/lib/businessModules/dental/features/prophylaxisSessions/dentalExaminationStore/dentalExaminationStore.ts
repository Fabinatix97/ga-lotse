/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ExaminationResult,
  ToothDiagnoses,
  ToothDiagnosis,
} from "@eshg/dental";
import { ApiDentitionType, ApiTooth } from "@eshg/dental-api";
import { createStore } from "zustand";

import { initFocus, setFocus } from "./actions/focus";
import { NavigateDirection, navigate } from "./actions/navigate";
import { navigateTo } from "./actions/navigateTo";
import {
  calculateDmftValue,
  setMainResult,
  setSecondaryResult1,
  setSecondaryResult2,
} from "./actions/result";
import {
  addTooth,
  getToothDiagnoses,
  removeTooth,
  toggleToothType,
} from "./actions/tooth";
import { DENTITION_FACTORIES } from "./factories";
import {
  DentalExaminationView,
  Dentition,
  ElementContext,
  ToothContext,
} from "./types";

export interface DentalExaminationState {
  currentView: DentalExaminationView;
  currentFocus: ElementContext | undefined;
  dentition: Dentition;
  dmftValues: { primaryTeeth: number; secondaryTeeth: number };
  previousToothDiagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>;
  dirty: boolean;
}

export interface DentalExaminationActions {
  setView: (newView: DentalExaminationView) => void;
  setFocus: (focus: ElementContext | undefined) => void;
  navigate: (direction: NavigateDirection) => void;
  navigateTo: (toothContext: ToothContext) => void;

  addTooth: ToothAction;
  removeTooth: ToothAction;
  toggleToothType: ToothAction;

  setMainResult: SetToothResultAction;
  setSecondaryResult1: SetToothResultAction;
  setSecondaryResult2: SetToothResultAction;
  getToothDiagnoses: () => ToothDiagnoses;

  toggleDentition: (dentitionType: ApiDentitionType) => void;
}

export type ToothAction = (toothContext: ToothContext) => void;
export type SetToothResultAction = (
  toothContext: ToothContext,
  newValue: string,
) => void;

export type DentalExaminationStore = DentalExaminationState &
  DentalExaminationActions;

export type DmftValuesState = Pick<DentalExaminationState, "dmftValues">;
export type DirtyState = Pick<DentalExaminationState, "dirty">;

export function calculateDmftValues(dentition: Dentition) {
  return {
    primaryTeeth: calculateDmftValue(dentition, "PRIMARY_TOOTH"),
    secondaryTeeth: calculateDmftValue(dentition, "SECONDARY_TOOTH"),
  };
}

export function initDentalExaminationStore(
  examinationResult: ExaminationResult | undefined,
  defaultDentitionType: ApiDentitionType = ApiDentitionType.Mixed,
  previousExaminationResult: ExaminationResult | undefined,
): DentalExaminationState {
  const isScreening = examinationResult?.type === "screening";
  const previousWasScreening = previousExaminationResult?.type === "screening";

  const toothDiagnoses = isScreening ? examinationResult.toothDiagnoses : {};
  const previousToothDiagnoses = previousWasScreening
    ? previousExaminationResult.toothDiagnoses
    : {};

  const dentitionType =
    (isScreening ? examinationResult.dentitionType : undefined) ??
    defaultDentitionType;
  const dentition = DENTITION_FACTORIES[dentitionType](
    toothDiagnoses,
    previousToothDiagnoses,
  );

  const currentView: DentalExaminationView = "UPPER_JAW";

  return {
    currentView,
    dentition,
    currentFocus: initFocus(currentView, dentition.Q1, "FIRST_TOOTH"),
    dmftValues: calculateDmftValues(dentition),
    previousToothDiagnoses,
    dirty: false,
  };
}

export function createDentalExaminationStore(
  initialState: DentalExaminationState,
) {
  return createStore<DentalExaminationStore>()((set, get) => ({
    ...initialState,
    setView: (newView: DentalExaminationView) => set({ currentView: newView }),
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
    getToothDiagnoses: () => getToothDiagnoses(get().dentition),
    navigate: (direction) => set((state) => navigate(direction, state)),
    navigateTo: (toothContext) =>
      set((state) => navigateTo(toothContext, state)),
    toggleDentition: (dentitionType) =>
      set(() => ({
        dentition: DENTITION_FACTORIES[dentitionType]({}, {}),
      })),
  }));
}
