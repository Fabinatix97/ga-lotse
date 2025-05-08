/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReceiptOutlined } from "@mui/icons-material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiProcedureStatus,
  ApiTMCertificate,
} from "@eshg/travel-medicine-api";

import { useDownloadTravelMedicineFile } from "@/lib/businessModules/travelMedicine/api/download/files";
import {
  useGetStatusQuery,
  useGetStepsWithAppliedServicesQuery,
  useGetVaccinationConsultationCertificatesQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useCertificateSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/CertificateSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/columns";

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
                data-testid="create-certificate-buttonbar"
                onClick={openCertificateSideBar}
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
            data-testid="create-certificate-empty-table"
            onClick={openCertificateSideBar}
          >
            Bescheinigung erstellen
          </Button>
        ) : null}
      </Stack>
    );
  }
}
