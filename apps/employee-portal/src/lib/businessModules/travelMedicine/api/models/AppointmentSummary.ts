/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapOptionalValue } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentSummary,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

export interface AppointmentSummary {
  readonly appointmentBookingType: ApiAppointmentBookingType;
  readonly appointmentType: ApiAppointmentType;
  readonly earliestDate?: Date;
  readonly end?: Date;
  readonly procedureStepId: string;
  readonly start?: Date;
}

export function mapAppointment(
  response: ApiAppointmentSummary,
): AppointmentSummary {
  return {
    appointmentBookingType: response.appointmentBookingType,
    appointmentType: response.appointmentType,
    earliestDate: mapOptionalValue(response.earliestDate),
    procedureStepId: response.procedureStepId,
    start: mapOptionalValue(response.start),
    end: mapOptionalValue(response.end),
  };
}
