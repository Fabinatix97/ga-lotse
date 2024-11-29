/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Strategy, StrategyHandler } from "workbox-strategies";

import { JSON_HEADER, getGlobalSelf } from "@/serviceWorker/sw/util";

export class CustomOfflineHandlerStrategy<T> extends Strategy {
  private readonly _offlineHandler: () => Promise<T>;

  constructor(offlineHandler: () => Promise<T>) {
    super({});
    this._offlineHandler = offlineHandler;
  }

  protected async _handle(
    request: Request,
    handler: StrategyHandler,
  ): Promise<Response | undefined> {
    if (getGlobalSelf().navigator.onLine) {
      return handler.fetch(request);
    } else {
      const body = await this._offlineHandler();
      return new Response(JSON.stringify(body), {
        headers: JSON_HEADER,
      });
    }
  }
}
