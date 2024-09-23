/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { getErrorDescription } from "@eshg/lib-portal/errorHandling/errorMappers";
import { resolveError } from "@eshg/lib-portal/errorHandling/errorResolvers";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { isEmpty } from "remeda";
import { Workbox, WorkboxLifecycleEvent } from "workbox-window";

import { usePrecacheInspections } from "@/lib/businessModules/inspection/shared/offline/usePrecacheInspections";
import { useServiceWorkerMessageListeners } from "@/lib/businessModules/inspection/shared/offline/useServiceWorkerMessageListeners";
import { LoadingOverlay } from "@/lib/shared/components/LoadingOverlay";

// injected by next-pwa
declare global {
  interface Window {
    workbox?: Workbox;
  }
}

let workboxRegistered = false;

export function RegisterServiceWorker({
  inspectionIds,
  isOffline,
}: Readonly<{
  inspectionIds: string[];
  isOffline: boolean;
}>) {
  const [controlling, setControlling] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    window.workbox?.getSW().then(
      (sw) => {
        switch (sw.state) {
          case "parsed":
          case "installing":
          case "installed":
          case "activating":
            setControlling(false);
            break;
          case "activated":
            window.workbox?.update().catch((reason) => {
              throw reason;
            });
            handleControlling();
            break;
          case "redundant":
            handleRedundant();
            break;
        }
      },
      (reason) => {
        setControlling(false);
        // eslint-disable-next-line no-console
        console.warn("could get workbox service-worker", reason);
      },
    );

    function handleControlling() {
      setControlling(true);
      // invalidate queries so tanstack-query-cache doesn't prevent the service worker from populating its cache.
      void queryClient.invalidateQueries();
    }

    function handleRedundant(ev?: WorkboxLifecycleEvent) {
      setControlling(ev?.isUpdate ?? false);
    }

    window.workbox?.addEventListener("controlling", handleControlling);
    window.workbox?.addEventListener("redundant", handleRedundant);
    return () => {
      window.workbox?.removeEventListener("controlling", handleControlling);
      window.workbox?.removeEventListener("redundant", handleRedundant);
    };
  }, [queryClient]);

  const syncing = useServiceWorkerMessageListeners();

  // register service worker
  const hasInspections = !isEmpty(inspectionIds);
  useEffect(() => {
    if (!workboxRegistered && hasInspections) {
      window.workbox?.register().catch((reason) => {
        throw reason;
      });
      workboxRegistered = true;
    }
  }, [hasInspections]);

  return (
    <>
      {syncing && <LoadingOverlay />}
      {!isOffline && (
        <ErrorBoundary fallbackRender={(props) => <SnackBarError {...props} />}>
          {controlling && <PrecacheInspections inspectionIds={inspectionIds} />}
        </ErrorBoundary>
      )}
    </>
  );
}

function PrecacheInspections({
  inspectionIds,
}: Readonly<{ inspectionIds: string[] }>) {
  usePrecacheInspections(inspectionIds);

  return false;
}

function SnackBarError(props: FallbackProps) {
  const { error } = useSnackbar();
  const { errorCode } = resolveError(props.error);
  const { message } = getErrorDescription(errorCode);

  useEffect(() => {
    error(`Precache: ${message}`);
  }, [error, message]);
  return false;
}
