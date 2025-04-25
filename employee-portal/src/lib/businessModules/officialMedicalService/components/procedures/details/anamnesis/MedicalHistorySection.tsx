/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";
import { isDefined } from "remeda";

import { CheckboxField, TextareaField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiHeartDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

import { AnamnesisFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/anamnesis/AnamnesisForm.config";
import { BooleanRadioField } from "@/lib/businessModules/officialMedicalService/shared/BooleanRadioField";
import { MultiSelectWithCheckboxesField } from "@/lib/businessModules/officialMedicalService/shared/MultiSelectWithCheckboxesField";
import { RadioButtonsWithFollowUp } from "@/lib/businessModules/officialMedicalService/shared/RadioButtonsWithFollowUp";
import { SectionSheet } from "@/lib/businessModules/officialMedicalService/shared/SectionSheet";
import {
  ADDICTION_OPTIONS,
  BOOLEAN_WITH_UNKNOWN_OPTIONS,
  EATING_DISORDER_OPTIONS,
  HEART_DISEASE_OPTIONS,
  MENTAL_ILLNESS_OPTIONS,
  THYROID_DISEASE_OPTIONS,
} from "@/lib/businessModules/officialMedicalService/shared/options";
import { RadioButtonsField } from "@/lib/shared/components/formFields/RadioButtonsField";
import { validatePositiveInteger } from "@/lib/shared/helpers/validators";

export function MedicalHistorySection() {
  const { values } = useFormikContext<AnamnesisFormValues>();

  return (
    <MemoizedMedicalHistorySection
      hadPastDiseasesOrDisabilities={
        values.medicalHistoryInfo.hadPastDiseasesOrDisabilities
      }
      heartDiseaseInfoWhich={values.medicalHistoryInfo.heartDiseaseInfo.which}
    />
  );
}

const MemoizedMedicalHistorySection = memo(InnerMedicalHistorySection);

interface InnerMedicalHistorySectionProps {
  hadPastDiseasesOrDisabilities: OptionalFieldValue<boolean>;
  heartDiseaseInfoWhich: ApiHeartDisease[] | undefined;
}
function InnerMedicalHistorySection(props: InnerMedicalHistorySectionProps) {
  const medicalHistoryInfo = createFieldNameMapper("medicalHistoryInfo");

  return (
    <SectionSheet
      title="Gesundheitliche Vorgeschichte"
      slotProps={{ stack: { sx: { width: 2 / 3 } } }}
    >
      <BooleanRadioField
        name={medicalHistoryInfo("hadPastDiseasesOrDisabilities")}
        label="Hatten Sie in der Vergangenheit Krankheiten oder Behinderungen?"
        required="Pflichtfeld ausfüllen"
      />
      {props.hadPastDiseasesOrDisabilities && (
        <Stack direction="column" gap={3} divider={<Divider />}>
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("heartDiseaseInfo.answer")}
            label="Herz-, Kreislauf-, Gefäßerkrankungen"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <MultiSelectWithCheckboxesField
              options={HEART_DISEASE_OPTIONS}
              name={medicalHistoryInfo("heartDiseaseInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
              placeholder="Auswählen"
            />
            {isDefined(props.heartDiseaseInfoWhich) &&
              props.heartDiseaseInfoWhich.includes(
                ApiHeartDisease.CoronaryHeartDisease,
              ) && (
                <Stack direction="row" gap={3}>
                  <CheckboxField
                    name={medicalHistoryInfo("heartDiseaseInfo.bypass")}
                    label="Bypass"
                  />
                  <CheckboxField
                    name={medicalHistoryInfo("heartDiseaseInfo.stent")}
                    label="Stent"
                  />
                </Stack>
              )}
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("nervousSystemInfo.answer")}
            label="Nervensystem (z.B. Kopfschmerzen, Migräne, Multiple Skelose (MS), Epilepsie, Parkinson, etc.)"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("bonesJointsAndSpineInfo.answer")}
            label="Knochen- und Gelenksystem / Wirbelsäule"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("bonesJointsAndSpineInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("bladderKidneysAbdominalOrganInfo.answer")}
            label="Blase, Nieren, Unterleibsorgan (z.B. Harnwegsinfekte, Nierenbeckenentzündung, Endometriose, etc.)"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("allergiesAndIntoleranceInfo.answer")}
            label="Allergien / Unverträglichkeiten (z.B. Lactose, Fructose, Medikamente, Heuschnupfen)"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("allergiesAndIntoleranceInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("earNoseThroatInfo.answer")}
            label="Hals / Nasen / Ohren"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("bronchiaLungsInfo.answer")}
            label="Bronchien / Lunge (z.B. Astma bronchiale, COPD)"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("cancerInfo.answer")}
            label="Krebserkrankung"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("cancerInfo.whichAndWhen")}
              label="Welche und wann?"
              required="Pflichtfeld ausfüllen"
            />
            <CheckboxField
              name={medicalHistoryInfo("cancerInfo.chemoRadiationTherapy")}
              label="Chemo- / Strahlentherapie"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("stomachAndIntestinesInfo.answer")}
            label="Magen / Darm (z.B. Morbus Crohn, Colitis ulcerosa)"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("liverInfo.answer")}
            label="Leber (z.B. Fettleber (Steatosis hepatis), Hepatitis, Gallensteine, Gallenblase)"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("diabetesInfo.answer")}
            label="Diabetes"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("eatingDisorderInfo.answer")}
            label="Essstörung"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <MultiSelectWithCheckboxesField
              options={EATING_DISORDER_OPTIONS}
              name={medicalHistoryInfo("eatingDisorderInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
              placeholder="Auswählen"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("mentalIllnessInfo.answer")}
            label="Psychische Erkrankung"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("mentalIllnessInfo.description")}
              label="Beschreibung"
              required="Pflichtfeld ausfüllen"
            />
            <MultiSelectWithCheckboxesField
              options={MENTAL_ILLNESS_OPTIONS}
              name={medicalHistoryInfo("mentalIllnessInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
              placeholder="Auswählen"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("thyroidInfo.answer")}
            label="Schilddrüse"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <MultiSelectWithCheckboxesField
              options={THYROID_DISEASE_OPTIONS}
              name={medicalHistoryInfo("thyroidInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
              placeholder="Auswählen"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("addictionsInfo.answer")}
            label="Suchterkrankungen"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <InputField
              name={medicalHistoryInfo("addictionsInfo.description")}
              label="Beschreibung"
              required="Pflichtfeld ausfüllen"
            />
            <MultiSelectWithCheckboxesField
              options={ADDICTION_OPTIONS}
              name={medicalHistoryInfo("addictionsInfo.which")}
              label="Welche?"
              required="Pflichtfeld ausfüllen"
              placeholder="Auswählen"
            />
            <TextareaField
              name={medicalHistoryInfo("addictionsInfo.amount")}
              label="Tägliche / wöchentliche / monatliche Menge"
              required="Pflichtfeld ausfüllen"
            />
            <Stack direction="row" gap={3}>
              <InputField
                name={medicalHistoryInfo("addictionsInfo.since")}
                label="Seit wann"
                required="Pflichtfeld ausfüllen"
              />
              <InputField
                name={medicalHistoryInfo("addictionsInfo.notAnymoreSince")}
                label="Nicht mehr seit"
              />
            </Stack>
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("tuberculosis.answer")}
            label="Tuberkulose"
            required="Pflichtfeld ausfüllen"
          />
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("overweightInfo.answer")}
            label="Übergewicht / Adipositas"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("overweightInfo.description")}
              label="Beschreibung"
              required="Pflichtfeld ausfüllen"
            />
            <Stack direction="row" gap={3}>
              <NumberField
                name={medicalHistoryInfo("overweightInfo.heightInCm")}
                label="Körpergröße (in cm)"
                validate={validatePositiveInteger}
                required="Pflichtfeld ausfüllen"
              />
              <NumberField
                name={medicalHistoryInfo("overweightInfo.weightInKg")}
                label="Körpergewicht (in kg)"
                validate={validatePositiveInteger}
                required="Pflichtfeld ausfüllen"
              />
            </Stack>
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("boneFractureBrainTraumaInfo.answer")}
            label="Unfälle: Knochenbruch / Hirntrauma"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo(
                "boneFractureBrainTraumaInfo.description",
              )}
              label="Beschreibung"
              required="Pflichtfeld ausfüllen"
            />
            <TextareaField
              name={medicalHistoryInfo(
                "boneFractureBrainTraumaInfo.whatWhenAndWhere",
              )}
              label="Was, wann und wie?"
              required="Pflichtfeld ausfüllen"
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            name={medicalHistoryInfo("miscellaneousInfo.answer")}
            label="Sonstiges"
            required="Pflichtfeld ausfüllen"
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("miscellaneousInfo.description")}
              label="Beschreibung"
              required="Pflichtfeld ausfüllen"
            />
          </RadioButtonsWithFollowUp>
        </Stack>
      )}
    </SectionSheet>
  );
}
