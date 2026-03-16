/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AddOutlined, DescriptionOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { doNothing } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
  useConfirmationDialog,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import { useNavigation, useSnackbar } from "@eshg/lib-portal";
import { ApiOmsAssessment } from "@eshg/official-medical-service-api";

import { useDeleteAssessment } from "@/lib/businessModules/officialMedicalService/api/mutations/omsAssessmentApi";
import { useGetAllAssessments } from "@/lib/businessModules/officialMedicalService/api/queries/assessmentApi";
import { useGetProcedureDetails } from "@/lib/businessModules/officialMedicalService/api/queries/employeeOmsProcedureApi";
import { useAddAssessmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/AddAssessmentSidebar";
import { Columns } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/Columns";
import { useIsAssessmentOwner } from "@/lib/businessModules/officialMedicalService/components/procedures/details/assessments/helpers";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";

interface AssessmentsTableProps {
  procedureId: string;
}

export function AssessmentsTable({
  procedureId,
}: Readonly<AssessmentsTableProps>) {
  const addAssessmentSidebar = useAddAssessmentSidebar();
  const deleteAssessment = useDeleteAssessment();
  const snackbar = useSnackbar();
  const { openConfirmationDialog } = useConfirmationDialog();
  const { tryNavigate } = useNavigation();

  const isAssessmentOwner = useIsAssessmentOwner();
  const canUserCreateAssessments = useHasUserRoleCheck(
    ApiUserRole.OfficialMedicalServiceAssessmentCreate,
  );

  const [{ data: procedure }, { data: allAssessments }] = useSuspenseQueries({
    queries: [
      useGetProcedureDetails(procedureId),
      useGetAllAssessments(procedureId),
    ],
  });

  const canCreateAssessment =
    canUserCreateAssessments && !isProcedureFinalized(procedure);

  return (
    <TablePage
      fullHeight
      controls={
        canCreateAssessment && (
          <ButtonBar
            right={
              <Button
                autoFocus
                endDecorator={<AddOutlined />}
                aria-label="Schriftgut hinzufügen"
                onClick={() => addAssessmentSidebar.open({ procedure })}
              >
                Schriftgut hinzufügen
              </Button>
            }
            alignItems="flex-end"
          />
        )
      }
    >
      <TableSheet title={<TableTitle title="Schriftgut" />}>
        <DataTable
          data={allAssessments}
          columns={Columns({
            onDisplaySummary: (assessment: ApiOmsAssessment) =>
              snackbar.notification(assessment.title),
            onEdit: (assessment: ApiOmsAssessment) =>
              tryNavigate(
                routes.procedures
                  .byId(procedureId)
                  .assessmentDetails(assessment.id),
              ),
            onDelete: ({ id }: ApiOmsAssessment) =>
              deleteAssessment.mutateAsync(id),
          })}
          rowNavigation={{
            onClick: (row) => () => {
              if (
                !isAssessmentOwner(row.original) &&
                row.original.assessmentStatus === "OPEN"
              ) {
                return openConfirmationDialog({
                  title: "Schriftgut noch in Arbeit",
                  description:
                    "Dieses Schriftgut befindet sich aktuell in Bearbeitung. Solange es nicht abgeschlossen ist, kann es nur von den zuständigen Mitarbeitenden eingesehen werden.",
                  confirmLabel: "Ok",
                  color: "primary",
                  onConfirm: doNothing(),
                  hideCancelButton: true,
                });
              }
              tryNavigate(
                routes.procedures
                  .byId(procedureId)
                  .assessmentDetails(row.original.id),
              );
            },
            focusColumnAccessorKey: "title",
          }}
          noDataComponent={() => (
            <NoAssessmentsAvailable
              canAddAssessment={canCreateAssessment}
              onAdd={() => addAssessmentSidebar.open({ procedure })}
            />
          )}
          minWidth={1200}
        />
      </TableSheet>
    </TablePage>
  );
}

interface NoAssessmentsAvailableProps {
  onAdd?: () => void;
  canAddAssessment: boolean;
}

function NoAssessmentsAvailable({
  onAdd,
  canAddAssessment,
}: Readonly<NoAssessmentsAvailableProps>) {
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
        Noch keine Schriftgüter hinzugefügt
      </Typography>
      {canAddAssessment && (
        <Button
          endDecorator={<AddOutlined />}
          aria-label="Schriftgut hinzufügen"
          onClick={onAdd}
        >
          Schriftgut hinzufügen
        </Button>
      )}
    </Stack>
  );
}
