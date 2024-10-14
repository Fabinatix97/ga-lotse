/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAssignableService } from "@eshg/employee-portal-api/travelMedicine";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

export interface AssignableService {
  readonly appointmentSuggestion?: Date;
  readonly latency?: number;
  readonly serviceDescription: string;
  readonly serviceId: string;
  readonly vaccinationNumber?: number;
}

export function mapAssignableService(
  response: ApiAssignableService,
): AssignableService {
  return {
    appointmentSuggestion: mapOptionalValue(response.appointmentSuggestion),
    latency: mapOptionalValue(response.latency),
    serviceDescription: response.serviceDescription,
    serviceId: response.serviceId,
    vaccinationNumber: mapOptionalValue(response.vaccinationNumber),
  };
}
