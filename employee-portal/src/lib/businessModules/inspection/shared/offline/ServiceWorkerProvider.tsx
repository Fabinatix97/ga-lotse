/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isEmpty } from "remeda";

import { RegisterServiceWorker } from "@/lib/businessModules/inspection/shared/offline/RegisterServiceWorker";
import {
  deleteAllEncryptedCaches,
  deleteInspectionFromAllCaches,
} from "@/lib/businessModules/inspection/shared/offline/deleteInspectionFromAllCaches";
import {
  getInspectionIdsOfProcedureBaseDataRequests,
  useGetPrecachedInspections,
} from "@/lib/businessModules/inspection/shared/offline/useGetPrecachedInspections";
import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";
import { LoadingOverlay } from "@/lib/shared/components/LoadingOverlay";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";
import { PAGES_CACHE_NAME } from "@/serviceWorker/common/common";

export interface ServiceWorker {
  desiredPrecachedInspectionIds: string[];
  actualPrecachedInspectionIds: string[];
  addToPrecache: (inspectionId: string) => void;
  removeFromPrecache: (inspectionId: string) => void;
  isOffline: boolean;
  sendMessageToServiceWorker: (message: object) => Promise<unknown>;
}

const ServiceWorkerContext = createContext<ServiceWorker>(null!);

export function ServiceWorkerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();

  if (isOfflineEnabled) {
    return <ServiceWorkerProviderInner>{children}</ServiceWorkerProviderInner>;
  } else {
    return <ServiceWorkerProviderMock>{children}</ServiceWorkerProviderMock>;
  }
}

export function useServiceWorker(): ServiceWorker {
  const context = useContext(ServiceWorkerContext);
  if (context == null) {
    throw new Error(
      "useServiceWorker was called outside ServiceWorkerProvider",
    );
  }
  return context;
}

function ServiceWorkerProviderInner({
  children,
}: Readonly<{ children: ReactNode }>) {
  const isOffline = useIsOffline();

  const [desiredPrecachedInspectionIds, setDesiredPrecachedInspectionIds] =
    useState<string[] | undefined>(undefined);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if ("caches" in window) {
      caches
        .open(PAGES_CACHE_NAME)
        .then((cache) => cache.keys())
        .then((pageRequest) =>
          setDesiredPrecachedInspectionIds(
            getInspectionIdsOfProcedureBaseDataRequests(pageRequest),
          ),
        )
        .catch((reason) => {
          throw reason;
        });
    }
  }, []);

  const actualPrecachedInspectionIds = useGetPrecachedInspections();

  useEffect(() => {
    if (!desiredPrecachedInspectionIds || !actualPrecachedInspectionIds) return;
    const remove = actualPrecachedInspectionIds.filter(
      (id) => !desiredPrecachedInspectionIds.includes(id),
    );
    if (remove.length > 0) {
      setDeleting(true);
      deleteFromCache(remove, isEmpty(desiredPrecachedInspectionIds))
        .catch((reason) => {
          throw reason;
        })
        .finally(() => setDeleting(false));
    }
  }, [actualPrecachedInspectionIds, desiredPrecachedInspectionIds]);

  const addToPrecache = useCallback((inspectionId: string) => {
    setDesiredPrecachedInspectionIds((oldIds) => {
      if (!oldIds || oldIds.includes(inspectionId)) {
        return oldIds;
      }
      return [...oldIds, inspectionId];
    });
  }, []);

  const removeFromPrecache = useCallback((inspectionId: string) => {
    setDesiredPrecachedInspectionIds((oldIds) => {
      const index = oldIds?.indexOf(inspectionId);
      if (index == null || index < 0) {
        return oldIds;
      }
      return [...oldIds!.slice(0, index), ...oldIds!.slice(index + 1)];
    });
  }, []);

  const contextValue: ServiceWorker = useMemo(
    () => ({
      desiredPrecachedInspectionIds: desiredPrecachedInspectionIds ?? [],
      actualPrecachedInspectionIds: actualPrecachedInspectionIds ?? [],
      addToPrecache,
      removeFromPrecache,
      isOffline,
      sendMessageToServiceWorker,
    }),
    [
      actualPrecachedInspectionIds,
      addToPrecache,
      desiredPrecachedInspectionIds,
      removeFromPrecache,
      isOffline,
    ],
  );

  return (
    <ServiceWorkerContext.Provider value={contextValue}>
      <RegisterServiceWorker
        inspectionIds={desiredPrecachedInspectionIds ?? []}
        isOffline={isOffline}
      />
      {deleting && <LoadingOverlay />}
      {children}
    </ServiceWorkerContext.Provider>
  );
}

function ServiceWorkerProviderMock({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ServiceWorkerContext.Provider value={EMPTY_CONTEXT}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

const EMPTY_CONTEXT: ServiceWorker = {
  desiredPrecachedInspectionIds: [],
  actualPrecachedInspectionIds: [],
  addToPrecache: (_) => {
    /* empty */
  },
  removeFromPrecache: (_) => {
    /* empty */
  },
  isOffline: false,
  sendMessageToServiceWorker: async (_) => {
    /* empty */
  },
};

async function sendMessageToServiceWorker(message: object) {
  return (await window.workbox?.messageSW(message)) as unknown;
}

async function deleteFromCache(remove: string[], removeAll: boolean) {
  await Promise.all(remove.map(deleteInspectionFromAllCaches));
  if (removeAll) {
    await deleteAllEncryptedCaches();
  }
}
