/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseAPI,
  Configuration,
  ContactApi,
  FacilityApi,
  PersonApi,
  PublicConfigApi,
  StreetApi,
  UserApi,
} from "@eshg/base-api";
import { apiMiddlewares } from "@eshg/lib-portal";

export type EmployeePortalClients = ReturnType<typeof createClients>;

export function createClients(baseUrl: string) {
  const configuration = new Configuration({
    basePath: baseUrl,
    middleware: apiMiddlewares,
  });

  return {
    userApi: new UserApi(configuration),
    personApi: new PersonApi(configuration),
    facilityApi: new FacilityApi(configuration),
    contactApi: new ContactApi(configuration),
    streetApi: new StreetApi(configuration),
    publicConfigApi: new PublicConfigApi(configuration),
  } satisfies Record<string, BaseAPI>;
}
