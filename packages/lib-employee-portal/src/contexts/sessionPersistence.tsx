/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

interface SessionPersistenceContext {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
  delete: (key: string) => void;
}

const SessionPersistenceContext =
  createContext<SessionPersistenceContext | null>(null);

export function SessionPersistenceProvider(props: RequiresChildren) {
  const [data] = useState(new Map<string, unknown>());
  const context = useMemo(
    () => ({
      get: (key: string) => data.get(key),
      set: (key: string, value: unknown) => data.set(key, value),
      delete: (key: string) => data.delete(key),
    }),
    [data],
  );

  return (
    <SessionPersistenceContext.Provider value={context}>
      {props.children}
    </SessionPersistenceContext.Provider>
  );
}

export function useSessionPersistence<Value>(props: {
  key: string;
  initialValue: Value;
}) {
  const context = useContext(SessionPersistenceContext);

  if (!context) {
    throw new Error("Missing SessionPersistenceContext");
  }

  useEffect(() => {
    if (context.get(props.key) === undefined) {
      context.set(props.key, props.initialValue);
    }
  }, [context, props]);

  return useMemo(
    () => ({
      get: () => context.get(props.key) as Value,
      set: (value: Value) => context.set(props.key, value),
      clear: () => context.delete(props.key),
    }),
    [context, props],
  );
}
