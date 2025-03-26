/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DataTable,
  TablePage,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiCreatedByUserType,
  ApiServicePlanEntry,
  ApiServicePlanGroup,
  ApiServiceStatus,
} from "@eshg/travel-medicine-api";
import { AddOutlined } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useDeleteAppointmentEp } from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";
import {
  useDeleteService,
  useUnassignStepToService,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  useGetAllMedicalAssistantsQuery,
  useGetAllPhysiciansQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
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
import { useSessionStorage } from "@/lib/shared/hooks/useSessionStorage";

function getSubRows(servicePlanEntry: ServicePlanEntry) {
  return servicePlanEntry.subRows;
}

export interface ServicePlanEntry {
  appointment?: Date;
  appointmentBookingType?: ApiAppointmentBookingType;
  appointmentType?: ApiAppointmentType;
  earliestDate?: Date;
  fee: number;
  medicalHistoryCompleted?: boolean;
  citizenHasAnswered?: boolean;
  procedureStepId?: string;
  appliedAt?: Date;
  defaultBatchIdentifier?: string;
  batchIdentifier?: string;
  diseaseName?: string;
  latency?: number;
  mfa?: string;
  physician?: string;
  serviceId: string;
  serviceTypeDescription: string;
  status?: ApiServiceStatus;
  vaccinationNumber?: number;
  vaccineName?: string;
  subRows?: ServicePlanEntry[];
}

export function ServicePlanTable({
  procedureId,
  isProcedureClosed,
  data,
  initialAppointmentProcedureStepId,
  createdByUserType,
}: Readonly<{
  procedureId: string;
  isProcedureClosed: boolean;
  data: ApiServicePlanGroup[];
  initialAppointmentProcedureStepId: string;
  createdByUserType: ApiCreatedByUserType;
}>) {
  const [currentUsers, setCurrentUsers] = useSessionStorage(
    { physician: "", medicalAssistant: "" },
    "most-recent-users",
  );

  const { openConfirmationDialog } = useConfirmationDialog();
  const router = useRouter();

  const deleteServiceApi = useDeleteService();
  const unassignStepApi = useUnassignStepToService();
  const cancelAppointmentApi = useDeleteAppointmentEp();

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

  const [{ data: allPhysicians }, { data: allMedicalAssistants }] =
    useSuspenseQueries({
      queries: [useGetAllPhysiciansQuery(), useGetAllMedicalAssistantsQuery()],
    });

  const rows = data.map(toServicePlanEntryGroup);

  function toServicePlanEntryGroup(
    servicePlanEntryGroup: ApiServicePlanGroup,
  ): ServicePlanEntry {
    return {
      serviceId: "",
      serviceTypeDescription: "",
      appointment: servicePlanEntryGroup.appointment,
      appointmentBookingType: servicePlanEntryGroup.appointmentBookingType,
      appointmentType: servicePlanEntryGroup.appointmentType,
      earliestDate: servicePlanEntryGroup.earliestDate,
      fee: servicePlanEntryGroup.fee,
      medicalHistoryCompleted: servicePlanEntryGroup.medicalHistoryCompleted,
      citizenHasAnswered: servicePlanEntryGroup.citizenHasAnswered,
      procedureStepId: servicePlanEntryGroup.procedureStepId,
      subRows: servicePlanEntryGroup.servicePlanEntries.map(
        (servicePlanEntry) => toServicePlanEntry(servicePlanEntry),
      ),
    };
  }

  function toServicePlanEntry(
    servicePlanEntry: ApiServicePlanEntry,
  ): ServicePlanEntry {
    return {
      appliedAt: servicePlanEntry.appliedAt,
      defaultBatchIdentifier: servicePlanEntry.defaultBatchIdentifier,
      batchIdentifier: servicePlanEntry.batchIdentifier,
      diseaseName: servicePlanEntry.diseaseName,
      fee: servicePlanEntry.fee,
      latency: servicePlanEntry.latency,
      mfa: servicePlanEntry.mfa,
      physician: servicePlanEntry.physician,
      serviceId: servicePlanEntry.serviceId,
      serviceTypeDescription: servicePlanEntry.serviceTypeDescription,
      status: servicePlanEntry.status,
      vaccinationNumber: servicePlanEntry.vaccinationNumber,
      vaccineName: servicePlanEntry.vaccineName,
    };
  }

  function hasOpenServices(servicePlan: ApiServicePlanGroup[]) {
    return servicePlan.some((a) => {
      return a.servicePlanEntries.some((s) => {
        return s.status === "OPEN";
      });
    });
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
              >
                Leistung hinzufügen
              </Button>
              {hasOpenServices(data) && (
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
          data={rows}
          getSubRows={getSubRows}
          columns={servicePlanColumns({
            allPhysicians: allPhysicians,
            allMedicalAssistants: allMedicalAssistants,
            isProcedureClosed,
            isCitizenProcedure:
              createdByUserType === ApiCreatedByUserType.CitizenPortal,
            isInitialStep: (procedureStepId) => isInitialStep(procedureStepId),
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
            onEditEarliestDate: (procedureStep) =>
              editEarliestDateSidebar.open({
                procedureId: procedureId,
                procedureStep: procedureStep,
              }),
            onCancelAppointment: (procedureStepId) =>
              openConfirmationDialog({
                title: "Termin absagen?",
                description:
                  "Wollen Sie den Termin wirklich absagen? Die zu impfende Person erhält eine Bestätigung per E-Mail.",
                confirmLabel: "Bestätigen",
                onConfirm: async () =>
                  await cancelAppointmentApi.mutateAsync({
                    procedureStepId: procedureStepId,
                  }),
              }),
          })}
          striped={false}
          initialExpanded={true}
          minWidth={1700}
        />
      </TableSheet>
    </TablePage>
  );
}
