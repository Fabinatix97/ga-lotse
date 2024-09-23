/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { Alert, AlertProps } from "../components/Alert";
import { RequiresChildren } from "../types/react";

interface AlertContextValue {
  alert: AlertValue;
  setAlert: (alert: AlertValue) => void;
}

export type AlertValue = AlertProps | null;

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertContextProvider(props: RequiresChildren) {
  const [alert, setAlert] = useState<AlertValue>(null);

  const contextValue = useMemo(() => ({ alert, setAlert }), [alert, setAlert]);

  return (
    <AlertContext.Provider value={contextValue}>
      {props.children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}

export function useAlert() {
  const alertContext = useContext(AlertContext);
  return alertContext !== null ? alertContext.alert : null;
}

type ScopedAlertProps = Pick<AlertProps, "sx">;

export function ScopedAlert(props: ScopedAlertProps) {
  const alert = useAlert();
  return alert === null ? null : <Alert {...props} {...alert} />;
}
