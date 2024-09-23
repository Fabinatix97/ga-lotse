/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiServicePlanEntry,
} from "@eshg/employee-portal-api/travelMedicine";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import {
  useDeleteService,
  useUnassignStepToService,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { vaccinationConsultationServicePlanColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/servicePlanColumns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function VaccinationConsultationServicePlanTable({
  procedureId,
  isProcedureClosed,
  data,
  title,
  footer,
  selectAppointmentOnChange,
  selectEditAppointmentOnChange,
  serviceAppliedOnChange,
  otherServiceAppliedOnChange,
}: Readonly<{
  procedureId: string;
  isProcedureClosed: boolean;
  data: ApiServicePlanEntry[];
  title: ReactNode;
  footer: ReactNode;
  selectAppointmentOnChange: (serviceId: string) => void;
  selectEditAppointmentOnChange: (
    procedureStepId: string,
    appointmentType: ApiAppointmentType,
    appointment: Date,
    appointmentBookingType: ApiAppointmentBookingType,
  ) => void;
  serviceAppliedOnChange: (
    serviceId: string,
    status: string,
    vaccinationInfo: string,
    vaccineName: string,
    batchIdentifier: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant: string,
  ) => void;
  otherServiceAppliedOnChange: (
    serviceId: string,
    status: string,
    serviceTypeDescription: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant: string,
  ) => void;
}>) {
  const deleteServiceApi = useDeleteService();
  const unassignStepApi = useUnassignStepToService();
  const router = useRouter();

  function deleteService(procedureId: string, serviceId: string) {
    return deleteServiceApi.mutate({ procedureId, serviceId });
  }

  function unassignStepToService(procedureId: string, serviceId: string) {
    unassignStepApi.mutate({ procedureId, serviceId });
  }

  function openServiceAppointmentSideBar(serviceId: string) {
    selectAppointmentOnChange(serviceId);
  }

  function openEditAppointmentSideBar(
    procedureStepId: string,
    appointmentType: ApiAppointmentType,
    appointment: Date,
    appointmentBookingType: ApiAppointmentBookingType,
  ) {
    selectEditAppointmentOnChange(
      procedureStepId,
      appointmentType,
      appointment,
      appointmentBookingType,
    );
  }

  function openOtherServiceAppliedSideBar(
    serviceId: string,
    status: string,
    serviceTypeDescription: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant: string,
  ) {
    otherServiceAppliedOnChange(
      serviceId,
      status,
      serviceTypeDescription,
      appliedAt,
      physician,
      medicalAssistant,
    );
  }

  function openServiceAppliedSideBar(
    serviceId: string,
    status: string,
    vaccinationInfo: string,
    vaccineName: string,
    batchIdentifier: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant: string,
  ) {
    serviceAppliedOnChange(
      serviceId,
      status,
      vaccinationInfo,
      vaccineName,
      batchIdentifier,
      appliedAt,
      physician,
      medicalAssistant,
    );
  }

  function openMedicalHistory(procedureId: string, procedureStepId?: string) {
    router.push(
      routes.procedures.medicalHistories(procedureId, procedureStepId),
    );
  }

  function navigateToCertificates(procedureId: string) {
    router.push(routes.procedures.certificates(procedureId));
  }

  return (
    <TablePage data-testid="vc-service-plan">
      <TableSheet title={title} footer={footer} hideTable={data.length === 0}>
        <DataTable
          data={data}
          columns={vaccinationConsultationServicePlanColumns(
            procedureId,
            isProcedureClosed,
            deleteService,
            unassignStepToService,
            openServiceAppointmentSideBar,
            openEditAppointmentSideBar,
            openServiceAppliedSideBar,
            openOtherServiceAppliedSideBar,
            openMedicalHistory,
            navigateToCertificates,
          )}
        />
      </TableSheet>
    </TablePage>
  );
}
