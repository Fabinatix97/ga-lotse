/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiResponse } from "@eshg/base-api";

import { ProcedureLabelResponse } from "../api/models/ProcedureLabel";

export interface CreateProcedureLabelRequest {
  description?: string;
  name: string;
}

export interface UpdateProcedureLabelRequest {
  id: string;
  apiUpdateProcedureLabelRequest: {
    name: string;
    description?: string;
    version: number;
  };
}

export interface GetProcedureLabelsRequest {
  pageNumber?: number;
  pageSize?: number;
}

export interface GetProcedureLabelsResponse {
  elements: ProcedureLabelResponse[];
  totalNumberOfElements: number;
}

export interface ProcedureLabelClient {
  createLabel(
    apiCreateLabelRequest: CreateProcedureLabelRequest,
  ): Promise<ProcedureLabelResponse>;
  updateLabelRaw(
    requestParameters: UpdateProcedureLabelRequest,
  ): Promise<ApiResponse<ProcedureLabelResponse>>;
  getLabelsRaw(
    requestParameters: GetProcedureLabelsRequest,
  ): Promise<ApiResponse<GetProcedureLabelsResponse>>;
}
