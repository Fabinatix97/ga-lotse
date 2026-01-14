/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button } from "@mui/joy";

import { ButtonBar, SidebarContent } from "@eshg/lib-employee-portal";
import {
  AlertProps,
  PortalErrorCode,
  getErrorDescription,
  resolveError,
} from "@eshg/lib-portal";

interface ImportDataErrorSidebarProps {
  error: Error;
  onClose: () => void;
  onReset: () => void;
}

export function ImportDataErrorSidebar({
  error,
  onReset,
  onClose,
}: ImportDataErrorSidebarProps) {
  const { errorCode } = resolveError(error);
  const { title, message } = getErrorDescription(errorCode);

  const isUnexpectedError = errorCode === PortalErrorCode.UnexpectedError;
  const alert: AlertProps = {
    color: "danger",
    title: title,
    message: isUnexpectedError
      ? "Bitte starten Sie den Import erneut."
      : message,
  };

  return (
    <>
      <SidebarContent title="Daten importieren" alert={alert} />
      <ButtonBar
        right={
          <>
            <Button variant="soft" color="neutral" onClick={() => onClose()}>
              Abbrechen
            </Button>
            <Button onClick={() => onReset()}>Import erneut starten</Button>
          </>
        }
      />
    </>
  );
}
