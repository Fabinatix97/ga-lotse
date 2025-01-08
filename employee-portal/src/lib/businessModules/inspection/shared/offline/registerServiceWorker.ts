/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Workbox } from "workbox-window";

import {
  getServiceWorkerRegistration,
  putServiceWorkerRegistration,
} from "@/serviceWorker/common/registrationPersistence";

// injected by next-pwa
declare global {
  interface Window {
    workbox?: Workbox;
  }
}

let workboxRegistered = false;

export async function registerServiceWorker() {
  if (!workboxRegistered) {
    await window.workbox?.register();
    workboxRegistered = true;
    const serviceWorker = await window.workbox?.controlling;
    await putServiceWorkerRegistration(serviceWorker?.scriptURL);
    return serviceWorker;
  }
  return window.workbox?.controlling;
}

export async function isServiceWorkerRegistered(): Promise<boolean> {
  return !!(await getServiceWorkerRegistration());
}

export async function getRegistration() {
  const sw = await window.workbox?.controlling;
  const scriptUrl = sw?.scriptURL;
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    if (registration.active?.scriptURL === scriptUrl) {
      return registration;
    }
  }
  return undefined;
}
