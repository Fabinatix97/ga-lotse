/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useRouter } from "next/navigation";
import { isDefined } from "remeda";

import { Alert, AlertProps } from "../components/Alert";

import { getErrorAction, getErrorDescription } from "./errorMappers";
import { resolveError } from "./errorResolvers";

function useRefreshPage() {
  const router = useRouter();
  return () => router.refresh();
}

interface ErrorAlertProps extends Pick<AlertProps, "sx"> {
  error: unknown;
  digest?: string;
  onReset?: () => void;
}

export function ErrorAlert(props: ErrorAlertProps) {
  const refreshPage = useRefreshPage();
  const { errorCode } = resolveError(props.error);
  const { title, message } = getErrorDescription(errorCode);
  const messageWithDigest = isDefined(props.digest)
    ? `${message} (Digest: ${props.digest})`
    : message;
  const action = getErrorAction(errorCode, props.onReset ?? refreshPage);

  return (
    <Alert
      color="danger"
      title={title}
      message={messageWithDigest}
      action={action}
      sx={props.sx}
    />
  );
}
