/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInformationStatement,
  ApiTravelMedicineFeature,
} from "@eshg/employee-portal-api/travelMedicine";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { AddOutlined } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";
import { useState } from "react";

import { useDeleteInformationStatement } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import {
  InformationStatementSidebar,
  initialValuesInformationStatementSidebar,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/InformationStatementSidebar";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

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

  const [informationStatementSidebar, setInformationStatementSidebar] =
    useState<VaccinationConsultationSidebarsProps>({
      open: false,
      initialValues: { ...initialValuesInformationStatementSidebar },
    });

  const alertContext = useAlertContext();

  function resetAlertContext() {
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
  }

  const { closeSidebar } = useSidebarForm({
    onClose: () => {
      setInformationStatementSidebar({
        open: false,
        initialValues: { ...initialValuesInformationStatementSidebar },
      });
      resetAlertContext();
    },
  });

  function deleteInformationStatement(
    procedureId: string,
    informationStatementId: string,
  ) {
    return deleteInformationStatementApi.mutate({
      procedureId,
      informationStatementId,
    });
  }

  function handleCrateInformationStatements() {
    setInformationStatementSidebar({
      open: true,
      initialValues: {
        ...informationStatementSidebar.initialValues,
        procedureId: procedureId,
      },
    });
  }

  return (
    <>
      <TablePage data-testid="vc-information-statements">
        <TableSheet
          title={<TableTitle title="Aufklärungsbögen" />}
          footer={
            !isProcedureClosed && (
              <Grid xs={12}>
                <Button
                  color="primary"
                  variant="plain"
                  startDecorator={<AddOutlined />}
                  onClick={handleCrateInformationStatements}
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
            columns={informationStatementsColumns(
              procedureId,
              isProcedureClosed,
              deleteInformationStatement,
            )}
          />
        </TableSheet>
      </TablePage>
      <OverlayBoundary>
        {isInformationStatementEnabled && informationStatementSidebar.open && (
          <InformationStatementSidebar
            onCancel={closeSidebar}
            onClose={(item) => {
              setInformationStatementSidebar({
                open: item.open,
                initialValues: { ...item.initialValues },
              });
            }}
            onSuccess={closeSidebar}
            open={informationStatementSidebar.open}
            initialValues={informationStatementSidebar.initialValues}
          />
        )}
      </OverlayBoundary>
    </>
  );
}
