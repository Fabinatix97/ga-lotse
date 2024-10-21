/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

import { ActionButtonProps } from "../components/Alert";

import { useResetAlertContext } from "./AlertContext";
import { PortalErrorCode } from "./PortalErrorCode";

interface ErrorDescription {
  title: string;
  message: string;
}

/**
 * The errors messages are documented in the Wiki, please keep them up-to-date there
 *
 * see [internal gitlab link]
 */
const ERROR_DESCRIPTION: Record<PortalErrorCode, ErrorDescription> = {
  [PortalErrorCode.NotFound]: {
    title: "Nicht gefunden",
    message: "Die Ressource existiert nicht.",
  },
  [PortalErrorCode.Timeout]: {
    title: "Zeitüberschreitung",
    message: "Beim Warten auf eine Antwort kam es zu einer Zeitüberschreitung.",
  },
  [PortalErrorCode.Conflict]: {
    title: "Konflikt",
    message:
      "Die Ressource wurde in der Zwischenzeit geändert und ist veraltet.",
  },
  [PortalErrorCode.Unauthorized]: {
    title: "Anmeldung notwendig",
    message: "Die aktuelle Sitzung ist abgelaufen.",
  },
  [PortalErrorCode.InsufficientUserRights]: {
    title: "Zugriff verweigert",
    message:
      "Sie haben nicht die notwendigen Rechte, um auf diese Ressource zuzugreifen.",
  },
  [PortalErrorCode.AlreadyExists]: {
    title: "Existiert bereits",
    message: "Die Ressource existiert bereits.",
  },
  [PortalErrorCode.UnexpectedError]: {
    title: "Unerwarteter Fehler",
    message: "Es ist ein unerwarteter Fehler aufgetreten.",
  },
  [PortalErrorCode.NonconformPdf]: {
    title: "Nonkonformes PDF",
    message: "Die ausgewählte Datei ist nicht PDF/A konform.",
  },
  [PortalErrorCode.InvalidFile]: {
    title: "Ungültige Datei",
    message: "Die übermittelte Datei war in einem ungültigen Format.",
  },
  [PortalErrorCode.Corrupt]: {
    title: "Daten korrupt",
    message:
      "Die angefragten Daten sind korrupt. Bitte wenden Sie sich an Ihren Administrator.",
  },
  [PortalErrorCode.Locked]: {
    title: "Daten gesperrt",
    message: "Die angefragten Daten sind von einem anderen Nutzer gesperrt.",
  },
};

export function getErrorDescription(
  errorCode: PortalErrorCode,
): ErrorDescription {
  return ERROR_DESCRIPTION[errorCode];
}

export function getErrorMessage(errorCode: PortalErrorCode): string {
  return getErrorDescription(errorCode).message;
}

type ErrorAction = (buttonProps: ActionButtonProps) => ReactNode;

export function getErrorAction(
  errorCode: PortalErrorCode,
  onReset?: () => void,
): ErrorAction | undefined {
  switch (errorCode) {
    case PortalErrorCode.Timeout:
    case PortalErrorCode.UnexpectedError:
      return renderRetryButton(onReset);
    case PortalErrorCode.Conflict:
      return ReloadButton;
    case PortalErrorCode.Unauthorized:
      return LoginButton;
    default:
      return undefined;
  }
}

function renderRetryButton(onReset: (() => void) | undefined) {
  if (onReset === undefined) {
    return undefined;
  }

  return function renderButton(buttonProps: ActionButtonProps) {
    return (
      <Button {...buttonProps} onClick={onReset}>
        Erneut versuchen
      </Button>
    );
  };
}

interface ReloadButtonProps extends ActionButtonProps, PropsWithChildren {}

function ReloadButton(props: ReloadButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetAlertContext = useResetAlertContext();
  const { children, ...buttonProps } = props;

  function handleReload() {
    resetAlertContext();
    void queryClient.invalidateQueries();
    router.refresh();
  }

  return (
    <Button onClick={handleReload} {...buttonProps}>
      {children ?? "Neu laden"}
    </Button>
  );
}

function LoginButton(props: Omit<ReloadButtonProps, "children">) {
  return <ReloadButton {...props}>Neu anmelden</ReloadButton>;
}
