/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RouteHandlerCallback } from "workbox-core";

import { SERVICE_WORKER_SERVER_NAME } from "@/serviceWorker/common/common";
import { NETWORK_TIMEOUT_IN_SECONDS } from "@/serviceWorker/sw/config";
import {
  pushEmptyRequestToQueue,
  pushRequestToQueue,
} from "@/serviceWorker/sw/queue";
import { getHeaders } from "@/serviceWorker/sw/util";

export type UpdateCacheCallback = (
  param: UpdateCacheCallbackParam,
) => UpdateCacheCallbackReturnValue;

export interface UpdateCacheCallbackParam {
  requestPath: string;
  request: Request;
}

export type UpdateCacheCallbackReturnValue = Promise<{
  responseBody: string | null;
  request?: Request;
}>;

export function getApiPatchHandler(
  updateCacheCallback: UpdateCacheCallback,
): RouteHandlerCallback {
  return async ({ request, url }) => {
    try {
      return await Promise.race([
        fetch(request.clone()),
        new Promise<Response>((_resolve, reject) =>
          setTimeout(
            () => reject(new Error("Request timed out")),
            NETWORK_TIMEOUT_IN_SECONDS * 1000,
          ),
        ),
      ]);
    } catch {
      const { responseBody, request: updatedRequest } =
        await updateCacheCallback({
          requestPath: url.pathname,
          request: request,
        });
      if (updatedRequest) {
        await pushRequestToQueue(updatedRequest);
      }
      const headers = getHeaders();
      return new Response(responseBody, { headers });
    }
  };
}

export const getApiPostHandler = getApiPatchHandler;

export const getApiPutHandler = getApiPatchHandler;

export function getApiDeleteHandler(
  updateCacheCallback: UpdateCacheCallback,
): RouteHandlerCallback {
  return async ({ request, url }) => {
    try {
      return await Promise.race([
        fetch(new Request(request, { body: null })),
        new Promise<Response>((_resolve, reject) =>
          setTimeout(
            () => reject(new Error("Request timed out")),
            NETWORK_TIMEOUT_IN_SECONDS * 1000,
          ),
        ),
      ]);
    } catch {
      const { request: updatedRequest } = await updateCacheCallback({
        requestPath: url.pathname,
        request,
      });
      if (updatedRequest) {
        await pushEmptyRequestToQueue(updatedRequest);
      }
      const headers = new Headers();
      headers.set("Server", SERVICE_WORKER_SERVER_NAME);
      return new Response(null, { headers });
    }
  };
}
