/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/school-entry-api";

export interface Appointment {
  readonly start: Date;
  readonly end: Date;
}

export function mapAppointment(response: ApiAppointment): Appointment {
  return { start: response.start, end: response.end };
}
