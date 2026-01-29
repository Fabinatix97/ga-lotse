/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import {
  ErrorAlert,
  LoadingOverlayHiddenBackdrop,
  QueryBoundary,
  RequiresChildren,
  findFirstInteractableChild,
} from "@eshg/lib-portal";

import {
  DrawerCloseOptions,
  DrawerFallbackOptions,
  DrawerInstance,
  useDrawerContext,
} from "../contexts/drawer";
import { useSidebarScope } from "../contexts/sidebarScope";

import { Sidebar } from "./Sidebar";
import { SidebarContent } from "./SidebarContent";

export function SidebarSlot() {
  const { state, tryClose } = useDrawerContext();
  const scopeId = useSidebarScope();
  const openDrawer = state.open;
  const sidebar =
    openDrawer?.type === "sidebar" && openDrawer?.scopeId === scopeId
      ? openDrawer
      : null;

  return (
    <Sidebar open={sidebar !== null} onClose={() => tryClose()}>
      {sidebar !== null && (
        <SidebarInstanceWithBoundary
          sidebarInstance={sidebar}
          tryClose={tryClose}
        />
      )}
    </Sidebar>
  );
}

function SidebarInstanceWithBoundary({
  sidebarInstance,
  tryClose,
}: {
  sidebarInstance: DrawerInstance;
  tryClose: (options: DrawerCloseOptions) => void;
}): ReactNode {
  const [contentElement, setContentElement] = useState<HTMLElement | null>(
    null,
  );
  useEffect(() => {
    if (contentElement) {
      findFirstInteractableChild(contentElement)?.focus();
    }
  }, [contentElement]);
  const SidebarComponent = sidebarInstance.component;
  return (
    <SidebarBoundary fallbackTitle={sidebarInstance.fallbackTitle}>
      <Box
        ref={(el: HTMLElement) => {
          setContentElement(el);
        }}
        display="contents"
      >
        <SidebarComponent onClose={(force) => tryClose({ force })} />
      </Box>
    </SidebarBoundary>
  );
}

type SidebarBoundaryProps = DrawerFallbackOptions & RequiresChildren;

function SidebarBoundary({ fallbackTitle, children }: SidebarBoundaryProps) {
  return (
    <QueryBoundary>
      <ErrorBoundary
        fallbackRender={(fallbackProps) => (
          <SidebarError {...fallbackProps} fallbackTitle={fallbackTitle} />
        )}
      >
        <Suspense fallback={<SidebarLoading fallbackTitle={fallbackTitle} />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </QueryBoundary>
  );
}

type SidebarErrorProps = FallbackProps & DrawerFallbackOptions;

function SidebarError({
  fallbackTitle,
  error,
  resetErrorBoundary,
}: SidebarErrorProps) {
  const { reset: resetQueryError } = useQueryErrorResetBoundary();

  function handleReset(): void {
    resetQueryError();
    resetErrorBoundary();
  }

  return (
    <SidebarContent title={fallbackTitle}>
      <ErrorAlert error={error as unknown} onReset={handleReset} />
    </SidebarContent>
  );
}

function SidebarLoading({ fallbackTitle }: DrawerFallbackOptions) {
  return (
    <SidebarContent title={fallbackTitle}>
      <LoadingOverlayHiddenBackdrop />
    </SidebarContent>
  );
}
