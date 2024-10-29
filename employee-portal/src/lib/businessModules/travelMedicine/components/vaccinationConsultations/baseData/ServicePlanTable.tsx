/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiCreatedByUserType,
  ApiServicePlanEntry,
  ApiServiceStatus,
} from "@eshg/employee-portal-api/travelMedicine";
import { AddOutlined } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useDeleteAppointmentEp } from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";
import {
  useDeleteService,
  useUnassignStepToService,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { servicePlanColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanColumns";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";
import { useAddServiceAppointmentSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/AddServiceAppointmentSidebar";
import { useAddServicePlanSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/AddServicePlanSidebar";
import { useAssignServiceSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/AssignServiceSidebar";
import { useEditEarliestDateSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/EditEarliestDateSidebar";
import { useEditServiceAppointmentSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/EditServiceAppointmentSidebar";
import { useOtherServiceAppliedSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/OtherServiceAppliedSidebar";
import { useServiceAppliedSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/ServiceAppliedSidebar";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useSessionStorage } from "@/lib/shared/hooks/useSessionStorage";

export function ServicePlanTable({
  procedureId,
  isProcedureClosed,
  data,
  initialAppointmentProcedureStepId,
  createdByUserType,
}: Readonly<{
  procedureId: string;
  isProcedureClosed: boolean;
  data: ApiServicePlanEntry[];
  initialAppointmentProcedureStepId: string;
  createdByUserType: ApiCreatedByUserType;
}>) {
  const [currentUsers, setCurrentUsers] = useSessionStorage(
    { physician: "", medicalAssistant: "" },
    "most-recent-users",
  );
  const router = useRouter();

  const deleteServiceApi = useDeleteService();
  const cancelAppointmentApi = useDeleteAppointmentEp();
  const unassignStepApi = useUnassignStepToService();

  const addServiceAppointmentSidebar = useAddServiceAppointmentSidebar();
  const addServicePlanSidebar = useAddServicePlanSidebar();
  const editServiceAppointmentSidebar = useEditServiceAppointmentSidebar();
  const assignServiceSidebar = useAssignServiceSidebar();
  const serviceAppliedSidebar = useServiceAppliedSidebar();
  const otherServiceAppliedSidebar = useOtherServiceAppliedSidebar();
  const editEarliestDateSidebar = useEditEarliestDateSidebar();

  function deleteService(procedureId: string, serviceId: string) {
    return deleteServiceApi.mutate({ procedureId, serviceId });
  }

  function deleteAppointment(serviceId: string) {
    return cancelAppointmentApi.mutate({ procedureStepId: serviceId });
  }

  function unassignStepToService(procedureId: string, serviceId: string) {
    unassignStepApi.mutate({ procedureId, serviceId });
  }

  function openMedicalHistory(procedureId: string, procedureStepId?: string) {
    router.push(
      routes.procedures.medicalHistories(procedureId, procedureStepId),
    );
  }

  function navigateToCertificates(procedureId: string) {
    router.push(routes.procedures.certificates(procedureId));
  }

  function isCitizenFollowUp(procedureStepId: string) {
    return (
      createdByUserType === ApiCreatedByUserType.CitizenPortal &&
      !isInitialStep(procedureStepId)
    );
  }

  function isInitialStep(procedureStepId: string) {
    return procedureStepId === initialAppointmentProcedureStepId;
  }

  return (
    <TablePage data-testid="vc-service-plan">
      <TableSheet
        title={<TableTitle title="Leistungsplan" />}
        footer={
          !isProcedureClosed && (
            <Grid xs={12}>
              <Button
                color="primary"
                variant="plain"
                startDecorator={<AddOutlined />}
                onClick={() => {
                  addServicePlanSidebar.open({ procedureId: procedureId });
                }}
                disabled={!procedureId}
              >
                Leistung hinzufügen
              </Button>
              {data.length > 0 && (
                <Button
                  color="primary"
                  variant="plain"
                  startDecorator={<AddOutlined />}
                  onClick={() =>
                    addServiceAppointmentSidebar.open({
                      procedureId: procedureId,
                      isCitizenFollowUp: isCitizenFollowUp(procedureId),
                    })
                  }
                  disabled={data.every(
                    (curState) => curState.status !== ApiServiceStatus.Open,
                  )}
                >
                  Impftermin erstellen
                </Button>
              )}
            </Grid>
          )
        }
        hideTable={data.length === 0}
      >
        <DataTable
          data={data}
          columns={servicePlanColumns({
            isProcedureClosed,
            isCitizenProcedure:
              createdByUserType === ApiCreatedByUserType.CitizenPortal,
            isCitizenFollowUp: (procedureStepId) =>
              isCitizenFollowUp(procedureStepId),
            onDeleteService: (serviceId) =>
              deleteService(procedureId, serviceId),
            onUnassignService: (serviceId) =>
              unassignStepToService(procedureId, serviceId),
            onOpenMedicalHistory: (procedureStepId) =>
              openMedicalHistory(procedureId, procedureStepId),
            onOpenCertificatesTab: () => navigateToCertificates(procedureId),
            onEditServiceAppointment: (procedureStep) =>
              editServiceAppointmentSidebar.open({
                procedureId: procedureId,
                procedureStep: procedureStep,
                isInitialStep: (procedureStepId) =>
                  isInitialStep(procedureStepId),
              }),
            onAssignService: (serviceId) =>
              assignServiceSidebar.open({
                procedureId: procedureId,
                serviceId: serviceId,
              }),
            onServiceApplied: (service) =>
              serviceAppliedSidebar.open({
                procedureId: procedureId,
                storedUsers: currentUsers,
                setStoredUsers: setCurrentUsers,
                service: service,
              }),
            onOtherServiceApplied: (service) =>
              otherServiceAppliedSidebar.open({
                procedureId: procedureId,
                storedUsers: currentUsers,
                setStoredUsers: setCurrentUsers,
                service: service,
              }),
            onEditEarliestDate: (service) =>
              editEarliestDateSidebar.open({
                procedureId: procedureId,
                service: service,
              }),
            onCancelAppointment: (procedureStepId) =>
              deleteAppointment(procedureStepId),
          })}
        />
      </TableSheet>
    </TablePage>
  );
}
