/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorAlert } from "../../errorHandling/ErrorAlert";

export interface NextErrorBoundaryProps {
  error: NextError;
  reset: () => void;
}

interface NextError extends Error {
  digest?: string;
}

export function NextErrorBoundary(props: NextErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  function handleReset() {
    props.reset();
    reset();
  }

  return (
    <ErrorAlert
      error={props.error}
      digest={props.error.digest}
      onReset={handleReset}
    />
  );
}
