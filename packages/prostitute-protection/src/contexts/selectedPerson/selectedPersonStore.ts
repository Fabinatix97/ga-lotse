/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createStore } from "zustand";

import { ApiProstituteProtectionProcedureSearchOverview } from "@eshg/prostitute-protection-api";

export interface SelectedPersonState {
  firstName: string;
  lastName: string;
  id: string;
  dateOfBirth: Date;
}

interface SelectedPersonActions {
  setSelectedPerson: (
    procedure: ApiProstituteProtectionProcedureSearchOverview,
  ) => void;
  updateSelectedPerson: (data: SelectedPersonState) => void;
}

export type SelectedPersonStore = SelectedPersonState & SelectedPersonActions;

export function initSelectedPersonStore(): SelectedPersonState {
  return {
    firstName: "",
    lastName: "",
    id: "",
    dateOfBirth: new Date(),
  };
}

export function createSelectedPersonStore(initialState: SelectedPersonState) {
  return createStore<SelectedPersonStore>()((set) => ({
    ...initialState,
    setSelectedPerson: (procedure) =>
      set({
        firstName: procedure.firstName,
        lastName: procedure.lastName,
        id: procedure.id,
        dateOfBirth: procedure.dateOfBirth,
      }),
    updateSelectedPerson: (data) => set(data),
  }));
}
