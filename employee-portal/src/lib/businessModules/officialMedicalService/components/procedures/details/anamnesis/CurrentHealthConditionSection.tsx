/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TextareaField } from "@eshg/lib-employee-portal";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Typography } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import { BooleanRadioButtonsWithFollowUp } from "@/lib/businessModules/officialMedicalService/shared/BooleanRadioButtonsWithFollowUp";
import { BooleanRadioField } from "@/lib/businessModules/officialMedicalService/shared/BooleanRadioField";
import { MultiSelectWithCheckboxesField } from "@/lib/businessModules/officialMedicalService/shared/MultiSelectWithCheckboxesField";
import { SectionSheet } from "@/lib/businessModules/officialMedicalService/shared/SectionSheet";
import {
  CURRENT_MEDICAL_CONDITION_OPTIONS,
  OPTICAL_AID_OPTIONS,
} from "@/lib/businessModules/officialMedicalService/shared/options";
import { RadioButtonsField } from "@/lib/shared/components/formFields/RadioButtonsField";

export function CurrentHealthConditionSection() {
  const currentHealthConditionInfo = createFieldNameMapper(
    "currentHealthConditionInfo",
  );

  const disabled = useIsFormDisabled();

  return (
    <SectionSheet
      title="Aktueller Gesundheitszustand"
      slotProps={{ stack: { sx: { width: 2 / 3 } } }}
    >
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo("currentMedicalConditionsInfo.answer")}
        label="Liegen aktuell Beschwerden vor?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <Typography
          level="title-md"
          component="h4"
          sx={{
            pt: 2,
            color: disabled
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
          }}
        >
          Beschwerden
        </Typography>
        <MultiSelectWithCheckboxesField
          options={CURRENT_MEDICAL_CONDITION_OPTIONS}
          name={currentHealthConditionInfo(
            "currentMedicalConditionsInfo.descriptionOfCondition",
          )}
          label="Beschreibung der Beschwerde"
          placeholder="Auswählen"
          required="Pflichtfeld ausfüllen"
        />
        <TextareaField
          name={currentHealthConditionInfo(
            "currentMedicalConditionsInfo.particulars",
          )}
          label="Nähere Angaben"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo("medicalImagingFindingsInfo.answer")}
        label="Ergaben bildgebende Verfahren (Röntgen, CT, MRT) Befunde?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <TextareaField
          name={currentHealthConditionInfo("medicalImagingFindingsInfo.result")}
          label="Ergebnis"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo(
          "medicationDietarySupplementsOrDrugsInfo.answer",
        )}
        label="Nehmen Sie zurzeit oder haben Sie in der Vergangenheit Medikamente, Nahrungsergänzungsmittel oder Drogen eingenommen?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <TextareaField
          name={currentHealthConditionInfo(
            "medicationDietarySupplementsOrDrugsInfo.substances",
          )}
          label="Mittel angeben"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
      <BooleanRadioField
        name={currentHealthConditionInfo("healthyAndCapableInfo.answer")}
        label="Fühlen Sie sich gesund und leistungsfähig?"
        required="Pflichtfeld ausfüllen"
      />
      <BooleanRadioButtonsWithFollowUp
        name={currentHealthConditionInfo("sportsInfo.answer")}
        label="Betätigen Sie sich sportlich?"
        required="Pflichtfeld ausfüllen"
        followUpOn={true}
      >
        <TextareaField
          name={currentHealthConditionInfo("sportsInfo.formOfSport")}
          label="Sportart"
          required="Pflichtfeld ausfüllen"
        />
      </BooleanRadioButtonsWithFollowUp>
      <RadioButtonsField
        options={OPTICAL_AID_OPTIONS}
        name={currentHealthConditionInfo("opticalAidInfo.answer")}
        label="Tragen Sie eine Sehhilfe?"
        orientation="horizontal"
        required="Pflichtfeld ausfüllen"
      />
      <TextareaField
        name={currentHealthConditionInfo(
          "primaryCareDoctorOrAttendingPhysician",
        )}
        label="Hausarzt oder behandelnder Arzt"
        required="Pflichtfeld ausfüllen"
      />
    </SectionSheet>
  );
}
