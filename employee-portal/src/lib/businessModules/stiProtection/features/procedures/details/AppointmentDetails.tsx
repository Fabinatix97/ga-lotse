/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentHistoryEntry,
  ApiStiProtectionProcedure,
} from "@eshg/employee-portal-api/stiProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { EventBusy } from "@mui/icons-material";
import { Button, Chip, Sheet, Stack } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { useCancelAppointmentMutation } from "@/lib/businessModules/stiProtection/api/mutations/procedures";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  appointmentStatusColor,
} from "@/lib/businessModules/stiProtection/shared/constants";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import { formatAppointmentTime } from "./AdditionalDataSection";
import { CREATE_APPOINTMENT_SEARCH_PARAM } from "./CreateAppointmentSidebar";

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: true,
};

export function AppointmentDetails({
  procedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
}>) {
  const [_isOpenCreateAppointment, setIsOpenCreateAppointment] = useSearchParam(
    CREATE_APPOINTMENT_SEARCH_PARAM,
    "boolean",
  );
  const tableControl = useTableControl({
    serverSideSorting: false,
    sortFieldName: "sortKey",
    sortDirectionName: "sortDirection",
    initialSorting: initialSorting,
  });

  function useCancelAppointment() {
    const snackbar = useSnackbar();
    const mutation = useCancelAppointmentMutation({
      onSuccess: () => {
        snackbar.confirmation("Termin storniert");
      },
    });
    return mutation;
  }

  const cancelAppointment = useCancelAppointment();

  function handleCancelAppointment() {
    void cancelAppointment.mutateAsync(procedure);
  }

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
            )}
            sorting={tableControl.tableSorting}
            enableSortingRemoval={false}
            striped={false}
          />
        </TablePage>
      </DetailsSection>
      <Stack display={"flex"} alignItems={"flex-start"}>
        <Button
          variant="plain"
          aria-label="Termin buchen"
          onClick={() => setIsOpenCreateAppointment(true)}
          startDecorator={<CalendarAddDay />}
        >
          Termin buchen
        </Button>
      </Stack>
    </Sheet>
  );
}

const columnHelper = createColumnHelper<ApiAppointmentHistoryEntry>();

function appointmentDetailsColumns(
  procedure: ApiStiProtectionProcedure,
  onCancelAppointment: () => void,
) {
  function createActionButtons(
    appointmentHistoryEntry: ApiAppointmentHistoryEntry,
  ): ActionsItem[] {
    return appointmentHistoryEntry.appointmentStatus === "OPEN"
      ? [
          {
            label: "Termin stornieren",
            onClick: onCancelAppointment,
            startDecorator: <EventBusy />,
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
      cell: ({ row: { original: entry } }) => (
        <Row justifyContent="flex-end">
          {entry.appointmentStatus === "OPEN" ? (
            <ActionsMenu actionItems={createActionButtons(entry)} />
          ) : undefined}
        </Row>
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
