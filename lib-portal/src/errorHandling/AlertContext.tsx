/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  Fragment,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { doNothing, isDefined } from "remeda";

import { Alert, AlertProps } from "../components/Alert";
import { useNavigateEffect } from "../hooks/useNavigateEffect";
import { useUuid } from "../hooks/useUuid";
import { RequiresChildren } from "../types/react";

interface AlertContextValue {
  alerts: AlertInstance[];
  open: (alertId: string, props: AlertProps, options?: AlertOptions) => void;
  close: (alertid?: string) => void;
}

interface AlertInstance {
  alertId: string;
  props: AlertProps;
  options: AlertOptions;
}

interface AlertOptions {
  closeable?: boolean;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertContextProvider(props: RequiresChildren) {
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);

  const contextValue = useMemo(() => {
    function open(
      alertId: string,
      props: AlertProps,
      options: AlertOptions = {},
    ): void {
      setAlerts((prevAlerts) => {
        const alertIndex = prevAlerts.findIndex(
          (alert) => alert.alertId === alertId,
        );
        const alertInstance: AlertInstance = {
          alertId,
          props,
          options,
        };

        if (alertIndex >= 0) {
          // replace previous alert
          return prevAlerts.toSpliced(alertIndex, 1, alertInstance);
        } else {
          // insert alert at the start
          return [alertInstance, ...prevAlerts];
        }
      });
    }

    function close(alertId?: string): void {
      if (
        alerts.length === 0 ||
        (isDefined(alertId) &&
          alerts.every((alert) => alert.alertId !== alertId))
      ) {
        return;
      }

      // close all alerts
      if (alertId === undefined) {
        setAlerts([]);
        return;
      }

      // close specified alert
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.alertId !== alertId),
      );
    }

    return {
      alerts,
      open,
      close,
    };
  }, [alerts, setAlerts]);

  // close alert after navigation
  useNavigateEffect(() => contextValue.close());

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

/**
 * Creates an alert instance to open alerts of different types
 */
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
    isOpen: alertContext.alerts.some((alert) => alert.alertId === alertId),
    notification: (options) => openWithColor("primary", options),
    warning: (options) => openWithColor("warning", options),
    error: (options) => openWithColor("danger", options),
    close,
  };
}

interface UseControlledAlertOptions extends AlertOpenOptions {
  type: AlertType;
  open: boolean;
}

type AlertType = "notification" | "warning" | "error";

/**
 * Creates a controlled alert instance which automatically opens and closes itself
 */
export function useControlledAlert(options: UseControlledAlertOptions): void {
  const { type, open, ...alertOptions } = options;
  const alert = useAlert();

  useEffect(() => {
    if (open === alert.isOpen) {
      return;
    }

    if (open) {
      alert[type](alertOptions);
    } else {
      alert.close();
    }
  }, [open, type, alertOptions, alert]);
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
  const { container, ...commonAlertProps } = props;
  const alertContext = useContext(AlertContext);

  if (alertContext === null) {
    return null;
  }

  const alerts = alertContext.alerts ?? [];

  if (alerts.length === 0) {
    return null;
  }

  const Container = container ?? Fragment;
  return (
    <Container>
      {alerts.map((alert) => (
        <Alert
          {...commonAlertProps}
          {...alert.props}
          key={alert.alertId}
          onClose={
            alert.options.closeable
              ? () => alertContext.close(alert.alertId)
              : undefined
          }
        />
      ))}
    </Container>
  );
}
