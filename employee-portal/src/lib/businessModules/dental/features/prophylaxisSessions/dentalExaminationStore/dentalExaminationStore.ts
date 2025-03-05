/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDentitionType } from "@eshg/dental-api";
import {
  ExaminationResult,
  ToothDiagnoses,
} from "@eshg/dental/api/models/ExaminationResult";
import { createStore } from "zustand";

import {
  calculateDmftValue,
  setMainResult,
  setSecondaryResult1,
  setSecondaryResult2,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/actions/result";

import { NavigateDirection, navigate } from "./actions/navigate";
import { navigateTo } from "./actions/navigateTo";
import {
  addTooth,
  getToothDiagnoses,
  removeTooth,
  setFocus,
  toggleToothType,
} from "./actions/tooth";
import { createPrimaryDentition, createSecondaryDentition } from "./factories";
import {
  DentalExaminationView,
  Dentition,
  ElementContext,
  ToothContext,
} from "./types";

export interface DentalExaminationState {
  currentView: DentalExaminationView;
  currentFocus: ElementContext;
  dentition: Dentition;
  dmftValues: { primaryTeeth: number; secondaryTeeth: number };
}

export interface DentalExaminationActions {
  setView: (newView: DentalExaminationView) => void;
  setFocus: (focus: ElementContext) => void;
  navigate: (direction: NavigateDirection) => void;
  navigateTo: (toothContext: ToothContext) => void;

  addTooth: ToothAction;
  removeTooth: ToothAction;
  toggleToothType: ToothAction;

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

export type DmftValuesState = Pick<DentalExaminationState, "dmftValues">;

export function calculateDmftValues(dentition: Dentition) {
  return {
    primaryTeeth: calculateDmftValue(dentition, "PRIMARY_TOOTH"),
    secondaryTeeth: calculateDmftValue(dentition, "SECONDARY_TOOTH"),
  };
}

export function initDentalExaminationStore(
  examinationResult: ExaminationResult | undefined,
  defaultDentitionType: ApiDentitionType | undefined,
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
  const dentition =
    dentitionType === ApiDentitionType.Primary
      ? createPrimaryDentition(toothDiagnoses, previousToothDiagnoses)
      : createSecondaryDentition(toothDiagnoses, previousToothDiagnoses);

  return {
    currentView: "UPPER_JAW",
    dentition: dentition,
    currentFocus: {
      toothContext: { quadrantNumber: "Q1", toothIndex: 0 },
      field: "main",
    },
    dmftValues: calculateDmftValues(dentition),
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
      set((state) => removeTooth(toothContext, state.dentition));
    },
    toggleToothType: (toothContext: ToothContext) => {
      set((state) => ({
        dentition: toggleToothType(toothContext, state.dentition),
      }));
    },
    setFocus: (newFocus: ElementContext) => {
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
  }));
}
