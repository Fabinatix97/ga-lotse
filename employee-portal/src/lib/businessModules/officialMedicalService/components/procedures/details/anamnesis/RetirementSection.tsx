/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextareaField } from "@eshg/lib-employee-portal";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";

import { BooleanRadioButtonsWithFollowUp } from "@/lib/businessModules/officialMedicalService/shared/BooleanRadioButtonsWithFollowUp";
import { SectionSheet } from "@/lib/businessModules/officialMedicalService/shared/SectionSheet";

export function RetirementSection() {
  const retirementInfo = createFieldNameMapper("retirementInfo");

  return (
    <SectionSheet
      title="Antrag auf Rente"
      slotProps={{ stack: { sx: { width: 2 / 3 } } }}
    >
      <BooleanRadioButtonsWithFollowUp
        name={retirementInfo("appliedForRetirement")}
        label="Haben Sie eine Rente beantragt?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <TextareaField
          name={retirementInfo("reason")}
          label="Weshalb?"
          required="Pflichtfeld ausfüllen"
        />
        <TextareaField
          name={retirementInfo("reductionOfEarningCapacity")}
          label="Minderung der Erwerbsfähigkeit"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
    </SectionSheet>
  );
}
