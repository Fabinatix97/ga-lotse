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

import { calculateDmftValuesByDentitionType } from "./actions/dmftValues";
import { initFocus, setFocus } from "./actions/focus";
import { NavigateDirection, navigateFrom } from "./actions/navigateFrom";
import { navigateTo } from "./actions/navigateTo";
import {
  hasAnyResult,
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
  DmftValues,
  ElementContext,
  ToothContext,
} from "./types";

export interface DentalExaminationState {
  currentView: DentalExaminationView;
  currentFocus: ElementContext | undefined;
  dentition: Dentition;
  dmftValues: DmftValuesByDentitionType;
  previousToothDiagnoses: Partial<Record<ApiTooth, ToothDiagnosis>>;
  dirty: boolean;
  hasResult: boolean;
}

export interface DentalExaminationActions {
  setView: (newView: DentalExaminationView) => void;
  setFocus: (focus: ElementContext | undefined) => void;
  navigateFrom: (direction: NavigateDirection) => void;
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
export type HasResultState = Pick<DentalExaminationState, "hasResult">;

export interface DmftValuesByDentitionType {
  primaryTeeth: DmftValues;
  secondaryTeeth: DmftValues;
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
    dmftValues: calculateDmftValuesByDentitionType(dentition),
    previousToothDiagnoses,
    dirty: false,
    hasResult: hasAnyResult(dentition),
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
    navigateFrom: (direction) => set((state) => navigateFrom(direction, state)),
    navigateTo: (toothContext) =>
      set((state) => navigateTo(toothContext, state)),
    toggleDentition: (dentitionType) =>
      set(() => ({
        dentition: DENTITION_FACTORIES[dentitionType]({}, {}),
      })),
  }));
}
