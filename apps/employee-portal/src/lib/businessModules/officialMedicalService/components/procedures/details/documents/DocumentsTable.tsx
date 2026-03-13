/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AddOutlined, DescriptionOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
} from "@eshg/lib-employee-portal";
import { ApiDocument } from "@eshg/official-medical-service-api";

import { useDeleteDocument } from "@/lib/businessModules/officialMedicalService/api/mutations/omsDocumentApi";
import {
  useGetAllDocuments,
  useGetProcedureDetails,
} from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { useAddDocumentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/AddDocumentSidebar";
import { Columns } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/Columns";
import { useDocumentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentSidebar";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";

interface DocumentsTableProps {
  procedureId: string;
}

export function DocumentsTable({ procedureId }: Readonly<DocumentsTableProps>) {
  const addDocumentSidebar = useAddDocumentSidebar();
  const documentSidebar = useDocumentSidebar();
  const [{ data: allDocuments }, { data: procedureDetails }] =
    useSuspenseQueries({
      queries: [
        useGetAllDocuments(procedureId),
        useGetProcedureDetails(procedureId),
      ],
    });
  const deleteDocument = useDeleteDocument();

  return (
    <TablePage
      fullHeight
      controls={
        !isProcedureFinalized(procedureDetails) && (
          <ButtonBar
            right={
              <Button
                autoFocus
                endDecorator={<AddOutlined />}
                aria-label="Dokument hinzufügen"
                onClick={() => addDocumentSidebar.open({ procedureId })}
              >
                Dokument hinzufügen
              </Button>
            }
            alignItems="flex-end"
          />
        )
      }
    >
      <TableSheet title={<TableTitle title="Dokumente" />}>
        <DataTable
          data={allDocuments}
          columns={Columns({
            onEdit: (document: ApiDocument) => {
              documentSidebar.open({
                documentId: document.id,
                procedureId: procedureId,
                isProcedureFinalized: isProcedureFinalized(procedureDetails),
              });
            },
            onDelete: async (document: ApiDocument) => {
              await deleteDocument.mutateAsync(document.id);
            },
            isProcedureFinalized: () => {
              return isProcedureFinalized(procedureDetails);
            },
          })}
          rowNavigation={{
            onClick: (row) => () => {
              documentSidebar.open({
                documentId: row.original.id,
                procedureId: procedureId,
                isProcedureFinalized: isProcedureFinalized(procedureDetails),
              });
            },
            focusColumnAccessorKey: "documentType.GERMAN",
          }}
          noDataComponent={() => (
            <NoDocumentsAvailable
              isProcedureFinalized={isProcedureFinalized(procedureDetails)}
              onAdd={() => addDocumentSidebar.open({ procedureId })}
            />
          )}
          minWidth={1200}
        />
      </TableSheet>
    </TablePage>
  );
}

interface NoDocumentsAvailableProps {
  onAdd?: () => void;
  isProcedureFinalized: boolean;
}

function NoDocumentsAvailable({
  onAdd,
  isProcedureFinalized,
}: Readonly<NoDocumentsAvailableProps>) {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <DescriptionOutlined sx={{ height: "40px", width: "40px" }} />
      <Typography sx={{ mt: 2, mb: 3 }}>
        Noch keine Dokumente hinzugefügt
      </Typography>
      {!isProcedureFinalized && (
        <Button
          endDecorator={<AddOutlined />}
          aria-label="Dokument hinzufügen"
          onClick={onAdd}
        >
          Dokument hinzufügen
        </Button>
      )}
    </Stack>
  );
}
