/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentTypeConfig } from "@eshg/travel-medicine-api";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useUpdateAppointmentType } from "@/lib/businessModules/travelMedicine/api/mutations/appointmentTypes";
import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import {
  AppointmentTypeForm,
  AppointmentTypeFormValues,
} from "@/lib/businessModules/travelMedicine/components/appointmentTypes/AppointmentTypeForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useAppointmentTypeSidebar(): UseSidebarWithFormRefResult<AppointmentTypeSidebarProps> {
  return useSidebarWithFormRef({
    component: AppointmentTypeSidebar,
  });
}

interface AppointmentTypeSidebarProps extends SidebarWithFormRefProps {
  appointmentTypeConfig: ApiAppointmentTypeConfig;
}

function AppointmentTypeSidebar(props: Readonly<AppointmentTypeSidebarProps>) {
  const [{ data: getAllAppointmentTypes }] = useSuspenseQueries({
    queries: [useGetAllAppointmentTypesQuery()],
  });

  const initialConfig = getAllAppointmentTypes[0];

  const updateAppointmentType = useUpdateAppointmentType();

  function mapInitialValues(
    currentAppointmentTypeConfig: ApiAppointmentTypeConfig,
  ): AppointmentTypeFormValues {
    return {
      id: currentAppointmentTypeConfig?.id ?? "",
      appointmentTypeDto:
        currentAppointmentTypeConfig?.appointmentTypeDto ??
        initialConfig!.appointmentTypeDto,
      standardDurationInMinutes:
        currentAppointmentTypeConfig?.standardDurationInMinutes?.toString() ??
        "",
    };
  }

  async function handleSubmit(values: AppointmentTypeFormValues) {
    const data = {
      id: values.id,
      request: {
        standardDurationInMinutes: +values.standardDurationInMinutes,
      },
    };
    await updateAppointmentType.mutateAsync(data, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  return (
    <AppointmentTypeForm
      initialValues={mapInitialValues(props.appointmentTypeConfig)}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={"Terminart bearbeiten"}
      submitLabel={"Speichern"}
    />
  );
}
