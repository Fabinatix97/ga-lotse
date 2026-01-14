/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";

import {
  DateField,
  NumberField,
  SelectField,
  TextareaField,
  YesOrNoWithFollowUp,
  useValidatePastOrTodayDate,
  validatePositiveInteger,
} from "@eshg/lib-portal";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { relationshipModelOptions } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";

export function General({ isForSexWork }: { isForSexWork: boolean }) {
  const validatePastOrTodayDate = useValidatePastOrTodayDate();
  const { values } = useFormikContext<MedicalHistoryFormData>();

  return (
    <SectionGrid aria-label="Allgemein" columns="3fr 3fr">
      <TextareaField
        name="general.examinationReason"
        label="Grund für die heutige Beratung"
      />
      <TextareaField
        name="general.currentSymptoms"
        label="Aktuelle Beschwerden"
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
            <NumberField
              name="general.numberOfPregnancies"
              label="Wenn ja, wie oft?"
              validate={validatePositiveInteger}
            />
          </YesOrNoWithFollowUp>
          {values.general.hasBeenPregnant === "yes" ? (
            <NumberField
              name="general.numberOfBirthsOrAbortions"
              label="Anzahl Geburten/Aborte"
              validate={validatePositiveInteger}
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
