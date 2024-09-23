/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { LoadingOverlay } from "@/lib/shared/components/LoadingOverlay";
import { ErrorModal } from "@/lib/shared/components/boundaries/ErrorModal";

interface OverlayBoundaryProps extends RequiresChildren {
  fallbackTitle?: string;
  loadingText?: string;
}

export function OverlayBoundary(props: OverlayBoundaryProps) {
  return (
    <QueryBoundary>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorModal
            error={error as unknown}
            title={props.fallbackTitle}
            onReset={resetErrorBoundary}
          />
        )}
      >
        <Suspense fallback={<LoadingOverlay text={props.loadingText} />}>
          {props.children}
        </Suspense>
      </ErrorBoundary>
    </QueryBoundary>
  );
}
