/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AppointmentBlockApi,
  Configuration,
  InfectionBriefingAppointmentStandardDurationApi,
} from "@eshg/infection-briefing-api";
import { apiMiddlewares } from "@eshg/lib-portal";

export function createClients(baseUrl: string) {
  const config: Configuration = new Configuration({
    basePath: baseUrl,
    middleware: apiMiddlewares,
  });
  return {
    appointmentBlockApi: new AppointmentBlockApi(config),
    appointmentStandardDurationApi:
      new InfectionBriefingAppointmentStandardDurationApi(config),
  };
}
export type InfectionBriefingClients = ReturnType<typeof createClients>;
