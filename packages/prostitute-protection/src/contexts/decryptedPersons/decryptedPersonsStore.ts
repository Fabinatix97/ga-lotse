/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { filter, find, pipe } from "remeda";
import { createStore } from "zustand";

const MAX_PROCEDURES = 3;

export interface DecryptedPerson {
  firstName: string;
  lastName: string;
  id: string;
  dateOfBirth: Date;
}

interface DecryptedPersonsState {
  decryptedPersons: DecryptedPerson[];
}

interface DecryptedPersonsActions {
  addDecryptedPerson: (data: DecryptedPerson) => void;
  getDecryptedPerson: (id: string) => DecryptedPerson | undefined;
}

export type DecryptedPersonsStore = DecryptedPersonsState &
  DecryptedPersonsActions;

export function createDecryptedPersonsStore(
  initialState = { decryptedPersons: [] as DecryptedPerson[] },
) {
  return createStore<DecryptedPersonsStore>()((set, get) => ({
    ...initialState,
    addDecryptedPerson: (data) => {
      set((state) => {
        const arr = pipe(
          state.decryptedPersons,
          filter((item) => item.id !== data.id),
          (arr) => [...arr, data],
          (arr) =>
            arr.length > MAX_PROCEDURES ? arr.slice(-MAX_PROCEDURES) : arr,
        );

        return { decryptedPersons: arr };
      });
    },
    getDecryptedPerson: (id) =>
      find(get().decryptedPersons, (person) => person.id === id),
  }));
}
