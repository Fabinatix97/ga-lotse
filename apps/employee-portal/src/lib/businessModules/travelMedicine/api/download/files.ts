/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal";
import {
  GetInformationStatementPdfRequest,
  GetMedicalHistoryPdfRequest,
} from "@eshg/travel-medicine-api";

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
