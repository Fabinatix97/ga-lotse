/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { doNothing, isDefined } from "remeda";

import { Alert, AlertProps } from "../components/Alert";
import { useUuid } from "../hooks/useUuid";
import { RequiresChildren } from "../types/react";

interface AlertContextValue {
  state: AlertState | null;
  open: (alertId: string, props: AlertProps, options?: AlertOptions) => void;
  close: (alertid?: string) => void;
}

interface AlertState {
  alertId: string;
  props: AlertProps;
  options: AlertOptions;
}

interface AlertOptions {
  closeable?: boolean;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertContextProvider(props: RequiresChildren) {
  const [state, setState] = useState<AlertState | null>(null);

  const contextValue = useMemo(() => {
    function open(
      alertId: string,
      props: AlertProps,
      options: AlertOptions = {},
    ): void {
      setState({
        alertId,
        props,
        options,
      });
    }

    function close(alertId?: string): void {
      if (state === null) {
        return;
      }

      if (isDefined(alertId) && alertId !== state.alertId) {
        return;
      }

      setState(null);
    }

    return {
      state,
      open,
      close,
    };
  }, [state, setState]);

  return (
    <AlertContext.Provider value={contextValue}>
      {props.children}
    </AlertContext.Provider>
  );
}

function useAlertContext() {
  const alertContext = useContext(AlertContext);

  if (alertContext === null) {
    throw new Error("AlertContext is not initialized");
  }

  return alertContext;
}

interface UseAlertResult {
  isOpen: boolean;
  notification: (options: AlertOpenOptions) => void;
  warning: (options: AlertOpenOptions) => void;
  error: (options: AlertOpenOptions) => void;
  close: () => void;
}

interface AlertOpenOptions
  extends Pick<AlertProps, "title" | "message" | "action">,
    AlertOptions {}

export function useAlert(): UseAlertResult {
  const alertContext = useAlertContext();
  const alertId = useUuid();

  function openWithColor(
    color: AlertProps["color"],
    options: AlertOpenOptions,
  ): void {
    const { closeable = false, ...alertProps } = options;
    alertContext.open(
      alertId,
      {
        ...alertProps,
        color,
      },
      { closeable },
    );
  }

  function close(): void {
    alertContext.close(alertId);
  }

  return {
    isOpen: alertContext.state?.alertId === alertId,
    notification: (options) => openWithColor("primary", options),
    warning: (options) => openWithColor("warning", options),
    error: (options) => openWithColor("danger", options),
    close,
  };
}

export function useResetAlertContext(): () => void {
  // TODO: replace by useAlertContext when all usages are within a QueryBoundary
  const alertContext = useContext(AlertContext);

  if (alertContext === null) {
    return doNothing;
  }

  return alertContext.close;
}

interface AlertSlotProps extends Pick<AlertProps, "sx"> {
  container?: (props: RequiresChildren) => ReactNode;
}

export function AlertSlot(props: AlertSlotProps) {
  const { container: Container, ...alertProps } = props;
  const alertContext = useContext(AlertContext);

  if (alertContext === null) {
    return null;
  }

  const alertState = alertContext.state ?? null;

  if (alertState === null) {
    return null;
  }

  const { closeable } = alertState.options;

  const alert = (
    <Alert
      {...alertProps}
      {...alertState.props}
      onClose={
        closeable ? () => alertContext.close(alertState.alertId) : undefined
      }
    />
  );

  return isDefined(Container) ? <Container>{alert}</Container> : alert;
}
