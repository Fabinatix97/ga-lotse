/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { RequiresChildren } from "@eshg/lib-portal";

import {
  type SelectedPersonStore,
  createSelectedPersonStore,
  initSelectedPersonStore,
} from "./selectedPersonStore";

type SelectedPersonStoreApi = ReturnType<typeof createSelectedPersonStore>;

const SelectedPersonStoreContext = createContext<SelectedPersonStoreApi | null>(
  null,
);

export function SelectedPersonStoreProvider({ children }: RequiresChildren) {
  const [store] = useState(() =>
    createSelectedPersonStore(initSelectedPersonStore()),
  );

  return (
    <SelectedPersonStoreContext value={store}>
      {children}
    </SelectedPersonStoreContext>
  );
}

export function useSelectedPersonStore<T>(
  selector: (store: SelectedPersonStore) => T,
): T {
  const selectedPersonStoreContext = useContext(SelectedPersonStoreContext);

  if (selectedPersonStoreContext === null) {
    throw new Error("Missing SelectedPersonStoreProvider");
  }

  return useStore(selectedPersonStoreContext, selector);
}

export function useSelectedPerson() {
  return useSelectedPersonStore(
    useShallow((state) => ({
      firstName: state.firstName,
      lastName: state.lastName,
      id: state.id,
      dateOfBirth: state.dateOfBirth,
    })),
  );
}

export function useSetSelectedPerson() {
  return useSelectedPersonStore((state) => state.setSelectedPerson);
}

export function useUpdateSelectedPerson() {
  return useSelectedPersonStore((state) => state.updateSelectedPerson);
}
