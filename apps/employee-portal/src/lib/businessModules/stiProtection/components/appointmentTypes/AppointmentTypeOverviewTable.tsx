/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormikProps } from "formik";
import { useRef, useState } from "react";

import {
  DataTable,
  Sidebar,
  TableSheet,
  useSearchParam,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal";
import { ApiAppointmentTypeConfig } from "@eshg/sti-protection-api";

import { useUpdateAppointmentType } from "@/lib/businessModules/stiProtection/api/mutations/appointmentTypes";
import { useGetAllAppointmentTypes } from "@/lib/businessModules/stiProtection/api/queries/appointmentTypes";
import {
  AppointmentTypeEditForm,
  EditableAppointmentType,
} from "@/lib/businessModules/stiProtection/components/appointmentTypes/AppointmentTypeEditForm";
import { appointmentTypesColumns } from "@/lib/businessModules/stiProtection/components/appointmentTypes/columns";

export function AppointmentTypeOverviewTable() {
  const [sidebarOpenId, setSidebarOpenId] = useSearchParam("edit", "string");
  const snackbar = useSnackbar();

  useState<ApiAppointmentTypeConfig>();
  const formikRef = useRef<FormikProps<EditableAppointmentType>>(null);

  const updateTypeMutation = useUpdateAppointmentType({
    onSuccess: () => {
      snackbar.confirmation("Der Termintyp wurde aktualisiert.");
      closeAndCleanSidebarForm();
    },
  });

  const allAppointmentTypes = useGetAllAppointmentTypes();
  const currentTypeConfig =
    allAppointmentTypes.data.appointmentTypeConfigs.find(
      (t) => t.id === sidebarOpenId,
    );

  const initialValues: EditableAppointmentType | undefined =
    currentTypeConfig !== undefined
      ? {
          id: currentTypeConfig.id ?? "",
          appointmentTypeDto: currentTypeConfig.appointmentTypeDto,
          standardDurationInMinutes:
            currentTypeConfig.standardDurationInMinutes?.toString() ?? "",
        }
      : undefined;

  function editEntry(typeConfig: ApiAppointmentTypeConfig) {
    setSidebarOpenId(typeConfig.id);
  }

  function doSubmit(values: EditableAppointmentType) {
    const standardDurationInMinutes = parseInt(
      values.standardDurationInMinutes,
      10,
    );
    const request = { standardDurationInMinutes: standardDurationInMinutes };
    return updateTypeMutation.mutateAsync({ id: values.id, request });
  }

  function closeAndCleanSidebarForm() {
    setSidebarOpenId(null);
    formikRef.current?.resetForm();
  }

  return (
    <>
      <TableSheet>
        <DataTable
          data={allAppointmentTypes.data.appointmentTypeConfigs}
          columns={appointmentTypesColumns(editEntry)}
        />
      </TableSheet>
      <Sidebar
        open={initialValues !== undefined}
        onClose={closeAndCleanSidebarForm}
      >
        {initialValues !== undefined ? (
          <AppointmentTypeEditForm
            initialValues={initialValues}
            getSubmitButtonLabel="Speichern"
            title="Terminart bearbeiten"
            onSubmit={doSubmit}
            onCancel={closeAndCleanSidebarForm}
          />
        ) : null}
      </Sidebar>
    </>
  );
}
