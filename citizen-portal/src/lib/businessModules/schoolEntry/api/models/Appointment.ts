/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/citizen-portal-api/schoolEntry";

export interface Appointment {
  readonly start: Date;
  readonly end: Date;
}

export function mapAppointment(response: ApiAppointment): Appointment {
  return { start: response.start, end: response.end };
}
