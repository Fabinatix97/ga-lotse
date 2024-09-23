/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateAppointmentBlock } from "@eshg/employee-portal-api/travelMedicine";

export interface Appointment {
  readonly start: Date;
  readonly end: Date;
}

export function mapAppointment(
  response: ApiCreateAppointmentBlock,
): ApiCreateAppointmentBlock {
  return { start: response.start, end: response.end };
}
