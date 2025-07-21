/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createStore } from "zustand";

import { ApiDentitionType } from "@eshg/dental-api";

import {
  ExaminationResult,
  ScreeningExaminationResultWithDate,
  ToothDiagnoses,
} from "../../api/models/ExaminationResult";

import { calculateDmftValuesByDentitionType } from "./actions/dmftValues";
import { setFocus } from "./actions/focus";
import { NavigateDirection, navigateFrom } from "./actions/navigateFrom";
import {
  hasAnyResult,
  setMainResult,
  setSecondaryResult,
} from "./actions/result";
import { SubmitResult, submit } from "./actions/submit";
import { addTooth, removeTooth, toggleToothType } from "./actions/tooth";
import { createDentitionByType } from "./factories";
import { Dentition, DmftValues, ElementContext, ToothContext } from "./types";

export interface ExaminationState {
  currentFocus: ElementContext | undefined;
  dentition: Dentition;
  dmftValues: DmftValuesByDentitionType;
  previousToothDiagnoses: ToothDiagnoses;
  dirty: boolean;
  hasResult: boolean;
}

interface ExaminationActions {
  setFocus: (focus: ElementContext | undefined) => void;
  navigateFrom: (direction: NavigateDirection) => void;

  addTooth: ToothActionWithFocusChange;
  removeTooth: ToothAction;
  toggleToothType: ToothActionWithFocusChange;

  setMainResult: SetToothResultAction;
  setSecondaryResult: SetToothResultAction;
  submit: () => SubmitResult;

  toggleDentition: (dentitionType: ApiDentitionType) => void;
}

export type ToothAction = (toothContext: ToothContext) => void;
export type ToothActionWithFocusChange = (
  toothContext: ToothContext,
  focusMainResult: boolean,
) => void;
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
  previousExaminationResult: ScreeningExaminationResultWithDate | undefined,
): ExaminationState {
  const isScreening = examinationResult?.type === "screening";
  const previousWasScreening =
    previousExaminationResult?.result?.type === "screening";

  const toothDiagnoses = isScreening ? examinationResult.toothDiagnoses : {};
  const previousToothDiagnoses = previousWasScreening
    ? previousExaminationResult.result.toothDiagnoses
    : {};

  const dentitionType =
    (isScreening ? examinationResult.dentitionType : undefined) ??
    defaultDentitionType;
  const dentition = createDentitionByType(
    dentitionType,
    toothDiagnoses,
    previousToothDiagnoses,
  );

  return {
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
    addTooth: (toothContext: ToothContext, focusMainResult: boolean) => {
      set((state) => addTooth(toothContext, focusMainResult, state));
    },
    removeTooth: (toothContext: ToothContext) => {
      set((state) => removeTooth(toothContext, state.dentition));
    },
    toggleToothType: (toothContext: ToothContext, focusMainResult: boolean) => {
      set((state) =>
        toggleToothType(
          toothContext,
          focusMainResult,
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
    setSecondaryResult: (toothContext: ToothContext, newValue: string) =>
      set((state) => setSecondaryResult(toothContext, newValue, state)),
    submit: () => submit(get(), set),
    navigateFrom: (direction) => set((state) => navigateFrom(direction, state)),
    toggleDentition: (dentitionType: ApiDentitionType) =>
      set((state) => ({
        dentition: createDentitionByType(
          dentitionType,
          {},
          state.previousToothDiagnoses,
        ),
      })),
  }));
}
