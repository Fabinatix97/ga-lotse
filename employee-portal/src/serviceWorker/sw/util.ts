/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SERVICE_WORKER_SERVER_NAME } from "@/serviceWorker/common/common";

export const JSON_HEADER = {
  "Content-Type": "application/json",
};

export async function getFormDataValueAsString(value: File | string) {
  return typeof value === "string" ? value : await value?.text();
}

export function requireNonNullish<T>(value: T) {
  if (value == null) {
    throw new Error("Value is null or undefined");
  }
  return value;
}

export function getHeaders() {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Server", SERVICE_WORKER_SERVER_NAME);
  return headers;
}

export async function getFormData(
  request: Request,
): Promise<Record<string, FormDataEntryValue>> {
  const formData = await request.clone().formData();
  const iterableFormData = formData as unknown as Iterable<
    [string, FormDataEntryValue]
  >;
  return Object.fromEntries(iterableFormData);
}

export function getGlobalSelf(): ServiceWorkerGlobalScope {
  // @ts-expect-error https://github.com/microsoft/TypeScript/issues/14877
  return self as ServiceWorkerGlobalScope;
}
