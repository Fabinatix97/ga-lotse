/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseAPI, Configuration, ContactApi, UserApi } from "@eshg/base-api";
import { apiMiddlewares } from "@eshg/lib-portal/config/apiMiddlewares";

export type EmployeePortalClients = ReturnType<typeof createClients>;

export function createClients(baseUrl: string) {
  const configuration = new Configuration({
    basePath: baseUrl,
    middleware: apiMiddlewares,
  });

  return {
    userApi: new UserApi(configuration),
    contactApi: new ContactApi(configuration),
  } satisfies Record<string, BaseAPI>;
}
