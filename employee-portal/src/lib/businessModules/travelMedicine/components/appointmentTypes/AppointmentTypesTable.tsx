/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSuspenseQueries } from "@tanstack/react-query";

import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import { useAppointmentTypeSidebar } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/AppointmentTypeSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/columns";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

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
