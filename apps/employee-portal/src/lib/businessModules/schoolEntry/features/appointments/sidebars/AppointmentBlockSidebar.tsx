/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { useAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { getAppointmentBlockQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
import {
  getAllMedicalAssistantsQuery,
  getAllPhysiciansQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/appointmentStaff";
import { DisplayAppointmentBlockSidebar } from "@/lib/businessModules/schoolEntry/features/appointments/sidebars/DisplayAppointmentBlockSidebar";
import { UpdateAppointmentBlockSidebar } from "@/lib/businessModules/schoolEntry/features/appointments/sidebars/UpdateAppointmentBlockSidebar";

export function useAppointmentBlockSidebar(): UseSidebarWithFormRefResult<AppointmentBlockSidebarProps> {
  return useSidebarWithFormRef({ component: AppointmentBlockSidebar });
}

interface AppointmentBlockSidebarProps extends SidebarWithFormRefProps {
  appointmentBlockId: string;
  refetchEvents: () => void;
  isLimitedView?: boolean;
}

type SidebarMode = "update" | "display";

function AppointmentBlockSidebar({
  appointmentBlockId,
  refetchEvents,
  isLimitedView,
  onClose,
  formRef,
}: AppointmentBlockSidebarProps) {
  const [state, setState] = useState<SidebarMode>("display");
  const appointmentBlockApi = useAppointmentBlockApi();
  const userApi = useUserApi();
  const [
    { data: appointmentBlock },
    { data: allPhysicians },
    { data: allMfas },
  ] = useSuspenseQueries({
    queries: [
      getAppointmentBlockQuery(appointmentBlockApi, appointmentBlockId),
      getAllPhysiciansQuery(userApi),
      getAllMedicalAssistantsQuery(userApi),
    ],
  });

  if (state === "display") {
    return (
      <DisplayAppointmentBlockSidebar
        appointmentBlock={appointmentBlock}
        refetchEvents={refetchEvents}
        isLimitedView={isLimitedView}
        onUpdate={() => setState("update")}
        onClose={onClose}
      />
    );
  } else if (state === "update") {
    return (
      <UpdateAppointmentBlockSidebar
        appointmentBlock={appointmentBlock}
        allPhysicians={allPhysicians}
        allMfas={allMfas}
        refetchEvents={refetchEvents}
        formRef={formRef}
        onCancel={() => setState("display")}
        onClose={onClose}
      />
    );
  }
}
