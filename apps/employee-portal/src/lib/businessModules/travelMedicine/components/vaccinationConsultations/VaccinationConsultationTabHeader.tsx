/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PersonToolbarHeader } from "@eshg/lib-employee-portal";
import { ApiGetVaccinationConsultationDetailsResponse } from "@eshg/travel-medicine-api";

export function VaccinationConsultationTabHeader({
  detailsResponse,
}: {
  readonly detailsResponse: ApiGetVaccinationConsultationDetailsResponse;
}) {
  return <PersonToolbarHeader person={detailsResponse.patient} showAge />;
}
