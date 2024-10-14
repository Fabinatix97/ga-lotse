/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiServicePlanEntry,
  ApiServiceStatus,
} from "@eshg/employee-portal-api/travelMedicine";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  FormatListBulletedOutlined,
  HorizontalRuleOutlined,
  TextSnippetOutlined,
  VaccinesOutlined,
} from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { statusColors } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/constants";
import { STATUS_NAMES } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/translations";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { LOCALE_OPTION, formatCurrency } from "@/lib/shared/helpers/numbers";

const columnHelper: ColumnHelper<ApiServicePlanEntry> =
  createColumnHelper<ApiServicePlanEntry>();

function formatDiseaseName(diseaseName: string | undefined) {
  return diseaseName ? <Chip color={"primary"}>{diseaseName}</Chip> : "";
}

function formatLatency(latency: number | undefined) {
  return latency ? `+ ${latency} Wochen` : "-";
}

function formatVaccinationInfo(diseaseName: string, vaccinationNumber: number) {
  return !vaccinationNumber
    ? diseaseName + " - Nr. " + vaccinationNumber
    : diseaseName;
}

export function servicePlanColumns(
  procedureId: string,
  isProcedureClosed: boolean,
  deleteService: (procedureId: string, serviceId: string) => void,
  unassignStepToService: (procedureId: string, serviceId: string) => void,
  openAssignAppointment: (serviceId: string) => void,
  openEditAppointmentSideBar: (
    procedureStepId: string,
    appointmentType: ApiAppointmentType,
    appointment: Date,
    appointmentBookingType: ApiAppointmentBookingType,
  ) => void,
  openServiceAppliedSideBar: (
    serviceId: string,
    status: string,
    vaccinationInfo: string,
    vaccineName: string,
    batchIdentifier: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant: string,
  ) => void,
  openOtherServiceAppliedSidebar: (
    serviceId: string,
    serviceStatus: string,
    serviceTypeDescription: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant: string,
  ) => void,
  openMedicalHistory: (procedureId: string, procedureStepId?: string) => void,
  navigateToCertificates: (procedureId: string) => void,
) {
  return [
    columnHelper.accessor("serviceTypeDescription", {
      header: "Leistungsart",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("diseaseName", {
      header: "Impfung",
      cell: (props) => formatDiseaseName(props.getValue()),
    }),
    columnHelper.accessor("vaccineName", {
      header: "Impfstoff",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("vaccinationNumber", {
      header: "Nr.",
      cell: (props) => (props.getValue() ? props.getValue() : "-"),
    }),
    columnHelper.accessor("latency", {
      header: "Mindestabstand",
      cell: (props) => formatLatency(props.getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => (
        <Chip color={statusColors[props.getValue()]}>
          {STATUS_NAMES[props.getValue()]}
        </Chip>
      ),
    }),
    columnHelper.accessor("appointment", {
      header: "Impftermin",
      cell: (props) => {
        const value = props.getValue();
        if (typeof value === "undefined") {
          return "";
        } else {
          return formatDateTime(value);
        }
      },
    }),
    columnHelper.accessor("fee", {
      header: "Preis",
      cell: (props) =>
        formatCurrency(props.getValue(), {
          localOption: LOCALE_OPTION.manual,
          locale: "de-DE",
        }),
    }),
    columnHelper.accessor("medicalHistoryCompleted", {
      header: "Anamnese",
      cell: (props) => (props.getValue() ? "Ja" : "Nein"),
    }),
    columnHelper.accessor("batchIdentifier", {
      header: "Charge",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("appliedAt", {
      header: "Durchgeführt",
      cell: (props) => {
        const value = props.getValue();
        if (typeof value === "undefined") {
          return "";
        } else {
          return formatDate(value);
        }
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (props) => (
        <ActionsMenu
          actionItems={
            props.row.original.status === ApiServiceStatus.Open
              ? [
                  {
                    label: "zu Termin hinzufügen",
                    disabled: isProcedureClosed,
                    onClick: () => {
                      openAssignAppointment(props.row.original.serviceId);
                    },
                    startDecorator: <AddOutlined />,
                  },
                  {
                    label: "Löschen",
                    disabled: isProcedureClosed,
                    onClick: () =>
                      deleteService(procedureId, props.row.original.serviceId),
                    color: "danger",
                    startDecorator: <DeleteOutlined color="danger" />,
                  },
                ]
              : props.row.original.status === ApiServiceStatus.Planned
                ? [
                    {
                      label: "Durchführen",
                      disabled: isProcedureClosed,
                      onClick: () =>
                        props.row.original.serviceTypeDescription ===
                          "Grundimmunisierung" ||
                        props.row.original.serviceTypeDescription ===
                          "Auffrischimpfung"
                          ? openServiceAppliedSideBar(
                              props.row.original.serviceId,
                              props.row.original.status,
                              formatVaccinationInfo(
                                props.row.original.diseaseName!,
                                props.row.original.vaccinationNumber!,
                              ),
                              props.row.original.vaccineName!,
                              props.row.original.batchIdentifier!,
                              props.row.original.appliedAt!,
                              props.row.original.physician!,
                              props.row.original.mfa!,
                            )
                          : openOtherServiceAppliedSidebar(
                              props.row.original.serviceId,
                              props.row.original.status,
                              props.row.original.serviceTypeDescription,
                              props.row.original.appliedAt!,
                              props.row.original.physician!,
                              props.row.original.mfa!,
                            ),
                      startDecorator: <VaccinesOutlined />,
                    },
                    {
                      label: "aus Termin entfernen",
                      disabled: isProcedureClosed,
                      onClick: () =>
                        unassignStepToService(
                          procedureId,
                          props.row.original.serviceId,
                        ),
                      startDecorator: <HorizontalRuleOutlined />,
                    },
                    {
                      label: "Termin bearbeiten",
                      disabled: isProcedureClosed,
                      onClick: () =>
                        props.row.original.procedureStepId
                          ? openEditAppointmentSideBar(
                              props.row.original.procedureStepId,
                              props.row.original.appointmentType!,
                              props.row.original.appointment!,
                              props.row.original.appointmentBookingType!,
                            )
                          : "",
                      startDecorator: <EditOutlined />,
                    },
                    {
                      label: "Anamnese",
                      onClick: () =>
                        openMedicalHistory(
                          procedureId,
                          props.row.original.procedureStepId,
                        ),
                      startDecorator: <FormatListBulletedOutlined />,
                    },
                  ]
                : [
                    {
                      label: "Anamnese",
                      onClick: () =>
                        openMedicalHistory(
                          procedureId,
                          props.row.original.procedureStepId,
                        ),
                      startDecorator: <FormatListBulletedOutlined />,
                    },
                    {
                      label: "Bearbeiten",
                      disabled: isProcedureClosed,
                      onClick: () =>
                        props.row.original.serviceTypeDescription ===
                          "Grundimmunisierung" ||
                        props.row.original.serviceTypeDescription ===
                          "Auffrischimpfung"
                          ? openServiceAppliedSideBar(
                              props.row.original.serviceId,
                              props.row.original.status,
                              formatVaccinationInfo(
                                props.row.original.diseaseName!,
                                props.row.original.vaccinationNumber!,
                              ),
                              props.row.original.vaccineName!,
                              props.row.original.batchIdentifier!,
                              props.row.original.appliedAt!,
                              props.row.original.physician!,
                              props.row.original.mfa!,
                            )
                          : openOtherServiceAppliedSidebar(
                              props.row.original.serviceId,
                              props.row.original.status,
                              props.row.original.serviceTypeDescription,
                              props.row.original.appliedAt!,
                              props.row.original.physician!,
                              props.row.original.mfa!,
                            ),
                      startDecorator: <EditOutlined />,
                    },
                    {
                      label: "Bescheinigung erstellen",
                      disabled: isProcedureClosed,
                      onClick: () => navigateToCertificates(procedureId),
                      startDecorator: <TextSnippetOutlined />,
                    },
                  ]
          }
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
