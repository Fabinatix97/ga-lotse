/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
import { ApiCreateAppointmentsBulkResponse } from "@eshg/school-entry-api";

interface UseBulkAppointmentCreationMessageResult {
  open: (response: ApiCreateAppointmentsBulkResponse) => void;
  close: () => void;
}

export function useBulkAppointmentCreationMessage(): UseBulkAppointmentCreationMessageResult {
  const snackbar = useSnackbar();
  const alert = useAlert();

  function open(response: ApiCreateAppointmentsBulkResponse): void {
    if (response.numCreated > 0) {
      if (response.numUnmodified === 0 && response.numError === 0) {
        snackbar.confirmation(createdMessage(response.numCreated));
      } else {
        alert.warning({
          title: "Terminzuweisung teilweise fehlgeschlagen",
          message: (
            <>
              {createdMessage(response.numCreated)}
              {unmodifiedMessage(response.numUnmodified)}
              {errorMessage(response.numError)}
            </>
          ),
          closeable: true,
        });
      }
    } else {
      alert.error({
        title: "Es konnten keine Termine vergeben werden.",
        message: (
          <>
            {unmodifiedMessage(response.numUnmodified)}
            {errorMessage(response.numError)}
          </>
        ),
        closeable: true,
      });
    }
  }

  function close(): void {
    alert.close();
  }

  return { open, close };
}

function createdMessage(numCreated: number) {
  const message =
    numCreated === 1
      ? `Es wurde ${numCreated} Termin vergeben.`
      : `Es wurden ${numCreated} Termine vergeben.`;
  return <p>{message}</p>;
}

function unmodifiedMessage(numUnmodified: number) {
  if (numUnmodified === 0) {
    return "";
  }
  const message =
    numUnmodified === 1
      ? `${numUnmodified} Vorgang hatte bereits einen Termin.`
      : `${numUnmodified} Vorgänge hatten bereits Termine.`;

  return <p>{message}</p>;
}

function errorMessage(numError: number) {
  if (numError === 0) {
    return "";
  }

  const message =
    numError === 1
      ? `Bei ${numError} Vorgang ist ein Fehler aufgetreten.`
      : `Bei ${numError} Vorgängen sind Fehler aufgetreten.`;

  return (
    <>
      <p>{message}</p>
      <p>
        Bitte stellen Sie sicher, dass ausreichend freie Termine verfügbar sind,
        die weit genug in der Zukunft liegen.
      </p>
    </>
  );
}
