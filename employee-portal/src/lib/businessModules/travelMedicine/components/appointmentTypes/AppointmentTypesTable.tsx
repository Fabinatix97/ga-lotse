/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DataTable, TablePage, TableSheet } from "@eshg/lib-employee-portal";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import { useAppointmentTypeSidebar } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/AppointmentTypeSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/columns";

export function AppointmentTypesTable() {
  const [{ data: getAllAppointmentTypes }] = useSuspenseQueries({
    queries: [useGetAllAppointmentTypesQuery()],
  });

  const appointmentTypeSidebar = useAppointmentTypeSidebar();

  return (
    <>
      <TablePage data-testid="appointment-types" fullHeight>
        <TableSheet>
          <DataTable
            data={getAllAppointmentTypes}
            columns={columns({
              editEntry: (appointmentTypeConfig) =>
                appointmentTypeSidebar.open({ appointmentTypeConfig }),
            })}
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
