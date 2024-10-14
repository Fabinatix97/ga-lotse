/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { ErrorAlert } from "@eshg/lib-portal/errorHandling/ErrorAlert";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { LoadingOverlay } from "@/lib/shared/components/LoadingOverlay";
import {
  DrawerFallbackOptions,
  DrawerInstance,
  useDrawerContext,
} from "@/lib/shared/components/drawer/drawerContext";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function SidebarSlot() {
  const { state, tryClose } = useDrawerContext();
  const openDrawer = state.open;
  const sidebar = openDrawer?.type === "sidebar" ? openDrawer : null;

  function renderComponentWithBoundary(
    sidebarInstance: DrawerInstance,
  ): ReactNode {
    const SidebarComponent = sidebarInstance.component;
    return (
      <SidebarBoundary fallbackTitle={sidebarInstance.fallbackTitle}>
        <SidebarComponent onClose={(force) => tryClose({ force })} />
      </SidebarBoundary>
    );
  }

  return (
    <Sidebar open={sidebar !== null} onClose={() => tryClose()}>
      {sidebar !== null ? renderComponentWithBoundary(sidebar) : null}
    </Sidebar>
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
      <LoadingOverlay />
    </SidebarContent>
  );
}
