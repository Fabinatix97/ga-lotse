/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
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
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { LOCALE_OPTION, formatCurrency } from "@/lib/shared/helpers/numbers";

const columnHelper: ColumnHelper<ApiServicePlanEntry> =
  createColumnHelper<ApiServicePlanEntry>();

function formatDiseaseName(diseaseName: string | undefined) {
  return diseaseName ? <Chip color={"primary"}>{diseaseName}</Chip> : "";
}

function formatLatency(latency: number | undefined) {
  return latency ? `+ ${latency} Wochen` : "-";
}

interface ServicePlanColumnsProps {
  isProcedureClosed: boolean;
  isCitizenProcedure: boolean;
  isCitizenFollowUp: (procedureStepId: string) => boolean;
  onDeleteService: (serviceId: string) => void;
  onUnassignService: (serviceId: string) => void;
  onOpenMedicalHistory: (procedureStepId: string) => void;
  onOpenCertificatesTab: () => void;
  onEditServiceAppointment: (procedureStep: ApiServicePlanEntry) => void;
  onAssignService: (serviceId: string) => void;
  onServiceApplied: (service: ApiServicePlanEntry) => void;
  onOtherServiceApplied: (service: ApiServicePlanEntry) => void;
  onEditEarliestDate: (service: ApiServicePlanEntry) => void;
  onCancelAppointment: (procedureStepId: string) => void;
}

export function servicePlanColumns({
  isProcedureClosed,
  isCitizenProcedure,
  isCitizenFollowUp,
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
  function renderActionButtons(service: ApiServicePlanEntry): ActionsItem[] {
    const actionItems: ActionsItem[] = [];
    const procedureStepActions: ActionsItem[] = [];

    if (
      service.status !== ApiServiceStatus.Accomplished &&
      isCitizenFollowUp(service.procedureStepId!)
    ) {
      procedureStepActions.push({
        label: "Buchbar ab bearbeiten",
        disabled: isProcedureClosed,
        onClick: () => onEditEarliestDate(service),
        startDecorator: <EditOutlined />,
      });
    }
    if (
      service.status !== ApiServiceStatus.Accomplished &&
      isCitizenProcedure &&
      (service.appointmentBookingType ===
        ApiAppointmentBookingType.AppointmentBlock ||
        service.appointmentBookingType ===
          ApiAppointmentBookingType.UserDefined)
    ) {
      procedureStepActions.push({
        label: "Termin absagen",
        disabled: isProcedureClosed,
        onClick: () => onCancelAppointment(service.procedureStepId ?? ""),
        startDecorator: <HorizontalRuleOutlined />,
      });
    }

    switch (service.status) {
      case ApiServiceStatus.Open: {
        actionItems.push(
          {
            label: "zu Termin hinzufügen",
            disabled: isProcedureClosed,
            onClick: () => {
              onAssignService(service.serviceId);
            },
            startDecorator: <AddOutlined />,
          },
          {
            label: "Löschen",
            disabled: isProcedureClosed,
            onClick: () => onDeleteService(service.serviceId),
            color: "danger",
            startDecorator: <DeleteOutlined color="danger" />,
          },
        );
        return actionItems;
      }
      case ApiServiceStatus.Planned: {
        actionItems.push(
          {
            label: "Durchführen",
            disabled: isProcedureClosed,
            onClick: () =>
              service.serviceTypeDescription === "Grundimmunisierung" ||
              service.serviceTypeDescription === "Auffrischimpfung"
                ? onServiceApplied(service)
                : onOtherServiceApplied(service),
            startDecorator: <VaccinesOutlined />,
          },
          {
            label: "aus Termin entfernen",
            disabled: isProcedureClosed,
            onClick: () => onUnassignService(service.serviceId),
            startDecorator: <HorizontalRuleOutlined />,
          },
          {
            label: "Termin bearbeiten",
            onClick: () => onEditServiceAppointment(service),
            startDecorator: <EditOutlined />,
          },
          {
            label: "Anamnese",
            onClick: () => onOpenMedicalHistory(service.procedureStepId!),
            startDecorator: <FormatListBulletedOutlined />,
          },
          ...procedureStepActions,
        );
        return actionItems;
      }
      case ApiServiceStatus.Accomplished: {
        actionItems.push(
          {
            label: "Anamnese",
            onClick: () => onOpenMedicalHistory(service.procedureStepId!),
            startDecorator: <FormatListBulletedOutlined />,
          },
          {
            label: "Bearbeiten",
            disabled: isProcedureClosed,
            onClick: () =>
              service.serviceTypeDescription === "Grundimmunisierung" ||
              service.serviceTypeDescription === "Auffrischimpfung"
                ? onServiceApplied(service)
                : onOtherServiceApplied(service),
            startDecorator: <EditOutlined />,
          },
          {
            label: "Bescheinigung erstellen",
            disabled: isProcedureClosed,
            onClick: onOpenCertificatesTab,
            startDecorator: <TextSnippetOutlined />,
          },
          ...procedureStepActions,
        );
        return actionItems;
      }
      default:
        return actionItems;
    }
  }

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
          actionItems={renderActionButtons(props.cell.row.original)}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
