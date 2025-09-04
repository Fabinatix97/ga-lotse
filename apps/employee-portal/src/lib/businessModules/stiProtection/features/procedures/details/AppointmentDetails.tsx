/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckCircle, EditCalendar, EventBusy } from "@mui/icons-material";
import { Button, Chip, Sheet, Stack } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import {
  ActionsItem,
  ActionsMenu,
  DataTable,
  DetailsSection,
  TablePage,
  useConfirmationDialog,
  useSearchParam,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Row, useSnackbar } from "@eshg/lib-portal";
import {
  ApiAppointmentHistoryEntry,
  ApiStiProtectionProcedure,
} from "@eshg/sti-protection-api";

import {
  useCancelAppointmentMutation,
  useFinalizeAppointmentMutation,
} from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  appointmentStatusColor,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { createOnlyIfProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";

import { formatAppointmentTime } from "./AdditionalDataSection";
import {
  CREATE_APPOINTMENT_SEARCH_PARAM,
  EDIT_APPOINTMENT_SEARCH_PARAM,
} from "./CreateAppointmentSidebar";

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: true,
};

export function AppointmentDetails({
  procedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
}>) {
  const snackbar = useSnackbar();
  const [_isOpenCreateAppointment, setIsOpenCreateAppointment] = useSearchParam(
    CREATE_APPOINTMENT_SEARCH_PARAM,
    "boolean",
  );

  const [_editAppointmentType, setEditAppointmentType] = useSearchParam(
    EDIT_APPOINTMENT_SEARCH_PARAM,
  );

  const { openCancelDialog } = useConfirmationDialog();
  const tableControl = useTableControl({
    serverSideSorting: false,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  const cancelAppointment = useCancelAppointmentMutation({
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde storniert.");
    },
  });

  function handleCancelAppointment() {
    openCancelDialog({
      onConfirm: async () => {
        await cancelAppointment.mutateAsync(procedure);
      },
      title: "Termin stornieren",
      description: "Möchten Sie diesen Termin wirklich stornieren?",
      confirmLabel: "Stornieren",
    });
  }

  function handleEditAppointment(appointmentType: string) {
    setEditAppointmentType(appointmentType);
  }

  const finalizeAppointment = useFinalizeAppointmentMutation({
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde als abgeschlossen markiert.");
    },
  });

  function handleFinalizeAppointment() {
    finalizeAppointment.mutate(procedure.id);
  }

  const onlyIfOpen = createOnlyIfProcedureOpen(procedure);
  return (
    <Sheet>
      <DetailsSection title="Termine">
        <TablePage
          fullHeight
          aria-label="Einträge in Terminverlauf"
          data-testid="appointment-details-table"
        >
          <DataTable
            data={procedure.appointmentHistory}
            columns={appointmentDetailsColumns(
              procedure,
              handleCancelAppointment,
              handleEditAppointment,
              handleFinalizeAppointment,
            )}
            sorting={tableControl.tableSorting}
            enableSortingRemoval={false}
            striped={false}
          />
        </TablePage>
        <Stack display="flex" alignItems="flex-start">
          {onlyIfOpen(
            <Button
              variant="plain"
              aria-label="Termin buchen"
              startDecorator={<CalendarAddDay />}
              onClick={() => setIsOpenCreateAppointment(true)}
            >
              Termin buchen
            </Button>,
          )}
        </Stack>
      </DetailsSection>
    </Sheet>
  );
}

const columnHelper = createColumnHelper<ApiAppointmentHistoryEntry>();

function appointmentDetailsColumns(
  _procedure: ApiStiProtectionProcedure,
  onCancelAppointment: () => void,
  onEditAppointment: (appointmentType: string) => void,
  onFinalizeAppointment: () => void,
) {
  function createActionButtons(
    appointmentHistoryEntry: ApiAppointmentHistoryEntry,
  ): ActionsItem[] {
    return appointmentHistoryEntry.appointmentStatus === "OPEN"
      ? [
          {
            label: "Termin ändern",
            onClick: () =>
              onEditAppointment(appointmentHistoryEntry.appointmentType),
            startDecorator: <EditCalendar />,
          },
          {
            label: "Termin stornieren",
            onClick: onCancelAppointment,
            startDecorator: <EventBusy />,
          },
          {
            label: "Termin abschließen",
            onClick: onFinalizeAppointment,
            startDecorator: <CheckCircle />,
          },
        ]
      : [];
  }

  return [
    columnHelper.accessor("appointmentType", {
      header: "Terminart",
      cell: ({ getValue }) => APPOINTMENT_TYPES[getValue()],
      enableSorting: false,
      meta: {
        width: 240,
      },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatAppointmentTime(getValue()),
      enableSorting: false,
      meta: {
        width: 200,
      },
    }),
    columnHelper.accessor("appointmentStatus", {
      header: "Status",
      cell: ({ getValue }) => (
        <Chip color={appointmentStatusColor[getValue()]}>
          {APPOINTMENT_STATUS[getValue()]}
        </Chip>
      ),
      enableSorting: false,
      meta: {
        width: 150,
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: historyEntry } }) =>
        historyEntry.appointmentStatus === "OPEN" && (
          <Row justifyContent="flex-end">
            <ActionsMenu actionItems={createActionButtons(historyEntry)} />
          </Row>
        ),
      meta: {
        width: 96,
      },
    }),
  ];
}
