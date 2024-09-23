/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentFormWrapper } from "@/lib/businessModules/travelMedicine/components/appointment/AppointmentFormWrapper";
import { AppointmentTypeStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/AppointmentTypeStep";
import { PersonalDataStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/PersonalDataStep";
import { TravelDataStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/TravelDataStep";
import { TravelTypeStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/TravelTypeStep";
import { AppointmentReviewStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentReviewFormStep/AppointmentReviewStep";
import { AppointmentSlotStep } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/AppointmentSlotStep";
import { DepartmentContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/DepartmentContext";
import { StepContextProvider } from "@/lib/businessModules/travelMedicine/components/shared/contexts/StepContext";

export enum StepKey {
  AppointmentTypeStep = "AppointmentTypeStep",
  AppointmentSlotStep = "AppointmentSlotStep",
  TravelTypeStep = "TravelTypeStep",
  TravelDataStep = "TravelDataStep",
  PersonalDataStep = "PersonalDataStep",
  AppointmentReviewStep = "AppointmentReviewStep",
}

export function AppointmentStepper() {
  const appointmentFormSteps = [
    <AppointmentTypeStep key={StepKey.AppointmentTypeStep} />,
    <AppointmentSlotStep key={StepKey.AppointmentSlotStep} />,
    <TravelTypeStep key={StepKey.TravelTypeStep} />,
    <TravelDataStep key={StepKey.TravelDataStep} />,
    <PersonalDataStep key={StepKey.PersonalDataStep} />,
    // <VaccinationStep key={"VaccinationStep"} />,
    <AppointmentReviewStep key={StepKey.AppointmentReviewStep} />,
  ];

  return (
    <StepContextProvider steps={appointmentFormSteps}>
      <DepartmentContextProvider>
        <AppointmentFormWrapper />
      </DepartmentContextProvider>
    </StepContextProvider>
  );
}
