/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureStatus } from "@eshg/employee-portal-api/travelMedicine";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { AddOutlined, DocumentScannerOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useDownloadInformationStatementPdf } from "@/lib/businessModules/travelMedicine/api/download/files";
import {
  useDeleteInformationStatement,
  useResetInformationStatement,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  useGetAllInformationStatementsQuery,
  useGetStatusQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useInformationStatementSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/InformationStatementSidebar";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

import { informationStatementsColumns } from "./InformationStatementsColumns";

export function InformationStatementsTable({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const resetInformationStatementApi = useResetInformationStatement();
  const deleteInformationStatementApi = useDeleteInformationStatement();
  const downloadInformationStatementPdf = useDownloadInformationStatementPdf();

  const [{ data: allInformationStatements }, { data: status }] =
    useSuspenseQueries({
      queries: [
        useGetAllInformationStatementsQuery(procedureId),
        useGetStatusQuery(procedureId),
      ],
    });

  const { openConfirmationDialog } = useConfirmationDialog();

  const informationStatementSidebar = useInformationStatementSidebar();

  const isProcedureClosed = status === ApiProcedureStatus.Closed;

  function onResetInformationStatement(informationStatementId: string) {
    openConfirmationDialog({
      title: `Aufklärungsbogen zurücksetzen?`,
      description: `Möchten Sie den ausgefüllten Aufklärungsbogen zurücksetzen? Dadurch werden alle Eingaben gelöscht. Die Aktion kann nicht rückgängig gemacht werden.`,
      confirmLabel: "Zurücksetzen",
      cancelLabel: "Abbrechen",
      onConfirm: () => resetInformationStatement(informationStatementId),
      color: "danger",
    });
  }

  function resetInformationStatement(informationStatementId: string) {
    return resetInformationStatementApi.mutate({
      procedureId,
      informationStatementId,
    });
  }

  function onDeleteInformationStatement(informationStatementId: string) {
    openConfirmationDialog({
      title: `Aufklärungsbogen löschen?`,
      description: `Die Aktion kann nicht rückgängig gemacht werden.`,
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => deleteInformationStatement(informationStatementId),
      color: "danger",
    });
  }

  function deleteInformationStatement(informationStatementId: string) {
    return deleteInformationStatementApi.mutate({
      procedureId,
      informationStatementId,
    });
  }

  async function getInformationStatementPdf(informationStatementId: string) {
    const downloadedFile = await downloadInformationStatementPdf(
      procedureId,
      informationStatementId,
    );
    downloadFileAndOpen(downloadedFile);
  }

  return (
    <TablePage
      data-testid="vc-information-statements"
      fullHeight
      controls={
        !isProcedureClosed && (
          <ButtonBar
            right={
              <Button
                sx={{ py: 1 / 2 }}
                startDecorator={<AddOutlined />}
                onClick={() =>
                  informationStatementSidebar.open({
                    procedureId: procedureId,
                  })
                }
                data-testid="add-information-statement"
                disabled={isProcedureClosed}
              >
                Bogen hinzufügen
              </Button>
            }
          />
        )
      }
    >
      <TableSheet>
        <DataTable
          data={allInformationStatements.informationStatements}
          columns={informationStatementsColumns({
            isProcedureClosed,
            onResetInformationStatement: (informationStatementId: string) =>
              onResetInformationStatement(informationStatementId),
            onDeleteInformationStatement: (informationStatementId: string) =>
              onDeleteInformationStatement(informationStatementId),
            onGetInformationStatementPdf: (informationStatementId: string) =>
              getInformationStatementPdf(informationStatementId),
          })}
          noDataComponent={() => <NoInformationStatementsAvailable />}
        />
      </TableSheet>
    </TablePage>
  );

  function NoInformationStatementsAvailable() {
    return (
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <DocumentScannerOutlined sx={{ height: "40px", width: "40px" }} />
        <Typography sx={{ mt: 2, mb: 3 }}>
          Aktuell keine Aufklärungsbögen vorhanden
        </Typography>
        {!isProcedureClosed ? (
          <Button
            sx={{ py: 1 / 2 }}
            startDecorator={<AddOutlined />}
            onClick={() =>
              informationStatementSidebar.open({
                procedureId: procedureId,
              })
            }
            data-testid="add-information-statement-empty-table"
          >
            Bogen hinzufügen
          </Button>
        ) : null}
      </Stack>
    );
  }
}
