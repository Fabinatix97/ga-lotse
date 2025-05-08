/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Cancel,
  Delete,
  EditOutlined,
  EventBusy,
  FormatListBulletedOutlined,
  TextSnippetOutlined,
  VaccinesOutlined,
} from "@mui/icons-material";
import { Chip, ColorPaletteProp } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { isDefined, isPlainObject } from "remeda";

import { ActionsItem, ActionsMenu } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatCurrency } from "@eshg/lib-portal/formatters/numbers";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import {
  ApiAppointmentBookingType,
  ApiServicePlanEntry,
  ApiServicePlanGroup,
  ApiServiceStatus,
  ApiUser,
} from "@eshg/travel-medicine-api";

import { CalendarAddOnIcon } from "@/lib/businessModules/travelMedicine/components/icons/CalendarAddOnIcon";
import { EditCalendarIcon } from "@/lib/businessModules/travelMedicine/components/icons/EditCalendarIcon";
import { EventUpcomingIcon } from "@/lib/businessModules/travelMedicine/components/icons/EventUpcomingIcon";
import { ServicePlanEntry } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanTable";
import {
  statusColors,
  statusColorsAppointment,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/constants";
import {
  MedicalHistoryAnswerStatusType,
  STATUS_NAMES,
  STATUS_NAMES_APPOINTMENT,
  STATUS_NAMES_MEDICAL_HISTORY_ANSWER,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/translations";
import { formatDateTimeShortenedWeekday } from "@/lib/shared/helpers/dateTime";

function getMedicalHistoryAnswerStatus(
  medicalHistoryCompleted: boolean,
  citizenHasAnswered: boolean,
) {
  if (medicalHistoryCompleted) {
    return STATUS_NAMES_MEDICAL_HISTORY_ANSWER[
      MedicalHistoryAnswerStatusType.Answered
    ];
  }
  if (citizenHasAnswered) {
    return STATUS_NAMES_MEDICAL_HISTORY_ANSWER[
      MedicalHistoryAnswerStatusType.PartiallyAnswered
    ];
  }
  return STATUS_NAMES_MEDICAL_HISTORY_ANSWER[
    MedicalHistoryAnswerStatusType.NotAnswered
  ];
}

const columnHelper: ColumnHelper<ServicePlanEntry> =
  createColumnHelper<ServicePlanEntry>();

function formatDiseaseName(diseaseName: string | undefined) {
  return diseaseName ? (
    <Chip color="primary" size="md">
      {diseaseName}
    </Chip>
  ) : (
    ""
  );
}

function formatLatency(latency: number | undefined) {
  return latency ? `+ ${latency} Wochen` : "-";
}

interface ServicePlanColumnsProps {
  allPhysicians: ApiUser[];
  allMedicalAssistants: ApiUser[];
  isProcedureClosed: boolean;
  isCitizenProcedure: boolean;
  isInitialStep: (procedureStepId: string) => boolean;
  onDeleteService: (serviceId: string) => void;
  onUnassignService: (serviceId: string) => void;
  onOpenMedicalHistory: (procedureStepId: string) => void;
  onOpenCertificatesTab: () => void;
  onEditServiceAppointment: (procedureStep: ApiServicePlanGroup) => void;
  onAssignService: (serviceId: string) => void;
  onServiceApplied: (service: ApiServicePlanEntry) => void;
  onOtherServiceApplied: (service: ApiServicePlanEntry) => void;
  onEditEarliestDate: (procedureStep: ApiServicePlanGroup) => void;
  onCancelAppointment: (procedureStepId: string) => void;
}

export function servicePlanColumns({
  allPhysicians,
  allMedicalAssistants,
  isProcedureClosed,
  isCitizenProcedure,
  isInitialStep,
  onDeleteService,
  onUnassignService,
  onOpenMedicalHistory,
  onOpenCertificatesTab,
  onEditServiceAppointment,
  onAssignService,
  onServiceApplied,
  onOtherServiceApplied,
  onEditEarliestDate,
  onCancelAppointment,
}: ServicePlanColumnsProps) {
  function renderGroupActionButtons(
    servicePlanGroup: ServicePlanEntry,
  ): ActionsItem[] {
    if (!isDefined(servicePlanGroup.procedureStepId)) {
      return [];
    }

    const someServicesAccomplished = servicePlanGroup.subRows
      ?.flatMap((el) => el.status)
      .some((el) => el === ApiServiceStatus.Accomplished);

    const appointmentBooked =
      servicePlanGroup.appointmentBookingType ===
        ApiAppointmentBookingType.AppointmentBlock ||
      servicePlanGroup.appointmentBookingType ===
        ApiAppointmentBookingType.UserDefined;

    return [
      {
        label: "Anamnese",
        onClick: () => onOpenMedicalHistory(servicePlanGroup.procedureStepId!),
        startDecorator: <FormatListBulletedOutlined />,
      },
      someServicesAccomplished && {
        label: "Bescheinigung erstellen",
        onClick: onOpenCertificatesTab,
        startDecorator: <TextSnippetOutlined />,
      },
      !isProcedureClosed &&
        isCitizenProcedure &&
        !isInitialStep(servicePlanGroup.procedureStepId) &&
        !someServicesAccomplished && {
          label: '"Buchbar ab" bearbeiten',
          onClick: () =>
            onEditEarliestDate(
              servicePlanGroup as unknown as ApiServicePlanGroup,
            ),
          startDecorator: <EventUpcomingIcon />,
        },
      !isProcedureClosed &&
        !appointmentBooked && {
          label: "Termin buchen",
          onClick: () =>
            onEditServiceAppointment(
              servicePlanGroup as unknown as ApiServicePlanGroup,
            ),
          startDecorator: <CalendarAddOnIcon />,
        },
      !isProcedureClosed &&
        appointmentBooked &&
        !someServicesAccomplished && {
          label: "Termin umbuchen",
          onClick: () =>
            onEditServiceAppointment(
              servicePlanGroup as unknown as ApiServicePlanGroup,
            ),
          startDecorator: <EditCalendarIcon />,
        },
      !isProcedureClosed &&
        appointmentBooked &&
        isCitizenProcedure &&
        !someServicesAccomplished && {
          label: "Termin absagen",
          onClick: () =>
            onCancelAppointment(servicePlanGroup.procedureStepId ?? ""),
          startDecorator: <Cancel />,
        },
    ].filter(isPlainObject);
  }

  function renderEntryActionButtons(
    servicePlanEntry: ServicePlanEntry,
  ): ActionsItem[] {
    const serviceAssigned =
      servicePlanEntry.status === ApiServiceStatus.Planned;
    const serviceExecuted =
      servicePlanEntry.status === ApiServiceStatus.Accomplished;

    return [
      !isProcedureClosed &&
        !serviceAssigned &&
        !serviceExecuted && {
          label: "zu Termin hinzufügen",
          onClick: () => {
            onAssignService(servicePlanEntry.serviceId);
          },
          startDecorator: <EditCalendarIcon />,
        },
      !isProcedureClosed &&
        !serviceAssigned &&
        !serviceExecuted && {
          label: "Löschen",
          onClick: () => onDeleteService(servicePlanEntry.serviceId),
          color: "danger" as ColorPaletteProp,
          startDecorator: <Delete color="danger" />,
        },
      !isProcedureClosed &&
        serviceAssigned &&
        !serviceExecuted && {
          label: "Durchführen",
          onClick: () =>
            servicePlanEntry.serviceTypeDescription === "Grundimmunisierung" ||
            servicePlanEntry.serviceTypeDescription === "Auffrischimpfung"
              ? onServiceApplied(
                  servicePlanEntry as unknown as ApiServicePlanEntry,
                )
              : onOtherServiceApplied(
                  servicePlanEntry as unknown as ApiServicePlanEntry,
                ),
          startDecorator: <VaccinesOutlined />,
        },
      !isProcedureClosed &&
        serviceAssigned &&
        !serviceExecuted && {
          label: "Aus Termin entfernen",
          onClick: () => onUnassignService(servicePlanEntry.serviceId),
          startDecorator: <EventBusy />,
        },
      !isProcedureClosed &&
        serviceExecuted && {
          label: "Bearbeiten",
          onClick: () =>
            servicePlanEntry.serviceTypeDescription === "Grundimmunisierung" ||
            servicePlanEntry.serviceTypeDescription === "Auffrischimpfung"
              ? onServiceApplied(
                  servicePlanEntry as unknown as ApiServicePlanEntry,
                )
              : onOtherServiceApplied(
                  servicePlanEntry as unknown as ApiServicePlanEntry,
                ),
          startDecorator: <EditOutlined />,
        },
    ].filter(isPlainObject);
  }

  return [
    columnHelper.accessor("serviceTypeDescription", {
      header: "Leistungsart",
      cell: (props) => {
        if (props.row.depth === 0) {
          const mhStatus = getMedicalHistoryAnswerStatus(
            props.row.original.medicalHistoryCompleted!,
            props.row.original.citizenHasAnswered!,
          );
          if (
            !isDefined(props.row.original.appointment) &&
            !isDefined(props.row.original.earliestDate)
          ) {
            return `Ohne Termin, ${mhStatus}`;
          } else if (
            !isDefined(props.row.original.appointment) &&
            isDefined(props.row.original.earliestDate)
          ) {
            return `Buchbar ab ${formatDate(props.row.original.earliestDate)}, ${mhStatus}`;
          }
          return `${formatDateTimeShortenedWeekday(props.row.original.appointment!)} Uhr, ${mhStatus}`;
        }
        return props.getValue();
      },
      meta: { spanWhenParentRow: 5, width: 190 },
    }),
    columnHelper.accessor("diseaseName", {
      header: "Impfung",
      cell: (props) => formatDiseaseName(props.getValue()),
      meta: { skipWhenParentRow: true, width: 120 },
    }),
    columnHelper.accessor("vaccineName", {
      header: "Impfstoff",
      cell: (props) => props.getValue(),
      meta: { skipWhenParentRow: true, width: 180 },
    }),
    columnHelper.accessor("vaccinationNumber", {
      header: "Nr.",
      cell: (props) => props.getValue() ?? "-",
      meta: { skipWhenParentRow: true, width: 40 },
    }),
    columnHelper.accessor("latency", {
      header: "Mindestabstand",
      cell: (props) => {
        return formatLatency(props.getValue());
      },
      meta: { skipWhenParentRow: true, width: 130 },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => {
        const serviceStatus = props.getValue();
        const appointmentBookingType =
          props.row.original.appointmentBookingType;

        if (props.row.depth === 0 && appointmentBookingType) {
          return (
            <Chip
              color={statusColorsAppointment[appointmentBookingType]}
              size="md"
            >
              {STATUS_NAMES_APPOINTMENT[appointmentBookingType]}
            </Chip>
          );
        } else if (serviceStatus) {
          return (
            <Chip color={statusColors[serviceStatus]} size="md">
              {STATUS_NAMES[serviceStatus]}
            </Chip>
          );
        }
      },
      meta: { width: 170 },
    }),
    columnHelper.accessor("fee", {
      header: "Preis",
      cell: (props) =>
        formatCurrency(props.getValue(), {
          localeOption: "manual",
          locale: "de-DE",
        }),
      meta: { width: 80 },
    }),
    columnHelper.accessor("batchIdentifier", {
      header: "Charge",
      cell: (props) => props.getValue(),
      meta: { skipWhenParentRow: true, width: 150 },
    }),
    columnHelper.accessor("physician", {
      header: "Arzt/Ärztin",
      cell: (props) =>
        formatPersonName(
          allPhysicians.find(
            (physician) => physician.userId === props.getValue(),
          ),
        ),
      meta: { skipWhenParentRow: true, width: 150 },
    }),
    columnHelper.accessor("mfa", {
      header: "MFA",
      cell: (props) =>
        formatPersonName(
          allMedicalAssistants.find((mfa) => mfa.userId === props.getValue()),
        ),
      meta: { skipWhenParentRow: true, width: 150 },
    }),
    columnHelper.accessor("appliedAt", {
      header: "Durchgeführt",
      cell: (props) => formatDate(props.getValue()),
      meta: { skipWhenParentRow: true, width: 100 },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: (props) => {
        if (props.row.depth === 0) {
          const actionItems = renderGroupActionButtons(props.row.original);
          if (actionItems.length !== 0) {
            return <ActionsMenu actionItems={actionItems} rowHeight />;
          }
          return;
        }
        return (
          <ActionsMenu
            actionItems={renderEntryActionButtons(props.row.original)}
            rowHeight
          />
        );
      },
      meta: {
        width: 96,
        spanWhenParentRow: 5,
      },
    }),
  ];
}
