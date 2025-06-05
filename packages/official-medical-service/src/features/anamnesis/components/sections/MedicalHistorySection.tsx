/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { isDefined } from "remeda";

import {
  CheckboxField,
  InputField,
  NumberField,
  OptionalFieldValue,
  RadioButtonsField,
  SetFieldValueHelper,
  TextareaField,
  createFieldNameMapper,
  validatePositiveInteger,
} from "@eshg/lib-portal";
import {
  ApiHeartDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

import { AnamnesisFormValues } from "../../config/form";
import {
  useAddictionOptions,
  useBooleanWithUnknownOptions,
  useEatingDisorderOptions,
  useHeartDiseaseOptions,
  useMentalIllnessOptions,
  useThyroidDiseaseOptions,
} from "../../hooks/options";
import { BooleanRadioField } from "../fields/BooleanRadioField";
import { MultiSelectWithCheckboxesField } from "../fields/MultiSelectWithCheckboxesField";
import { RadioButtonsWithFollowUp } from "../fields/RadioButtonsWithFollowUp";

import { SectionSheet } from "./SectionSheet";

export function MedicalHistorySection(props: Readonly<{ citizen?: boolean }>) {
  const { values, setFieldValue } = useFormikContext<AnamnesisFormValues>();

  return (
    <MemoizedMedicalHistorySection
      hadPastDiseasesOrDisabilities={
        values.medicalHistoryInfo.hadPastDiseasesOrDisabilities
      }
      heartDiseaseInfoWhich={values.medicalHistoryInfo.heartDiseaseInfo.which}
      setFieldValue={setFieldValue}
      {...props}
    />
  );
}

const MemoizedMedicalHistorySection = memo(InnerMedicalHistorySection);

interface InnerMedicalHistorySectionProps {
  citizen?: boolean;
  hadPastDiseasesOrDisabilities: OptionalFieldValue<boolean>;
  heartDiseaseInfoWhich: ApiHeartDisease[] | undefined;
  setFieldValue: SetFieldValueHelper;
}
function InnerMedicalHistorySection(props: InnerMedicalHistorySectionProps) {
  const { t } = useTranslation("officialMedicalService/anamnesis", {
    keyPrefix: "content.medicalHistory",
  });
  const medicalHistoryInfo = createFieldNameMapper("medicalHistoryInfo");

  const booleanWithUnknownOptions = useBooleanWithUnknownOptions();
  const heartDiseaseOptions = useHeartDiseaseOptions();
  const addictionOptions = useAddictionOptions();
  const eatingDisorderOptions = useEatingDisorderOptions();
  const mentalIllnessOptions = useMentalIllnessOptions();
  const thyroidDiseaseOptions = useThyroidDiseaseOptions();

  return (
    <SectionSheet title={t("title")} citizen={props.citizen}>
      <BooleanRadioField
        name={medicalHistoryInfo("hadPastDiseasesOrDisabilities")}
        label={t("hadPastDiseasesOrDisabilities.label")}
        required={t("hadPastDiseasesOrDisabilities.required")}
      />
      {props.hadPastDiseasesOrDisabilities && (
        <Stack direction="column" gap={3} divider={<Divider />}>
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("heartDiseaseInfo.answer")}
            label={t("heartDiseaseInfo.answer.label")}
            required={t("heartDiseaseInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <MultiSelectWithCheckboxesField
              options={heartDiseaseOptions}
              name={medicalHistoryInfo("heartDiseaseInfo.which")}
              label={t("heartDiseaseInfo.which.label")}
              required={t("heartDiseaseInfo.which.required")}
              placeholder={t("heartDiseaseInfo.which.placeholder")}
              onChange={(value) => {
                if (!value?.includes(ApiHeartDisease.CoronaryHeartDisease)) {
                  void props.setFieldValue(
                    "medicalHistoryInfo.heartDiseaseInfo.bypass",
                    null,
                  );
                  void props.setFieldValue(
                    "medicalHistoryInfo.heartDiseaseInfo.stent",
                    null,
                  );
                }
              }}
            />
            {isDefined(props.heartDiseaseInfoWhich) &&
              props.heartDiseaseInfoWhich.includes(
                ApiHeartDisease.CoronaryHeartDisease,
              ) && (
                <Stack direction="row" gap={3}>
                  <CheckboxField
                    name={medicalHistoryInfo("heartDiseaseInfo.bypass")}
                    label={t("heartDiseaseInfo.bypass.label")}
                  />
                  <CheckboxField
                    name={medicalHistoryInfo("heartDiseaseInfo.stent")}
                    label={t("heartDiseaseInfo.stent.label")}
                  />
                </Stack>
              )}
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("nervousSystemInfo.answer")}
            label={t("nervousSystemInfo.answer.label")}
            required={t("nervousSystemInfo.answer.required")}
          />
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("bonesJointsAndSpineInfo.answer")}
            label={t("bonesJointsAndSpineInfo.answer.label")}
            required={t("bonesJointsAndSpineInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("bonesJointsAndSpineInfo.which")}
              label={t("bonesJointsAndSpineInfo.which.label")}
              required={t("bonesJointsAndSpineInfo.which.required")}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("bladderKidneysAbdominalOrganInfo.answer")}
            label={t("bladderKidneysAbdominalOrganInfo.answer.label")}
            required={t("bladderKidneysAbdominalOrganInfo.answer.required")}
          />
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("allergiesAndIntoleranceInfo.answer")}
            label={t("allergiesAndIntoleranceInfo.answer.label")}
            required={t("allergiesAndIntoleranceInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("allergiesAndIntoleranceInfo.which")}
              label={t("allergiesAndIntoleranceInfo.which.label")}
              required={t("allergiesAndIntoleranceInfo.which.required")}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("earNoseThroatInfo.answer")}
            label={t("earNoseThroatInfo.answer.label")}
            required={t("earNoseThroatInfo.answer.required")}
          />
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("bronchiaLungsInfo.answer")}
            label={t("bronchiaLungsInfo.answer.label")}
            required={t("bronchiaLungsInfo.answer.required")}
          />
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("cancerInfo.answer")}
            label={t("cancerInfo.answer.label")}
            required={t("cancerInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("cancerInfo.whichAndWhen")}
              label={t("cancerInfo.whichAndWhen.label")}
              required={t("cancerInfo.whichAndWhen.required")}
            />
            <CheckboxField
              name={medicalHistoryInfo("cancerInfo.chemoRadiationTherapy")}
              label={t("cancerInfo.chemoRadiationTherapy.label")}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("stomachAndIntestinesInfo.answer")}
            label={t("stomachAndIntestinesInfo.answer.label")}
            required={t("stomachAndIntestinesInfo.answer.required")}
          />
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("liverInfo.answer")}
            label={t("liverInfo.answer.label")}
            required={t("liverInfo.answer.required")}
          />
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("diabetesInfo.answer")}
            label={t("diabetesInfo.answer.label")}
            required={t("diabetesInfo.answer.required")}
          />
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("eatingDisorderInfo.answer")}
            label={t("eatingDisorderInfo.answer.label")}
            required={t("eatingDisorderInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <MultiSelectWithCheckboxesField
              options={eatingDisorderOptions}
              name={medicalHistoryInfo("eatingDisorderInfo.which")}
              label={t("eatingDisorderInfo.which.label")}
              required={t("eatingDisorderInfo.which.required")}
              placeholder={t("eatingDisorderInfo.which.placeholder")}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("mentalIllnessInfo.answer")}
            label={t("mentalIllnessInfo.answer.label")}
            required={t("mentalIllnessInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("mentalIllnessInfo.description")}
              label={t("mentalIllnessInfo.description.label")}
              required={t("mentalIllnessInfo.description.required")}
            />
            <MultiSelectWithCheckboxesField
              options={mentalIllnessOptions}
              name={medicalHistoryInfo("mentalIllnessInfo.which")}
              label={t("mentalIllnessInfo.which.label")}
              required={t("mentalIllnessInfo.which.required")}
              placeholder={t("mentalIllnessInfo.which.placeholder")}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("thyroidInfo.answer")}
            label={t("thyroidInfo.answer.label")}
            required={t("thyroidInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <MultiSelectWithCheckboxesField
              options={thyroidDiseaseOptions}
              name={medicalHistoryInfo("thyroidInfo.which")}
              label={t("thyroidInfo.which.label")}
              required={t("thyroidInfo.which.required")}
              placeholder={t("thyroidInfo.which.placeholder")}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("addictionsInfo.answer")}
            label={t("addictionsInfo.answer.label")}
            required={t("addictionsInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <InputField
              name={medicalHistoryInfo("addictionsInfo.description")}
              label={t("addictionsInfo.description.label")}
              required={t("addictionsInfo.description.required")}
            />
            <MultiSelectWithCheckboxesField
              options={addictionOptions}
              name={medicalHistoryInfo("addictionsInfo.which")}
              label={t("addictionsInfo.which.label")}
              required={t("addictionsInfo.which.required")}
              placeholder={t("addictionsInfo.which.placeholder")}
            />
            <TextareaField
              name={medicalHistoryInfo("addictionsInfo.amount")}
              label={t("addictionsInfo.amount.label")}
              required={t("addictionsInfo.amount.required")}
            />
            <Stack direction="row" gap={3}>
              <InputField
                name={medicalHistoryInfo("addictionsInfo.since")}
                label={t("addictionsInfo.since.label")}
                required={t("addictionsInfo.since.required")}
              />
              <InputField
                name={medicalHistoryInfo("addictionsInfo.notAnymoreSince")}
                label={t("addictionsInfo.notAnymoreSince.label")}
              />
            </Stack>
          </RadioButtonsWithFollowUp>
          <RadioButtonsField
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("tuberculosisInfo.answer")}
            label={t("tuberculosisInfo.answer.label")}
            required={t("tuberculosisInfo.answer.required")}
          />
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("overweightInfo.answer")}
            label={t("overweightInfo.answer.label")}
            required={t("overweightInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("overweightInfo.description")}
              label={t("overweightInfo.description.label")}
              required={t("overweightInfo.description.required")}
            />
            <Stack direction="row" gap={3}>
              <NumberField
                name={medicalHistoryInfo("overweightInfo.heightInCm")}
                label={t("overweightInfo.heightInCm.label")}
                validate={validatePositiveInteger}
                required={t("overweightInfo.heightInCm.required")}
              />
              <NumberField
                name={medicalHistoryInfo("overweightInfo.weightInKg")}
                label={t("overweightInfo.weightInKg.label")}
                validate={validatePositiveInteger}
                required={t("overweightInfo.weightInKg.required")}
              />
            </Stack>
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("boneFractureBrainTraumaInfo.answer")}
            label={t("boneFractureBrainTraumaInfo.answer.label")}
            required={t("boneFractureBrainTraumaInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo(
                "boneFractureBrainTraumaInfo.description",
              )}
              label={t("boneFractureBrainTraumaInfo.description.label")}
              required={t("boneFractureBrainTraumaInfo.description.required")}
            />
            <TextareaField
              name={medicalHistoryInfo(
                "boneFractureBrainTraumaInfo.whatWhenAndWhere",
              )}
              label={t("boneFractureBrainTraumaInfo.whatWhenAndWhere.label")}
              required={t(
                "boneFractureBrainTraumaInfo.whatWhenAndWhere.required",
              )}
            />
          </RadioButtonsWithFollowUp>
          <RadioButtonsWithFollowUp
            options={booleanWithUnknownOptions}
            name={medicalHistoryInfo("miscellaneousInfo.answer")}
            label={t("miscellaneousInfo.answer.label")}
            required={t("miscellaneousInfo.answer.required")}
            followUpOn={ApiYesNoDontKnowAnswer.Yes}
          >
            <TextareaField
              name={medicalHistoryInfo("miscellaneousInfo.description")}
              label={t("miscellaneousInfo.description.label")}
              required={t("miscellaneousInfo.description.required")}
            />
          </RadioButtonsWithFollowUp>
        </Stack>
      )}
    </SectionSheet>
  );
}
