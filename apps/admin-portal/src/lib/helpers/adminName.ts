/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

const ADMIN_NAME = "admin-name";

export function setAdminName(adminName: string | null) {
  if (typeof window === "undefined") return;

  if (adminName) {
    window.sessionStorage.setItem(ADMIN_NAME, adminName);
  } else {
    window.sessionStorage.removeItem(ADMIN_NAME);
  }
}

export function getAdminName(): string | null {
  if (typeof window === "undefined") return null;

  return window.sessionStorage.getItem(ADMIN_NAME);
}
