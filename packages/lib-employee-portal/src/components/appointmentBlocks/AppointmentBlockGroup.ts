/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseEntity } from "../../api/models/BaseEntity";

import { ApiAppointmentType } from "./types";

export interface AppointmentLocation {
  id: string;
  name: string;
}

export interface AppointmentBlock extends BaseEntity {
  readonly start: Date;
  readonly end: Date;
  readonly parallelExaminations?: number;
  readonly freeDuration?: string;
  readonly bookedDuration?: string;
}

export interface AppointmentBlockGroup extends AppointmentBlock {
  readonly types: ApiAppointmentType[];
  readonly appointmentBlocks: AppointmentBlock[];
  readonly location?: AppointmentLocation;
}
