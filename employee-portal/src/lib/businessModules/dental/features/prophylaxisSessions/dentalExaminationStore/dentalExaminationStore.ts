/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable unused-imports/no-unused-vars */
import {
  ExaminationResult,
  ToothDiagnoses,
} from "@eshg/dental/api/models/ExaminationResult";
import { createStore } from "zustand";

import {
  addTooth,
  getToothDiagnoses,
  setFocus,
  setMainResult,
  setSecondaryResult1,
  setSecondaryResult2,
} from "./actions";
import { createSecondaryDentition } from "./factories";
import { DentalExaminationView, Dentition, Focus, ToothContext } from "./types";

export interface DentalExaminationState {
  currentView: DentalExaminationView;
  dentition: Dentition;
  focus: Focus;
}

export interface DentalExaminationActions {
  setView: (newView: DentalExaminationView) => void;

  addTooth: ToothAction;
  removeTooth: ToothAction;
  toggleToothType: ToothAction;
  setFocus: (focus: Focus) => void;

  setMainResult: SetToothResultAction;
  setSecondaryResult1: SetToothResultAction;
  setSecondaryResult2: SetToothResultAction;
  getToothDiagnoses: () => ToothDiagnoses;
}

export type ToothAction = (toothContext: ToothContext) => void;
export type SetToothResultAction = (
  toothContext: ToothContext,
  newValue: string,
) => void;

export type DentalExaminationStore = DentalExaminationState &
  DentalExaminationActions;

export function initDentalExaminationStore(
  examinationResult: ExaminationResult | undefined,
): DentalExaminationState {
  const toothDiagnoses =
    examinationResult?.type === "screening"
      ? examinationResult.toothDiagnoses
      : {};

  return {
    currentView: "UPPER_JAW",
    // TODO ISSUE-6584: distinguish between type of dentition
    dentition: createSecondaryDentition(toothDiagnoses),
    focus: {
      toothContext: { quadrantNumber: "Q1", toothIndex: 0 },
      field: "main",
    },
  };
}

export function createDentalExaminationStore(
  initialState: DentalExaminationState,
) {
  return createStore<DentalExaminationStore>()((set, get) => ({
    ...initialState,
    setView: (newView: DentalExaminationView) => set({ currentView: newView }),
    addTooth: (toothContext: ToothContext) => {
      set((state) => ({
        dentition: addTooth(toothContext, state.dentition),
      }));
    },
    removeTooth: (toothContext: ToothContext) => {
      throw new Error("Not yet implemented");
    },
    toggleToothType: (toothContext: ToothContext) => {
      throw new Error("Not yet implemented");
    },
    setFocus: (focus: Focus) => {
      set(setFocus(focus));
    },
    setMainResult: (toothContext: ToothContext, newValue: string) =>
      set((state) => ({
        dentition: setMainResult(toothContext, newValue, state.dentition),
      })),
    setSecondaryResult1: (toothContext: ToothContext, newValue: string) =>
      set((state) => ({
        dentition: setSecondaryResult1(toothContext, newValue, state.dentition),
      })),
    setSecondaryResult2: (toothContext: ToothContext, newValue: string) =>
      set((state) => ({
        dentition: setSecondaryResult2(toothContext, newValue, state.dentition),
      })),
    getToothDiagnoses: () => getToothDiagnoses(get().dentition),
  }));
}
