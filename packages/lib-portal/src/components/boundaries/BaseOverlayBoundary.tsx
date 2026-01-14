/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { RequiresChildren } from "../../types/react";
import { LoadingOverlayHiddenBackdrop } from "../LoadingOverlayHiddenBackdrop";

import { ErrorModalProps } from "./BaseErrorModal";
import { QueryBoundary } from "./QueryBoundary";

export interface BaseOverlayBoundaryProps extends RequiresChildren {
  fallbackTitle?: string;
  loadingText?: string;
  fallbackErrorModal: (props: ErrorModalProps) => ReactNode;
}

export function BaseOverlayBoundary(props: BaseOverlayBoundaryProps) {
  const FallbackErrorModal = props.fallbackErrorModal;

  return (
    <QueryBoundary>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <FallbackErrorModal
            error={error as unknown}
            title={props.fallbackTitle}
            onReset={resetErrorBoundary}
          />
        )}
      >
        <Suspense
          fallback={<LoadingOverlayHiddenBackdrop text={props.loadingText} />}
        >
          {props.children}
        </Suspense>
      </ErrorBoundary>
    </QueryBoundary>
  );
}
