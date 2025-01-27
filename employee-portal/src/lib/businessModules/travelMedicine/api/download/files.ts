/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GetInformationStatementPdfRequest,
  GetMedicalHistoryPdfRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";

import {
  useFileApi,
  useVaccinationConsultationApi,
} from "@/lib/businessModules/travelMedicine/api/clients";

export function useDownloadTravelMedicineFile() {
  const fileApi = useFileApi();
  return useFileDownload((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }),
  );
}

export function useDownloadInformationStatementPdf() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useFileDownload((request: GetInformationStatementPdfRequest) =>
    vaccinationConsultationApi.getInformationStatementPdfRaw(request),
  );
}

export function useDownloadMedicalHistoryPdf() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useFileDownload((request: GetMedicalHistoryPdfRequest) =>
    vaccinationConsultationApi.getMedicalHistoryPdfRaw(request),
  );
}
