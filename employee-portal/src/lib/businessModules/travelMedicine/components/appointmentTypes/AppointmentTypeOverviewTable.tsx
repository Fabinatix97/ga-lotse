/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAppointmentTypeConfig } from "@eshg/employee-portal-api/travelMedicine";
import { useSuspenseQueries } from "@tanstack/react-query";
import { FormikProps } from "formik";
import { useRef, useState } from "react";

import { useUpdateAppointmentType } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentTypes";
import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import {
  AppointmentTypeEditForm,
  EditableAppointmentType,
} from "@/lib/businessModules/travelMedicine/components/appointmentTypes/AppointmentTypeEditForm";
import { appointmentTypesColumns } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/columns";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function AppointmentTypeOverviewTable() {
  const [{ data: getAllAppointmentTypes }] = useSuspenseQueries({
    queries: [useGetAllAppointmentTypesQuery()],
  });
  const initialConfig = getAllAppointmentTypes[0];

  const updateAppointmentType = useUpdateAppointmentType();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTypeConfig, setCurrentTypeConfig] =
    useState<ApiAppointmentTypeConfig>();
  const formikRef = useRef<FormikProps<EditableAppointmentType>>(null);

  function initialValues(): EditableAppointmentType {
    return {
      id: currentTypeConfig?.id ?? "",
      appointmentTypeDto:
        currentTypeConfig?.appointmentTypeDto ??
        initialConfig!.appointmentTypeDto,
      standardDurationInMinutes:
        currentTypeConfig?.standardDurationInMinutes?.toString() ?? "",
    };
  }

  function editEntry(typeConfig: ApiAppointmentTypeConfig) {
    setCurrentTypeConfig(typeConfig);
    setSidebarOpen(true);
  }

  async function doSubmit(values: EditableAppointmentType) {
    const data = {
      id: values.id,
      request: {
        standardDurationInMinutes: +values.standardDurationInMinutes,
      },
    };
    await updateAppointmentType.mutateAsync(data);
    closeAndCleanSidebarForm();
  }

  function closeAndCleanSidebarForm() {
    setSidebarOpen(false);
    setCurrentTypeConfig(undefined);
    formikRef.current?.resetForm();
  }

  return (
    <>
      <TableSheet>
        <DataTable
          data={getAllAppointmentTypes}
          columns={appointmentTypesColumns(editEntry)}
        />
      </TableSheet>
      <Sidebar open={sidebarOpen} onClose={closeAndCleanSidebarForm}>
        <AppointmentTypeEditForm
          initialValues={initialValues}
          getSubmitButtonLabel={"Speichern"}
          onSubmit={doSubmit}
          onCancel={closeAndCleanSidebarForm}
          title={"Terminart bearbeiten"}
        />
      </Sidebar>
    </>
  );
}
