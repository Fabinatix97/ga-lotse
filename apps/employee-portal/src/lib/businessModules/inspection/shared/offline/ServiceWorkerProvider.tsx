/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";

import { useIsOffline } from "@eshg/lib-employee-portal";
import { LoadingOverlay } from "@eshg/lib-portal";

import { useServiceWorkerSyncQueue } from "@/lib/businessModules/inspection/shared/offline/useServiceWorkerSyncQueue";

interface ServiceWorker {
  isOffline: boolean;
  sendMessageToServiceWorker: (message: object) => Promise<unknown>;
}

const ServiceWorkerContext = createContext<ServiceWorker | null>(null);

export function useServiceWorker(): ServiceWorker {
  const context = useContext(ServiceWorkerContext);
  if (context === null) {
    throw new Error(
      "useServiceWorker was called outside ServiceWorkerProvider",
    );
  }
  return context;
}

export function ServiceWorkerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const isOffline = useIsOffline();

  const contextValue: ServiceWorker = useMemo(
    () => ({
      isOffline,
      sendMessageToServiceWorker,
    }),
    [isOffline],
  );

  const syncing = useServiceWorkerSyncQueue();

  return (
    <ServiceWorkerContext value={contextValue}>
      {syncing && <LoadingOverlay />}
      {children}
    </ServiceWorkerContext>
  );
}

async function sendMessageToServiceWorker(message: object) {
  return (await window.workbox?.messageSW(message)) as unknown;
}
