/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

const USER_FLOW_TRACKING_ID = "user-flow-tracking-id";

export function setUserFlowTrackingId(id: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(USER_FLOW_TRACKING_ID, id);
}

export function getUserFlowTrackingId(): string | undefined {
  if (typeof window !== "undefined") {
    return window.sessionStorage.getItem(USER_FLOW_TRACKING_ID) ?? undefined;
  }
}

export function clearUserFlowTrackingId(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(USER_FLOW_TRACKING_ID);
}
