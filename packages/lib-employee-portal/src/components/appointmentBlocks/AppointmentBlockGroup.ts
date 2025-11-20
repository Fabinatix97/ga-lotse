/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseEntity } from "../../api/models/BaseEntity";

import { ApiAppointmentType } from "./types";

export interface Appointment {
  start: Date;
  end: Date;
}

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
  readonly bookedAppointments?: Appointment[];
  readonly mfas?: string[];
  readonly physicians?: string[];
  readonly consultants?: string[];
  readonly room?: string;
}

export interface AppointmentBlockGroup extends AppointmentBlock {
  readonly types: ApiAppointmentType[];
  readonly appointmentBlocks: AppointmentBlock[];
  readonly location?: AppointmentLocation;
}
