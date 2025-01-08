/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  useFileApi,
  useVaccinationConsultationApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import { useDownloadFile } from "@/lib/shared/api/download/files";

export function useDownloadTravelMedicineFile() {
  const fileApi = useFileApi();
  return useDownloadFile((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }),
  );
}

export function useDownloadInformationStatementPdf() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useDownloadFile(
    (procedureId: string, informationStatementId: string) =>
      vaccinationConsultationApi.getInformationStatementPdfRaw({
        procedureId,
        informationStatementId,
      }),
  );
}

export function useDownloadMedicalHistoryPdf() {
  const vaccinationConsultationApi = useVaccinationConsultationApi();
  return useDownloadFile((procedureId: string, medicalHistoryId: string) =>
    vaccinationConsultationApi.getMedicalHistoryPdfRaw({
      procedureId,
      medicalHistoryId,
    }),
  );
}
