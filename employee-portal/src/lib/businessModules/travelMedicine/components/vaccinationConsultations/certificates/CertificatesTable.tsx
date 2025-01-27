/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiProcedureStatus,
  ApiTMCertificate,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ReceiptOutlined } from "@mui/icons-material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useDownloadTravelMedicineFile } from "@/lib/businessModules/travelMedicine/api/download/files";
import {
  useGetStatusQuery,
  useGetStepsWithAppliedServicesQuery,
  useGetVaccinationConsultationCertificatesQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useCertificateSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/CertificateSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function CertificatesTable({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const snackbar = useSnackbar();
  const file = useDownloadTravelMedicineFile();

  const [
    { data: tableData },
    { data: stepsWithAppliedServices },
    { data: status },
  ] = useSuspenseQueries({
    queries: [
      useGetVaccinationConsultationCertificatesQuery(procedureId),
      useGetStepsWithAppliedServicesQuery(procedureId),
      useGetStatusQuery(procedureId),
    ],
  });

  const certificateSidebar = useCertificateSidebar();

  function isProcedureClosed() {
    return status === ApiProcedureStatus.Closed;
  }

  function openCertificateSideBar() {
    certificateSidebar.open({
      procedureId: procedureId,
      stepsWithAppliedServices:
        stepsWithAppliedServices.stepWithAppliedServices,
    });
  }

  async function downloadCertificate(certificate: ApiTMCertificate) {
    try {
      if (certificate.certificateFileId !== undefined) {
        await file.download(certificate.certificateFileId);
      }
    } catch {
      snackbar.error("Der Download der Bescheinigung ist fehlgeschlagen.");
    }
  }

  return (
    <TablePage
      fullHeight
      controls={
        !isProcedureClosed() ? (
          <ButtonBar
            right={
              <Button
                sx={{ py: 1 / 2 }}
                startDecorator={<AddOutlined />}
                onClick={openCertificateSideBar}
                data-testid="create-certificate-buttonbar"
              >
                Bescheinigung erstellen
              </Button>
            }
          />
        ) : null
      }
    >
      <TableSheet>
        <DataTable
          data={tableData.certificates}
          columns={columns(downloadCertificate)}
          noDataComponent={() => <NoCertificatesAvailable />}
        />
      </TableSheet>
    </TablePage>
  );

  function NoCertificatesAvailable() {
    return (
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ReceiptOutlined sx={{ height: "40px", width: "40px" }} />
        <Typography sx={{ mt: 2, mb: 3 }}>
          Aktuell keine Bescheinigungen vorhanden
        </Typography>
        {!isProcedureClosed() ? (
          <Button
            sx={{ py: 1 / 2 }}
            startDecorator={<AddOutlined />}
            onClick={openCertificateSideBar}
            data-testid="create-certificate-empty-table"
          >
            Bescheinigung erstellen
          </Button>
        ) : null}
      </Stack>
    );
  }
}
