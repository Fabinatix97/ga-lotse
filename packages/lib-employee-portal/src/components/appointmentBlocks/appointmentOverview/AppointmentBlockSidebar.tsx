/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { QueryKeyFactory } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../../api/AppointmentBlockApi";
import { User } from "../../../api/models/User";
import { UpdateAppointmentBlockSidebar } from "../UpdateAppointmentBlockSidebar";
import { ApiAppointmentType, AppointmentStandardDurations } from "../types";

import { DisplayAppointmentBlockSidebar } from "./DisplayAppointmentBlockSidebar";

export function useAppointmentBlockSidebar(): UseSidebarWithFormRefResult<AppointmentBlockSidebarProps> {
  return useSidebarWithFormRef({ component: AppointmentBlockSidebar });
}

interface AppointmentBlockSidebarProps extends SidebarWithFormRefProps {
  appointmentBlockId: string;
  refetchEvents: () => void;
  isLimitedView?: boolean;
  standardDurations: AppointmentStandardDurations;
  withTeam: boolean;
  physicians?: User[];
  mfas?: User[];
  consultants?: User[];
  sopasss?: User[];
  creator?: User;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  appointmentTypes?: ApiAppointmentType[];
}

type SidebarMode = "update" | "display";

function AppointmentBlockSidebar({
  appointmentBlockId,
  refetchEvents,
  isLimitedView,
  onClose,
  formRef,
  standardDurations,
  physicians,
  mfas,
  consultants,
  sopasss,
  appointmentBlockApi,
  appointmentBlockApiQueryKey,
  appointmentTypes,
  withTeam,
}: AppointmentBlockSidebarProps) {
  const [state, setState] = useState<SidebarMode>("display");

  if (state === "display") {
    return (
      <DisplayAppointmentBlockSidebar
        appointmentBlockApi={appointmentBlockApi}
        appointmentBlockId={appointmentBlockId}
        refetchEvents={refetchEvents}
        isLimitedView={isLimitedView}
        appointmentBlockApiQueryKey={appointmentBlockApiQueryKey}
        onUpdate={() => setState("update")}
        onClose={onClose}
      />
    );
  } else if (state === "update") {
    return (
      <UpdateAppointmentBlockSidebar
        appointmentBlockApi={appointmentBlockApi}
        appointmentBlockId={appointmentBlockId}
        appointmentTypes={appointmentTypes}
        withTeam={withTeam}
        physicians={physicians}
        consultants={consultants}
        sopasss={sopasss}
        formRef={formRef}
        standardDurations={standardDurations}
        appointmentBlockApiQueryKey={appointmentBlockApiQueryKey}
        mfas={mfas}
        refetchEvents={refetchEvents}
        onClose={onClose}
        onCancel={() => setState("display")}
      />
    );
  }
}
