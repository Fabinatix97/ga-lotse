/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AlertProps,
  getCloseable,
  getErrorAction,
  getErrorDescription,
  resolveError,
  useAlert,
} from "@eshg/lib-portal";

export function isConcurrentAppointmentError(error: Error) {
  return error.message.startsWith("The requested time slot does not");
}

export function useHandleConcurrentAppointment() {
  const alert = useAlert();

  return (
      alertOptions: Pick<AlertProps, "title" | "message"> & {
        action?: {
          text: string;
          onClick: () => void;
        };
      },
    ) =>
    (error: Error) => {
      if (isConcurrentAppointmentError(error)) {
        alert.error({
          ...alertOptions,
          action: alertOptions.action
            ? {
                ...alertOptions.action,
                onClick: () => {
                  alertOptions.action?.onClick();
                  alert.close();
                },
              }
            : undefined,
        });
      } else {
        const { errorCode } = resolveError(error);
        const { title, message } = getErrorDescription(errorCode);

        alert.error({
          title,
          message,
          action: getErrorAction(errorCode),
          closeable: getCloseable(errorCode),
        });
      }
      // let's just assume the alert is at the top of the page :)
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
}
