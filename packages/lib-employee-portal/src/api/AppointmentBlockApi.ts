/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/base-api";

import {
  AppointmentBlock,
  AppointmentBlockBin,
  AppointmentBlockSlot,
} from "../components/appointmentBlocks/AppointmentBlockGroup";

export interface ApiUpdateAppointmentBlockRequest {
  start: Date;
  end: Date;
  parallelExaminations: number;
  mfas: string[];
  physicians: string[];
  consultants: string[];
  sopasss: string[];
  room?: string;
  availableForCitizen?: boolean;
  availableForBulkBooking?: boolean;
}

export interface UpdateAppointmentBlockRequest {
  appointmentBlockId: string;
  apiUpdateAppointmentBlockRequest: ApiUpdateAppointmentBlockRequest;
}

export interface DeleteAppointmentBlockRequest {
  appointmentBlockId: string;
}

export interface ValidateAppointmentBlockGroupResponse {
  userIdsWithEventConflicts: string[];
  userIdsWithoutEventConflicts: string[];
}

interface GetAppointmentBlockRoomsResponse {
  rooms: string[];
}

export interface GetAppointmentBlocksResponse {
  appointmentBlocks: AppointmentBlock[];
}

export interface AppointmentBlockApi {
  getAppointmentBlock(appointmentBlockId: string): Promise<AppointmentBlock>;
  updateAppointmentBlock(
    requestParameters: UpdateAppointmentBlockRequest,
  ): Promise<ApiResponse<AppointmentBlock>>;
  validateUpdateAppointmentBlock(
    requestParameters: UpdateAppointmentBlockRequest,
  ): Promise<ApiResponse<ValidateAppointmentBlockGroupResponse>>;
  deleteAppointmentBlock(
    requestParameters: DeleteAppointmentBlockRequest,
  ): Promise<ApiResponse<void>>;
  getAppointmentBlockRooms(): Promise<GetAppointmentBlockRoomsResponse>;
  getAppointmentBlocks?: (
    timeRangeStart: Date,
    timeRangeEnd: Date,
  ) => Promise<GetAppointmentBlocksResponse>;
  getAppointments?: (
    timeRangeStart: Date,
    timeRangeEnd: Date,
  ) => Promise<AppointmentBlockBin>;
  getAppointment?: (appointmentId: number) => Promise<AppointmentBlockSlot>;
}
