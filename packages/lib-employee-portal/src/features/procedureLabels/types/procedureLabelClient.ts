/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/base-api";

import { ProcedureLabelResponse } from "@/features/procedureLabels/api/models/ProcedureLabel";

export interface CreateProcedureLabelRequest {
  description?: string;
  name: string;
}

export interface UpdateProcedureLabelRequest {
  id: string;
  apiUpdateLabelRequest: {
    name: string;
    description?: string;
    version: number;
  };
}

interface GetProcedureLabelsResponse {
  labels: ProcedureLabelResponse[];
}

export interface ProcedureLabelClient {
  createLabel(
    apiCreateLabelRequest: CreateProcedureLabelRequest,
  ): Promise<ProcedureLabelResponse>;
  updateLabelRaw(
    requestParameters: UpdateProcedureLabelRequest,
  ): Promise<ApiResponse<ProcedureLabelResponse>>;
  getLabels(): Promise<GetProcedureLabelsResponse>;
}
