/**
 * Copyright 2026 cronn GmbH
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

export interface AppointmentBlockUser {
  firstName: string;
  lastName: string;
  userId: string;
}

export interface AppointmentBlockSlot {
  appointmentId?: number;
  appointmentType?: ApiAppointmentType;
  booked: boolean;
  end: Date;
  information?: string;
  procedureId?: string;
  start: Date;
}

export interface AppointmentBlockBin {
  appointmentBlockSlots: AppointmentBlockSlot[];
}

export interface AppointmentBlock extends BaseEntity {
  readonly start: Date;
  readonly end: Date;
  readonly parallelExaminations?: number;
  readonly extraLength?: boolean;
  readonly freeDuration?: string;
  readonly bookedDuration?: string;
  readonly bookedAppointments?: Appointment[];
  readonly mfas?: string[];
  readonly physicians?: string[];
  readonly consultants?: string[];
  readonly sopasss?: string[];
  readonly room?: string;
  readonly resolvedUsers?: Record<string, AppointmentBlockUser>;
  readonly creatorId?: string;
  readonly availableForCitizen?: boolean;
  readonly availableForBulkBooking?: boolean;
  readonly appointmentBlockBins?: AppointmentBlockBin[];
  readonly types?: ApiAppointmentType[];
}

export interface AppointmentBlockGroup extends AppointmentBlock {
  readonly types: ApiAppointmentType[];
  readonly appointmentBlocks: AppointmentBlock[];
  readonly location?: AppointmentLocation;
}
