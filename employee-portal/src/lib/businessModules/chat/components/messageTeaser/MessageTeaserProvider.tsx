/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { MessageTeaser } from "@/lib/businessModules/chat/components/messageTeaser/MessageTeaser";

type ChatSnackbarType = "message" | "info";

export interface ChatSnackbarValues {
  title: string;
  text: string;
  link?: string;
  userPresence?: string;
  key: string;
  type: ChatSnackbarType;
}

type SnackbarValuesWithoutKey = Omit<ChatSnackbarValues, "key" | "type"> & {
  type?: ChatSnackbarType;
};

const SnackbarContext = createContext<{
  snackbarValues: ChatSnackbarValues | undefined;
  setSnackbar: Dispatch<SetStateAction<ChatSnackbarValues | undefined>>;
}>(null!);

export function MessageTeaserProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [snackbarValues, setSnackbar] = useState<
    ChatSnackbarValues | undefined
  >();
  const contextValues = useMemo(
    () => ({ snackbarValues, setSnackbar }),
    [snackbarValues],
  );
  return (
    <SnackbarContext.Provider value={contextValues}>
      <MessageTeaser
        snackbar={snackbarValues}
        onClose={() => setSnackbar(undefined)}
      />
      {children}
    </SnackbarContext.Provider>
  );
}

export function useMessageTeaser() {
  const context = useContext(SnackbarContext);
  if (context === null) {
    throw new Error("useSnackbar was called outside SnackbarProvider");
  }
  const { setSnackbar } = context;

  return useCallback(
    (values: SnackbarValuesWithoutKey | undefined) => {
      setSnackbar(
        values
          ? { ...values, key: uuidv4(), type: values.type ?? "message" }
          : undefined,
      );
    },
    [setSnackbar],
  );
}
