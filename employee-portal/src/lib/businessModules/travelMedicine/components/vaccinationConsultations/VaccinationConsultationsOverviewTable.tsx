/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureStatus } from "@eshg/employee-portal-api/travelMedicine";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal/helpers/dateTime";
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import { FormControl, IconButton, Input, Select, Stack } from "@mui/joy";
import { useEffect, useMemo, useState } from "react";

import { useGetAllProcedureAppointmentSummaries } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { NewPerson } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/new/NewPerson";
import {
  appointmentOverviewEntriesColumns,
  initialSorting,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/overviewColumns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { procedureStatusNames } from "@/lib/shared/components/procedures/constants";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { TextInputClientFilter } from "@/lib/shared/components/tableFilters/TextInputClientFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export function VaccinationConsultationsOverviewTable(
  props: Readonly<{
    date?: string;
  }>,
) {
  const tableControl = useTableControl({});
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dayOfAppointmentFilter, setDayOfAppointmentFilter] = useState<Date>(
    props.date ? new Date(props.date) : new Date(),
  );
  const [status, setStatus] = useState<ApiProcedureStatus[]>([]);
  const queryResult = useGetAllProcedureAppointmentSummaries(
    dayOfAppointmentFilter,
  );
  const allAppointmentOverviewEntries = useMemo(() => {
    return queryResult.data ?? { appointmentOverviewEntries: [] };
  }, [queryResult.data]);
  const [appointmentOverviewEntries, setAppointmentOverviewEntries] = useState(
    allAppointmentOverviewEntries.appointmentOverviewEntries,
  );

  function setNextDay() {
    const newDate = new Date(dayOfAppointmentFilter);
    newDate.setDate(dayOfAppointmentFilter.getDate() + 1);
    setDayOfAppointmentFilter(newDate);
    updateTimeRange(newDate);
  }

  function setPrevDay() {
    const newDate = new Date(dayOfAppointmentFilter);
    newDate.setDate(dayOfAppointmentFilter.getDate() - 1);
    setDayOfAppointmentFilter(newDate);
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
      lastName != "" ||
      firstName != "" ||
      dateOfBirth != "" ||
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
      label: procedureStatusNames[value],
    }));
  }

  return (
    <TablePage
      controls={
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={4} flexWrap="wrap">
            <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
              <TextInputClientFilter
                placeholder={"Name"}
                type={"search"}
                setInputField={setLastName}
                sx={{ height: "36px" }}
              />
              <TextInputClientFilter
                placeholder={"Vorname"}
                type={"search"}
                setInputField={setFirstName}
                sx={{ height: "36px" }}
              />
              <TextInputClientFilter
                placeholder={"Geburtsdatum"}
                type={"date"}
                setInputField={setDateOfBirth}
                sx={{ height: "36px" }}
              />
            </Stack>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Select
                multiple
                value={status}
                placeholder="Vorgangsstatus"
                aria-label="Vorgangsstatus"
                onChange={(_, value) => setStatus(value)}
                sx={{
                  width: "200px",
                }}
              >
                <SelectOptions options={getStatusOptions()} />
              </Select>
            </Stack>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <FormControl key="searchDate" size="md">
                <Input
                  type="date"
                  value={toDateString(dayOfAppointmentFilter) ?? ""}
                  onChange={(dayOfAppointment) => {
                    const value = dayOfAppointment.target.value;
                    if (isDateString(value)) {
                      const newDate = toUtcDate(value);
                      setDayOfAppointmentFilter(newDate);
                      updateTimeRange(newDate);
                    }
                  }}
                  aria-label="Termin zu Datum"
                />
              </FormControl>
              <IconButton
                color="primary"
                variant="outlined"
                size="md"
                sx={{ padding: "4px 16px" }}
                onClick={() => {
                  const newDate = new Date();
                  setDayOfAppointmentFilter(newDate);
                  updateTimeRange(newDate);
                }}
                aria-label="Termine heute"
              >
                Heute
              </IconButton>
              <IconButton
                color="primary"
                variant="outlined"
                size="md"
                onClick={setPrevDay}
                aria-label="Termine vorheriger Tag"
              >
                <KeyboardArrowLeftOutlined size="sm" />
              </IconButton>
              <IconButton
                color="primary"
                variant="outlined"
                size="md"
                onClick={setNextDay}
                aria-label="Termine nächster Tag"
              >
                <KeyboardArrowRightOutlined size="sm" />
              </IconButton>
            </Stack>
          </Stack>
          <Stack direction="row">
            <NewPerson />
          </Stack>
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
        />
      </TableSheet>
    </TablePage>
  );
}
