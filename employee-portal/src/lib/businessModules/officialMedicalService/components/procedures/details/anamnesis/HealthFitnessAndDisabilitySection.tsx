/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextareaField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { YearField } from "@eshg/lib-portal/components/formFields/YearField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack } from "@mui/joy";

import { BooleanRadioButtonsWithFollowUp } from "@/lib/businessModules/officialMedicalService/shared/BooleanRadioButtonsWithFollowUp";
import { SectionSheet } from "@/lib/businessModules/officialMedicalService/shared/SectionSheet";

export function HealthFitnessAndDisabilitySection() {
  const healthFitnessAndDisabilityInfo = createFieldNameMapper(
    "healthFitnessAndDisabilityInfo",
  );

  return (
    <SectionSheet
      title="Gesundheitliche Eignung und Behinderung"
      slotProps={{ stack: { sx: { width: 2 / 3 } } }}
    >
      <BooleanRadioButtonsWithFollowUp
        name={healthFitnessAndDisabilityInfo(
          "priorExaminationInfo.hasPriorExaminations",
        )}
        label="Wurden Sie schon einmal auf Ihre gesundheitliche Eignung untersucht (z. B. Musterung, Gesundheitsamt, Betriebsärztlicher Dienst)?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <Stack direction="row" gap={3}>
          <YearField
            name={healthFitnessAndDisabilityInfo("priorExaminationInfo.year")}
            min={1900}
            max={new Date().getFullYear()}
            label="Wann?"
            required="Pflichtfeld ausfüllen"
          />
          <InputField
            name={healthFitnessAndDisabilityInfo("priorExaminationInfo.place")}
            label="Wo?"
            required="Pflichtfeld ausfüllen"
          />
        </Stack>
        <TextareaField
          name={healthFitnessAndDisabilityInfo("priorExaminationInfo.reason")}
          label="Weshalb?"
          required="Pflichtfeld ausfüllen"
        />
        <TextareaField
          name={healthFitnessAndDisabilityInfo("priorExaminationInfo.result")}
          label="Ergebnis"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioButtonsWithFollowUp
        name={healthFitnessAndDisabilityInfo("disabilityInfo.hasDisability")}
        label="Besteht eine Behinderung oder liegt ein Bescheid des Versorgungsamtes über eine Behinderung bzw.
Schwerbehinderung vor?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <TextareaField
          name={healthFitnessAndDisabilityInfo("disabilityInfo.reason")}
          label="Weshalb?"
          required="Pflichtfeld ausfüllen"
        />
        <TextareaField
          name={healthFitnessAndDisabilityInfo("disabilityInfo.degree")}
          label="Grad der Behinderung"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
    </SectionSheet>
  );
}
