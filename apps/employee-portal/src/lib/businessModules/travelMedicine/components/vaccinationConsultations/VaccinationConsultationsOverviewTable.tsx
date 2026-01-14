/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import { Box, FormControl, IconButton, Input, Select, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  DataTable,
  NoEntriesMessage,
  PROCEDURE_STATUS_NAMES,
  TablePage,
  TableSheet,
  useGdprValidationTasksAlert,
  useGetGdprValidationBannerQuery,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  SelectOptions,
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { ApiProcedureStatus } from "@eshg/travel-medicine-api";

import { useGdprValidationTaskApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useGetAllProcedureAppointmentSummaries } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { NewPerson } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/new/NewPerson";
import {
  appointmentOverviewEntriesColumns,
  initialSorting,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/overviewColumns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { TextInputClientFilter } from "@/lib/shared/components/tableFilters/TextInputClientFilter";

export function VaccinationConsultationsOverviewTable(
  props: Readonly<{
    date?: string;
  }>,
) {
  const tableControl = useTableControl({});
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dayOfAppointmentFilter, setDayOfAppointmentFilter] = useState<string>(
    props.date ?? toDateString(new Date()),
  );

  const [status, setStatus] = useState<ApiProcedureStatus[]>([]);
  const queryResult = useGetAllProcedureAppointmentSummaries(
    new Date(dayOfAppointmentFilter),
  );
  const allAppointmentOverviewEntries = useMemo(() => {
    return queryResult.data ?? { appointmentOverviewEntries: [] };
  }, [queryResult.data]);
  const [appointmentOverviewEntries, setAppointmentOverviewEntries] = useState(
    allAppointmentOverviewEntries.appointmentOverviewEntries,
  );

  const gdprValidationTaskApi = useGdprValidationTaskApi();
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.TravelMedicine,
    gdprValidationTaskApi,
  );

  const [gdprBanner] = useSuspenseQueries({
    queries: [gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.TravelMedicine,
  });

  function setNextDay() {
    const newDate = new Date(dayOfAppointmentFilter);
    newDate.setDate(newDate.getDate() + 1);
    setDayOfAppointmentFilter(toDateString(newDate));
    updateTimeRange(newDate);
  }

  function setPrevDay() {
    const newDate = new Date(dayOfAppointmentFilter);
    newDate.setDate(newDate.getDate() - 1);
    setDayOfAppointmentFilter(toDateString(newDate));
    updateTimeRange(newDate);
  }

  function updateTimeRange(newDate: Date) {
    tableControl.setFilter([
      {
        name: "date",
        value: toDateString(newDate),
      },
    ]);
  }

  useEffect(() => {
    if (
      lastName !== "" ||
      firstName !== "" ||
      dateOfBirth !== "" ||
      status.length > 0
    ) {
      let filteredResult =
        allAppointmentOverviewEntries.appointmentOverviewEntries;
      if (lastName) {
        filteredResult = filteredResult.filter((appointmentOverviewEntry) =>
          appointmentOverviewEntry.lastName
            .toLowerCase()
            .includes(lastName.toLowerCase()),
        );
      }
      if (firstName) {
        filteredResult = filteredResult.filter((appointmentOverviewEntry) =>
          appointmentOverviewEntry.firstName
            .toLowerCase()
            .includes(firstName.toLowerCase()),
        );
      }
      if (dateOfBirth) {
        filteredResult = filteredResult.filter(
          (appointmentOverviewEntry) =>
            dateOfBirth === toDateString(appointmentOverviewEntry.dateOfBirth),
        );
      }
      if (status.length > 0) {
        filteredResult = filteredResult.filter((appointmentOverviewEntry) =>
          status.includes(appointmentOverviewEntry.status),
        );
      }
      setAppointmentOverviewEntries(filteredResult);
    } else {
      setAppointmentOverviewEntries(
        allAppointmentOverviewEntries.appointmentOverviewEntries,
      );
    }
  }, [allAppointmentOverviewEntries, lastName, firstName, dateOfBirth, status]);

  function getStatusOptions() {
    return Array.from(Object.values(ApiProcedureStatus)).map((value) => ({
      value,
      label: PROCEDURE_STATUS_NAMES[value],
    }));
  }

  return (
    <TablePage
      controls={
        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack
            direction="row"
            gap={3}
            alignItems="center"
            role="search"
            aria-label="Vorgänge"
          >
            <Box display="contents" role="group" aria-label="Filter">
              <Stack direction="row" gap={1}>
                <TextInputClientFilter
                  placeholder="Vorname"
                  type="search"
                  setInputField={setFirstName}
                  sx={{ height: "36px" }}
                />
                <TextInputClientFilter
                  placeholder="Nachname"
                  type="search"
                  setInputField={setLastName}
                  sx={{ height: "36px" }}
                />
                <TextInputClientFilter
                  placeholder="Geburtsdatum"
                  type="date"
                  setInputField={setDateOfBirth}
                  sx={{ height: "36px" }}
                />
              </Stack>
              <Select
                multiple
                aria-description="Mehrfachauswahl möglich"
                value={status}
                placeholder="Vorgangsstatus"
                aria-label="Vorgangsstatus"
                sx={{
                  width: "200px",
                }}
                onChange={(_, value) => setStatus(value)}
              >
                <SelectOptions options={getStatusOptions()} />
              </Select>
            </Box>
            <Stack
              direction="row"
              gap={1}
              flexWrap="wrap"
              role="group"
              aria-label="Termin auswählen"
            >
              <FormControl key="searchDate" size="md">
                <Input
                  type="date"
                  value={dayOfAppointmentFilter ?? ""}
                  aria-label="Termin zu Datum"
                  onChange={(dayOfAppointment) => {
                    const value = dayOfAppointment.target.value;
                    if (isDateString(value)) {
                      const newDate = toUtcDate(value);
                      setDayOfAppointmentFilter(toDateString(newDate));
                      updateTimeRange(newDate);
                    }
                  }}
                />
              </FormControl>
              <IconButton
                color="primary"
                variant="outlined"
                size="md"
                sx={{ padding: "4px 16px" }}
                aria-label="Heute"
                onClick={() => {
                  const newDate = new Date();
                  setDayOfAppointmentFilter(toDateString(newDate));
                  updateTimeRange(newDate);
                }}
              >
                Heute
              </IconButton>
              <IconButton
                color="primary"
                variant="outlined"
                size="md"
                aria-label="Vorheriger Tag"
                onClick={setPrevDay}
              >
                <KeyboardArrowLeftOutlined size="sm" />
              </IconButton>
              <IconButton
                color="primary"
                variant="outlined"
                size="md"
                aria-label="Nächster Tag"
                onClick={setNextDay}
              >
                <KeyboardArrowRightOutlined size="sm" />
              </IconButton>
            </Stack>
          </Stack>
          <NewPerson />
        </Stack>
      }
    >
      <TableSheet loading={queryResult.isFetching}>
        <DataTable
          data={appointmentOverviewEntries}
          columns={appointmentOverviewEntriesColumns()}
          sorting={{
            manualSorting: false,
            initialSorting,
          }}
          rowNavigation={{
            route: (row) =>
              routes.procedures.baseData(row.original.procedureId),
            focusColumnAccessorKey: "lastName",
          }}
          minWidth={1600}
          noDataComponent={
            queryResult.isFetching
              ? () => undefined
              : () => <NoEntriesMessage />
          }
        />
      </TableSheet>
    </TablePage>
  );
}
