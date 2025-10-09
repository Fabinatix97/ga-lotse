/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/base-api";

import { AppointmentBlock } from "../components/appointmentBlocks/AppointmentBlockGroup";

export interface ApiUpdateAppointmentBlockRequest {
  start: Date;
  end: Date;
  parallelExaminations: number;
  mfas: string[];
  physicians: string[];
  consultants: string[];
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
}
