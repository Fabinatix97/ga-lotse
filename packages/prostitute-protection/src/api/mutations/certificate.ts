/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiResponse } from "@eshg/base-api";
import {
  downloadFileAndOpen,
  useFileDownload,
  useHandledMutation,
} from "@eshg/lib-portal";
import {
  DownloadCertificateRequest,
  GenerateConsultationCertificatePdfRequest,
  ProstituteProtectionApi,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

export function useGenerateConsultationCertificateMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  return useHandledMutation({
    mutationFn: (request: GenerateConsultationCertificatePdfRequest) =>
      getCertificate(prostituteProtectionApi, request),
  });
}

export function useDownloadCertificateMutation() {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  return useFileDownload((request: DownloadCertificateRequest) =>
    prostituteProtectionApi.downloadCertificateRaw(request),
  );
}

async function getCertificate(
  prostituteProtectionApi: ProstituteProtectionApi,
  request: GenerateConsultationCertificatePdfRequest,
) {
  const result = await prostituteProtectionApi
    .generateConsultationCertificatePdfRaw(request)
    .then(parseCertificateResult);

  downloadFileAndOpen(result.consultationCertificate);

  if (result.registrationCertificate !== null) {
    downloadFileAndOpen(result.registrationCertificate);
  }
}

async function parseCertificateResult(response: ApiResponse<object>): Promise<{
  consultationCertificate: File;
  registrationCertificate: File | null;
}> {
  const formData = await response.raw.formData();
  const consultationCertificate = formData.get("consultationCertificate");
  const registrationCertificate = formData.get("registrationCertificate");

  if (!(consultationCertificate instanceof File)) {
    throw new Error("Response contains invalid result");
  }

  return {
    consultationCertificate,
    registrationCertificate:
      registrationCertificate instanceof File ? registrationCertificate : null,
  };
}
