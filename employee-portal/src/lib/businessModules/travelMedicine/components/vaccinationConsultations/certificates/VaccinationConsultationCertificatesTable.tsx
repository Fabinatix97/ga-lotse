/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiProcedureStatus,
  ApiTMCertificate,
} from "@eshg/employee-portal-api/travelMedicine";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { CalendarTodayOutlined } from "@mui/icons-material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Stack, Typography } from "@mui/joy";
import { useRef, useState } from "react";

import { useDownloadTravelMedicineFile } from "@/lib/businessModules/travelMedicine/api/download/files";
import {
  useGetStatus,
  useGetStepsWithAppliedServices,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { CreateCertificateSideBar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/CreateCertificateSideBar";
import { vaccinationConsultationCertificatesColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/certificatesColumns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function VaccinationConsultationCertificatesTable({
  procedureId,
  tableData,
}: Readonly<{
  procedureId: string;
  tableData: ApiTMCertificate[];
}>) {
  const snackbar = useSnackbar();
  const downloadFile = useDownloadTravelMedicineFile();
  const hiddenLinkContainer = useRef<HTMLDivElement>(null);
  const [createCertificateSideBarOpen, setCreateCertificateSideBarOpen] =
    useState(false);

  const stepsWithAppliedServices =
    useGetStepsWithAppliedServices(procedureId).data;

  const status = useGetStatus(procedureId).data;

  function isProcedureClosed() {
    return status === ApiProcedureStatus.Closed;
  }

  function openCreateCertificateSideBar() {
    setCreateCertificateSideBarOpen(true);
  }

  function closeCreateCertificateSideBar() {
    setCreateCertificateSideBarOpen(false);
  }

  async function downloadCertificate(certificate: ApiTMCertificate) {
    try {
      if (certificate.certificateFileId !== undefined) {
        const downloadedFile = await downloadFile(
          certificate.certificateFileId,
        );

        if (hiddenLinkContainer.current !== null) {
          downloadFileAndOpen(downloadedFile, hiddenLinkContainer.current);
        }
      }
    } catch {
      snackbar.error("Der Download der Bescheinigung ist fehlgeschlagen.");
    }
  }

  return (
    <>
      <TablePage
        fullHeight
        controls={
          !isProcedureClosed() ? (
            <ButtonBar
              right={
                <Button
                  sx={{ py: 1 / 2 }}
                  startDecorator={<AddOutlined />}
                  onClick={openCreateCertificateSideBar}
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
            data={tableData}
            columns={vaccinationConsultationCertificatesColumns(
              downloadCertificate,
            )}
            noDataComponent={() => <NoCertificatesAvailable />}
          />
        </TableSheet>
      </TablePage>
      <div ref={hiddenLinkContainer} style={{ display: "hidden" }}></div>
      <CreateCertificateSideBar
        sideBarOpen={createCertificateSideBarOpen}
        closeSideBar={closeCreateCertificateSideBar}
        stepsWithAppliedServices={
          stepsWithAppliedServices.stepWithAppliedServices
        }
        procedureId={procedureId}
      ></CreateCertificateSideBar>
    </>
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
        <CalendarTodayOutlined sx={{ height: "40px", width: "40px" }} />
        <Typography sx={{ mt: 2, mb: 3 }}>
          Aktuell keine Bescheinigungen vorhanden
        </Typography>
        {!isProcedureClosed() ? (
          <Button
            sx={{ py: 1 / 2 }}
            startDecorator={<AddOutlined />}
            onClick={openCreateCertificateSideBar}
            data-testid="create-certificate-empty-table"
          >
            Bescheinigung erstellen
          </Button>
        ) : null}
      </Stack>
    );
  }
}
