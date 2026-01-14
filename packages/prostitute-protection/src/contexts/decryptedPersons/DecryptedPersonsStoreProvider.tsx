/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { RequiresChildren } from "@eshg/lib-portal";

import {
  type DecryptedPersonsStore,
  createDecryptedPersonsStore,
} from "./decryptedPersonsStore";

type DecryptedPersonsStoreApi = ReturnType<typeof createDecryptedPersonsStore>;

const DecryptedPersonsStoreContext =
  createContext<DecryptedPersonsStoreApi | null>(null);

export function DecryptedPersonsStoreProvider({ children }: RequiresChildren) {
  const [store] = useState(() => createDecryptedPersonsStore());

  return (
    <DecryptedPersonsStoreContext value={store}>
      {children}
    </DecryptedPersonsStoreContext>
  );
}

export function useDecryptedPersonsStore<T>(
  selector: (store: DecryptedPersonsStore) => T,
): T {
  const decryptedPersonsStoreContext = useContext(DecryptedPersonsStoreContext);

  if (decryptedPersonsStoreContext === null) {
    throw new Error("Missing DecryptedPersonsStoreProvider");
  }

  return useStore(decryptedPersonsStoreContext, selector);
}

export function useDecryptedPersons() {
  return useDecryptedPersonsStore(
    useShallow((state) => ({
      addDecryptedPerson: state.addDecryptedPerson,
      getDecryptedPerson: state.getDecryptedPerson,
    })),
  );
}
