/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiConfiguration } from "@eshg/lib-portal";

declare module "@eshg/lib-portal" {
  interface ApiConfiguration {
    PUBLIC_BASE_BACKEND_URL: string;
    PUBLIC_INSPECTION_BACKEND_URL: string;
    PUBLIC_SCHOOL_ENTRY_BACKEND_URL: string;
    PUBLIC_TRAVEL_MEDICINE_BACKEND_URL: string;
    PUBLIC_MEASLES_PROTECTION_BACKEND_URL: string;
    PUBLIC_STATISTICS_BACKEND_URL: string;
    PUBLIC_CHAT_MANAGEMENT_BACKEND_URL: string;
    PUBLIC_AUDITLOG_BACKEND_URL: string;
    PUBLIC_OPENDATA_BACKEND_URL: string;
    PUBLIC_STI_PROTECTION_BACKEND_URL: string;
    PUBLIC_MEDICAL_REGISTRY_BACKEND_URL: string;
    PUBLIC_DENTAL_BACKEND_URL: string;
    PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL: string;
    PUBLIC_MEDS_ABROAD_BACKEND_URL: string;
    PUBLIC_PROSTITUTE_PROTECTION_BACKEND_URL: string;
    PUBLIC_PDF_CONVERTER_URL: string;
  }
}

export type { ApiConfiguration };
