/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useGetProcedure } from "@/lib/businessModules/stiProtection/api/queries/citizenApi";
import { FormDataProvider } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { Stepper } from "@/lib/businessModules/stiProtection/components/shared/StepContext";

import { GeneralStep } from "./Steps/GeneralStep";
import { PreventionStep } from "./Steps/PreventionStep";
import { PreviousIllnessesStep } from "./Steps/PreviousIllnessesStep";

const steps = [GeneralStep, PreviousIllnessesStep, PreventionStep] as const;

export function AnamnesisStepper() {
  const {
    data: { concern },
  } = useGetProcedure();

  return (
    <FormDataProvider initialData={{ concern }}>
      <Stepper steps={steps} />
    </FormDataProvider>
  );
}
