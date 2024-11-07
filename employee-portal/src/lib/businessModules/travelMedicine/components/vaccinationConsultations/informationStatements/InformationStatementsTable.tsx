/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiProcedureStatus,
  ApiTravelMedicineFeature,
} from "@eshg/employee-portal-api/travelMedicine";
import { AddOutlined, DocumentScannerOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useDeleteInformationStatement } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import {
  useGetAllInformationStatementsQuery,
  useGetStatusQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useInformationStatementSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/informationStatements/InformationStatementSidebar";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

import { informationStatementsColumns } from "./InformationStatementsColumns";

export function InformationStatementsTable({
  procedureId,
}: Readonly<{
  procedureId: string;
}>) {
  const deleteInformationStatementApi = useDeleteInformationStatement();
  const isInformationStatementEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalInformationStatement,
  );

  const [{ data: allInformationStatements }, { data: status }] =
    useSuspenseQueries({
      queries: [
        useGetAllInformationStatementsQuery(procedureId),
        useGetStatusQuery(procedureId),
      ],
    });

  const informationStatementSidebar = useInformationStatementSidebar();

  const isProcedureClosed = status === ApiProcedureStatus.Closed;

  function deleteInformationStatement(informationStatementId: string) {
    return deleteInformationStatementApi.mutate({
      procedureId,
      informationStatementId,
    });
  }

  return (
    <TablePage
      data-testid="vc-information-statements"
      fullHeight
      controls={
        !isProcedureClosed &&
        isInformationStatementEnabled && (
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
            onDeleteInformationStatement: (informationStatementId: string) =>
              deleteInformationStatement(informationStatementId),
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
