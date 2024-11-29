/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { validatePastOrTodayDate } from "@eshg/lib-portal/helpers/validators";
import { useFormikContext } from "formik";

import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { SectionGrid } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/YesOrNoWithFollowUp";
import { relationshipModelOptions } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export function General({ isForSexWork }: { isForSexWork: boolean }) {
  const { values } = useFormikContext<MedicalHistoryFormData>();

  return (
    <SectionGrid aria-label="Allgemein">
      <TextareaField
        name="general.examinationReason"
        label={"Grund für die heutige Beratung"}
      />
      <TextareaField
        name="general.currentSymptoms"
        label={"Aktuelle Beschwerden"}
      />
      <DateField
        name="general.contactToClarifyDate"
        label="Zeitpunkt abzuklärender Kontakt"
        validate={validatePastOrTodayDate}
      />
      <SelectField
        name="general.relationshipModel"
        options={relationshipModelOptions}
        label="Beziehungsmodell"
      />
      {isForSexWork && (
        <>
          <DateField
            name="general.lastMenstruation"
            label="Letzte Menstruation"
            validate={validatePastOrTodayDate}
          />
          <DateField
            name="general.lastCancerScreening"
            label="Letzte Krebsvorsorge"
            validate={validatePastOrTodayDate}
          />
          <YesOrNoWithFollowUp
            name="general.hasBeenPregnant"
            label="Waren Sie schon mal schwanger?"
          >
            <InputField
              name="general.numberOfPregnancies"
              label="Wenn ja, wie oft?"
            />
          </YesOrNoWithFollowUp>
          {values.general.hasBeenPregnant === "yes" ? (
            <InputField
              name="general.numberOfBirthsOrAbortions"
              label="Anzahl Geburten/Aborte"
            />
          ) : null}
          <TextareaField
            name="general.knownOperationsOrIllnesses"
            label="Bekannte Operationen oder Erkrankungen "
            sx={{
              gridColumn: 1,
              fontWeight: 500,
            }}
          />
          <TextareaField
            name="general.medications"
            label="Medikamente"
            sx={{
              fontWeight: 500,
            }}
          />
        </>
      )}
    </SectionGrid>
  );
}
