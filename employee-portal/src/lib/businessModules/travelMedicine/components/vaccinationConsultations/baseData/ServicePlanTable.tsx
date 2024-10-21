/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiServicePlanEntry,
  ApiServiceStatus,
} from "@eshg/employee-portal-api/travelMedicine";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { AddOutlined } from "@mui/icons-material";
import { Button, Grid } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useDeleteService,
  useUnassignStepToService,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  AssignAppointmentSidebar,
  AssignAppointmentValues,
  initialValuesAssignAppointmentSidebar,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AssignAppointmentSidebar";
import {
  OtherServiceAppliedSideBar,
  OtherServiceAppliedValues,
  initialOtherServiceAppliedValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/OtherServiceAppliedSideBar";
import {
  ServiceAppliedSideBar,
  ServiceAppliedValues,
  initialServiceAppliedValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServiceAppliedSideBar";
import {
  Mode,
  ServiceAppointmentSidebar,
  ServiceAppointmentValues,
  initialServiceAppointmentValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServiceAppointmentSidebar";
import { servicePlanColumns } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanColumns";
import {
  ServicePlanSidebar,
  ServiceValues,
  initialValuesServicePlanSidebar,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanSidebar";
import { TableTitle } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TableTitle";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { useSessionStorage } from "@/lib/businessModules/travelMedicine/hooks/useSessionStorage";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export function ServicePlanTable({
  procedureId,
  isProcedureClosed,
  data,
}: Readonly<{
  procedureId: string;
  isProcedureClosed: boolean;
  data: ApiServicePlanEntry[];
}>) {
  const deleteServiceApi = useDeleteService();
  const unassignStepApi = useUnassignStepToService();
  const router = useRouter();
  const { openCancelDialog } = useConfirmationDialog();

  const [assignAppointmentSidebar, setAssignAppointmentSidebar] =
    useState<VaccinationConsultationSidebarsProps>({
      open: false,
      initialValues: { ...initialValuesAssignAppointmentSidebar },
    });
  const [servicePlanSidebar, setServicePlanSidebar] =
    useState<VaccinationConsultationSidebarsProps>({
      open: false,
      initialValues: { ...initialValuesServicePlanSidebar },
    });
  const [serviceAppointmentSidebar, setServiceAppointmentSidebar] =
    useState<VaccinationConsultationSidebarsProps>({
      open: false,
      mode: Mode.create,
      initialValues: { ...initialServiceAppointmentValues },
    });

  const [serviceAppliedSideBar, setServiceAppliedSideBar] =
    useState<VaccinationConsultationSidebarsProps>({
      open: false,
      initialValues: { ...initialServiceAppliedValues },
    });

  const [otherServiceAppliedSideBar, setOtherServiceAppliedSideBar] =
    useState<VaccinationConsultationSidebarsProps>({
      open: false,
      initialValues: { ...initialOtherServiceAppliedValues },
    });

  const { closeSidebar } = useSidebarForm({
    onClose: () => {
      setServiceAppliedSideBar({
        open: false,
        initialValues: {
          ...initialServiceAppliedValues,
        },
      });
      setOtherServiceAppliedSideBar({
        open: false,
        initialValues: {
          ...initialOtherServiceAppliedValues,
        },
      });
      setServiceAppointmentSidebar({
        ...serviceAppointmentSidebar,
        open: false,
        initialValues: {
          ...initialServiceAppointmentValues,
        },
      });
      setAssignAppointmentSidebar({
        open: false,
        initialValues: {
          ...initialValuesAssignAppointmentSidebar,
        },
      });
      setServicePlanSidebar({
        open: false,
        initialValues: {
          ...servicePlanSidebar.initialValues,
          services: [...initialValuesServicePlanSidebar.services],
        },
      });
      resetAlertContext();
    },
  });

  const [currentUsers, setCurrentUsers] = useSessionStorage(
    { physician: "", medicalAssistant: "" },
    "most-recent-users",
  );

  const resetAlertContext = useResetAlertContext();

  function handleCancel(
    currentValues:
      | AssignAppointmentValues
      | OtherServiceAppliedValues
      | ServiceValues
      | ServiceAppointmentValues
      | ServiceAppliedValues,
    initialValues:
      | AssignAppointmentValues
      | OtherServiceAppliedValues
      | ServiceValues
      | ServiceAppointmentValues
      | ServiceAppliedValues,
    dirty: boolean,
  ) {
    if (
      dirty ||
      JSON.stringify(currentValues) === JSON.stringify(initialValues)
    ) {
      openCancelDialog({
        onConfirm: closeSidebar,
      });
    } else {
      closeSidebar();
    }
  }

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

  function handleAssignAppointment(serviceId: string) {
    setAssignAppointmentSidebar({
      open: true,
      initialValues: {
        ...assignAppointmentSidebar.initialValues,
        procedureId: procedureId,
        serviceId: serviceId,
      },
    });
  }

  function handleEditAppointment(
    procedureStepId: string,
    appointmentType: ApiAppointmentType,
    appointment: Date,
    appointmentBookingType: ApiAppointmentBookingType,
  ) {
    setServiceAppointmentSidebar({
      open: true,
      mode: Mode.edit,
      initialValues: {
        ...serviceAppointmentSidebar.initialValues,
        procedureId: procedureId,
        procedureStepId: procedureStepId,
        appointmentType: appointmentType,
        appointment: appointment,
        bookingType: appointmentBookingType,
      },
    });
  }

  function handleOtherServiceApplied(
    serviceId: string,
    serviceStatus: string,
    serviceTypeDescription: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant?: string,
  ) {
    const lastServiceAppliedSideBarValues = {
      ...otherServiceAppliedSideBar.initialValues,
    } as OtherServiceAppliedValues;
    const lastPhysician = lastServiceAppliedSideBarValues.physician;
    const lastMedicalAssistant =
      lastServiceAppliedSideBarValues.medicalAssistant;

    setOtherServiceAppliedSideBar({
      open: true,
      initialValues: {
        procedureId: procedureId,
        serviceId: serviceId,
        serviceStatus: serviceStatus,
        serviceTypeDescription: serviceTypeDescription,
        appliedAt:
          serviceStatus === ApiServiceStatus.Planned
            ? toDateString(new Date())
            : toDateString(appliedAt),
        physician:
          serviceStatus === ApiServiceStatus.Accomplished
            ? physician
            : lastPhysician,
        medicalAssistant:
          serviceStatus === ApiServiceStatus.Accomplished
            ? medicalAssistant
            : lastMedicalAssistant,
      },
    });
  }

  function handleServiceApplied(
    serviceId: string,
    serviceStatus: string,
    vaccinationInfo: string,
    vaccineName: string,
    batchIdentifier: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant?: string,
  ) {
    const lastServiceAppliedSideBarValues = {
      ...serviceAppliedSideBar.initialValues,
    } as ServiceAppliedValues;
    const lastBatchIdentifier = lastServiceAppliedSideBarValues.batchIdentifier;
    const lastPhysician = lastServiceAppliedSideBarValues.physician;
    const lastMedicalAssistant =
      lastServiceAppliedSideBarValues.medicalAssistant;

    setServiceAppliedSideBar({
      open: true,
      initialValues: {
        procedureId: procedureId,
        serviceId: serviceId,
        serviceStatus: serviceStatus,
        vaccinationInfo: vaccinationInfo,
        vaccineName: vaccineName,
        batchIdentifier:
          serviceStatus === ApiServiceStatus.Planned
            ? lastBatchIdentifier
            : batchIdentifier,
        appliedAt:
          serviceStatus === ApiServiceStatus.Planned
            ? toDateString(new Date())
            : toDateString(appliedAt),
        physician:
          serviceStatus === ApiServiceStatus.Accomplished
            ? physician
            : lastPhysician,
        medicalAssistant:
          serviceStatus === ApiServiceStatus.Accomplished
            ? medicalAssistant
            : lastMedicalAssistant,
      },
    });
  }

  return (
    <>
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
                    setServicePlanSidebar({
                      open: true,
                      initialValues: {
                        ...servicePlanSidebar.initialValues,
                        procedureId: procedureId,
                      },
                    });
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
                    onClick={() => {
                      setServiceAppointmentSidebar({
                        open: true,
                        mode: Mode.create,
                        initialValues: {
                          ...serviceAppointmentSidebar.initialValues,
                          procedureId: procedureId,
                        },
                      });
                    }}
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
            columns={servicePlanColumns(
              procedureId,
              isProcedureClosed,
              deleteService,
              unassignStepToService,
              handleAssignAppointment,
              handleEditAppointment,
              handleServiceApplied,
              handleOtherServiceApplied,
              openMedicalHistory,
              navigateToCertificates,
            )}
          />
        </TableSheet>
      </TablePage>

      <OverlayBoundary>
        {servicePlanSidebar.open && (
          <ServicePlanSidebar
            onCancel={(currentValues, initialValues, dirty) => {
              handleCancel(currentValues, initialValues, dirty);
            }}
            onSuccess={closeSidebar}
            initialValues={servicePlanSidebar.initialValues as ServiceValues}
            open={servicePlanSidebar.open}
            onClose={(item) => {
              setServicePlanSidebar({
                open: item.open,
                initialValues: {
                  ...item.initialValues,
                },
              });
            }}
          ></ServicePlanSidebar>
        )}

        {assignAppointmentSidebar.open && (
          <AssignAppointmentSidebar
            onCancel={(currentValues, initialValues, dirty) => {
              handleCancel(currentValues, initialValues, dirty);
            }}
            onSuccess={closeSidebar}
            open={assignAppointmentSidebar.open}
            initialValues={
              assignAppointmentSidebar.initialValues as AssignAppointmentValues
            }
            onClose={(item) => {
              setAssignAppointmentSidebar({
                open: item.open,
                initialValues: {
                  ...item.initialValues,
                },
              });
            }}
          ></AssignAppointmentSidebar>
        )}

        {serviceAppointmentSidebar.open && (
          <ServiceAppointmentSidebar
            mode={serviceAppointmentSidebar.mode!}
            open={serviceAppointmentSidebar.open}
            onClose={(item) => {
              setServiceAppointmentSidebar({
                open: item.open,
                mode: item.mode,
                initialValues: {
                  ...item.initialValues,
                },
              });
            }}
            initialValues={
              serviceAppointmentSidebar.initialValues as ServiceAppointmentValues
            }
            onCancel={(currentValues, initialValues, dirty) => {
              handleCancel(currentValues, initialValues, dirty);
            }}
            onSuccess={closeSidebar}
          ></ServiceAppointmentSidebar>
        )}

        {serviceAppliedSideBar.open && (
          <ServiceAppliedSideBar
            open={serviceAppliedSideBar.open}
            onCancel={(currentValues, initialValues, dirty) => {
              handleCancel(currentValues, initialValues, dirty);
            }}
            storeUsers={setCurrentUsers}
            currentUsers={currentUsers}
            initialValues={
              serviceAppliedSideBar.initialValues as ServiceAppliedValues
            }
            onClose={(item) => {
              setServiceAppliedSideBar({
                open: item.open,
                initialValues: {
                  ...item.initialValues,
                },
              });
            }}
            onSuccess={closeSidebar}
          />
        )}

        {otherServiceAppliedSideBar.open && (
          <OtherServiceAppliedSideBar
            open={otherServiceAppliedSideBar.open}
            onCancel={(currentValues, initialValues, dirty) => {
              handleCancel(currentValues, initialValues, dirty);
            }}
            storeUsers={setCurrentUsers}
            currentUsers={currentUsers}
            initialValues={
              otherServiceAppliedSideBar.initialValues as OtherServiceAppliedValues
            }
            onClose={(item) => {
              setOtherServiceAppliedSideBar({
                open: item.open,
                initialValues: {
                  ...item.initialValues,
                },
              });
            }}
            onSuccess={closeSidebar}
          />
        )}
      </OverlayBoundary>
    </>
  );
}
