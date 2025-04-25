/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { createContext, useContext } from "react";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { ApiGetAppointmentDetailsResponse } from "@eshg/travel-medicine-api";

import { useGetProcedureStepAppointmentDetails } from "@/lib/businessModules/travelMedicine/api/queries/citizenAuthApi";

interface IdContextProps {
  procedureId: string;
  procedureStepId: string;
  appointmentDetails: ApiGetAppointmentDetailsResponse;
}

export const IdContext = createContext<IdContextProps | null>(null);

type IdContextProviderProps = RequiresChildren;

export function IdContextProvider(props: Readonly<IdContextProviderProps>) {
  const searchParams = useSearchParams();
  const procedureId = searchParams.get("procedureId")!;
  const procedureStepId = searchParams.get("procedureStepId")!;
  const { data: appointmentDetails } = useGetProcedureStepAppointmentDetails(
    procedureId,
    procedureStepId,
  );

  return (
    <IdContext value={{ procedureId, procedureStepId, appointmentDetails }}>
      {props.children}
    </IdContext>
  );
}

export function useIdContext() {
  const context = useContext(IdContext);
  if (!context) {
    throw new Error("useIdContext must be used with a IdProvider");
  }
  return context;
}
