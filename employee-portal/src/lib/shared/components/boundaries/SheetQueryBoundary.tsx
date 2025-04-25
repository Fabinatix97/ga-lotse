/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Sheet, Stack, Typography } from "@mui/joy";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useId } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { ErrorAlert } from "@eshg/lib-portal/errorHandling/ErrorAlert";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { LoadingSheet } from "@/lib/shared/components/LoadingSheet";

interface SheetQueryBoundaryProps extends RequiresChildren {
  loadingText: string;
  title: string;
}

export function SheetQueryBoundary(props: SheetQueryBoundaryProps) {
  return (
    <QueryBoundary>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorSheet
            title={props.title}
            error={error as unknown}
            onReset={resetErrorBoundary}
          />
        )}
      >
        <Suspense fallback={<LoadingSheet title={props.loadingText} />}>
          {props.children}
        </Suspense>
      </ErrorBoundary>
    </QueryBoundary>
  );
}

function ErrorSheet({
  title,
  error,
  onReset,
}: {
  title: string;
  error: unknown;
  onReset: () => void;
}) {
  const { reset } = useQueryErrorResetBoundary();
  const id = useId();

  function handleReset() {
    reset();
    onReset();
  }

  return (
    <Sheet component="section" aria-labelledby={id}>
      <Stack gap={2}>
        <Typography level="h3" component="h2" id={id}>
          {title}
        </Typography>
        <ErrorAlert error={error} onReset={handleReset} />
      </Stack>
    </Sheet>
  );
}
