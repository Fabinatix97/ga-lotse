/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useState } from "react";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useGetAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/queries/appointmentBlockApi";
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

  const appointmentBlock = useGetAppointmentBlock(appointmentBlockId);

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
        refetchEvents={refetchEvents}
        formRef={formRef}
        onCancel={() => setState("display")}
        onClose={onClose}
      />
    );
  }
}
