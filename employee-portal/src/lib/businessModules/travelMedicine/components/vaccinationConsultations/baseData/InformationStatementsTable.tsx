/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInformationStatement,
  ApiTravelMedicineFeature,
} from "@eshg/employee-portal-api/travelMedicine";
import { AddOutlined } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";

import { useDeleteInformationStatement } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";
import { useInformationStatementSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/InformationStatementSidebar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

import { informationStatementsColumns } from "./InformationStatementsColumns";

export function InformationStatementsTable({
  procedureId,
  isProcedureClosed,
  data,
}: Readonly<{
  procedureId: string;
  isProcedureClosed: boolean;
  data: ApiInformationStatement[];
}>) {
  const deleteInformationStatementApi = useDeleteInformationStatement();
  const isInformationStatementEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalInformationStatement,
  );

  const informationStatementSidebar = useInformationStatementSidebar();

  function deleteInformationStatement(informationStatementId: string) {
    return deleteInformationStatementApi.mutate({
      procedureId,
      informationStatementId,
    });
  }

  return (
    <TablePage data-testid="vc-information-statements">
      <TableSheet
        title={<TableTitle title="Aufklärungsbögen" />}
        footer={
          !isProcedureClosed &&
          isInformationStatementEnabled && (
            <Grid xs={12}>
              <Button
                color="primary"
                variant="plain"
                startDecorator={<AddOutlined />}
                onClick={() =>
                  informationStatementSidebar.open({
                    procedureId: procedureId,
                  })
                }
                disabled={isProcedureClosed}
              >
                Bogen hinzufügen
              </Button>
            </Grid>
          )
        }
        hideTable={data.length === 0}
      >
        <DataTable
          data={data}
          columns={informationStatementsColumns({
            isProcedureClosed,
            onDeleteInformationStatement: (informationStatementId: string) =>
              deleteInformationStatement(informationStatementId),
          })}
        />
      </TableSheet>
    </TablePage>
  );
}
