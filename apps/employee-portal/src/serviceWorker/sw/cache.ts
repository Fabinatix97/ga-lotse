/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { API_CACHE_NAME } from "@/serviceWorker/common/common";

import { decrypt, encrypt } from "./crypto/crypto";

export async function getFromApiCache(request: string) {
  const cache = await caches.open(API_CACHE_NAME);
  const response = await cache.match(request);
  if (!response?.ok) throw new Error(`${request} not found in cache`);
  return new Response(await decrypt(await response.arrayBuffer()), response);
}

async function getFromApiCacheOptional(request: Request) {
  const cache = await caches.open(API_CACHE_NAME);
  const response = await cache.match(request);
  if (!response?.ok) return undefined;
  return new Response(await decrypt(await response.arrayBuffer()), response);
}

export async function writeToApiCache(
  request: Request | string,
  response: Response,
) {
  const cache = await caches.open(API_CACHE_NAME);
  await cache.put(
    request,
    new Response(await encrypt(await response.arrayBuffer()), response),
  );
}

export async function writeFileToApiCache(
  request: Request | string,
  file: File,
) {
  const cache = await caches.open(API_CACHE_NAME);
  await cache.put(
    request,
    new Response(await encrypt(await file.arrayBuffer())),
  );
}

export async function getApiCacheEntries(requestPattern: RegExp) {
  const cache = await caches.open(API_CACHE_NAME);
  const getRequests = (await cache.keys()).filter((r) =>
    requestPattern.test(new URL(r.url).pathname),
  );

  return (
    await Promise.all(
      getRequests.map(async (request) => {
        const response = await getFromApiCacheOptional(request);
        if (!response) return undefined;

        return [
          {
            request,
            response,
          },
        ];
      }),
    )
  )
    .filter(isDefined)
    .flat();
}

export async function getAnyDataRaw() {
  const cache = await caches.open(API_CACHE_NAME);
  const allData = await cache.matchAll();
  return allData[0]?.arrayBuffer();
}
