/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DataTable,
  NoEntriesMessage,
  PROCEDURE_STATUS_NAMES,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal/helpers/dateTime";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { ApiProcedureStatus } from "@eshg/travel-medicine-api";
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";
import { FormControl, IconButton, Input, Select, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { useGetAllProcedureAppointmentSummaries } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { NewPerson } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/new/NewPerson";
import {
  appointmentOverviewEntriesColumns,
  initialSorting,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/overviewColumns";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
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

  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.TravelMedicine,
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
          <Stack direction="row" gap={3} alignItems="center">
            <Stack direction="row" gap={1}>
              <TextInputClientFilter
                placeholder={"Vorname"}
                type={"search"}
                setInputField={setFirstName}
                sx={{ height: "36px" }}
              />
              <TextInputClientFilter
                placeholder={"Nachname"}
                type={"search"}
                setInputField={setLastName}
                sx={{ height: "36px" }}
              />
              <TextInputClientFilter
                placeholder={"Geburtsdatum"}
                type={"date"}
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
              onChange={(_, value) => setStatus(value)}
              sx={{
                width: "200px",
              }}
            >
              <SelectOptions options={getStatusOptions()} />
            </Select>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <FormControl key="searchDate" size="md">
                <Input
                  type="date"
                  value={dayOfAppointmentFilter ?? ""}
                  onChange={(dayOfAppointment) => {
                    const value = dayOfAppointment.target.value;
                    if (isDateString(value)) {
                      const newDate = toUtcDate(value);
                      setDayOfAppointmentFilter(toDateString(newDate));
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
                  setDayOfAppointmentFilter(toDateString(newDate));
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
