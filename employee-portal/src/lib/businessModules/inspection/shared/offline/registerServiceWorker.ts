/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Workbox } from "workbox-window";

// injected by next-pwa
declare global {
  interface Window {
    workbox?: Workbox;
  }
}

let workboxRegistered = false;

export async function registerServiceWorker() {
  if (!workboxRegistered) {
    workboxRegistered = true;
    await window.workbox?.register();
  }
  return window.workbox?.controlling;
}
