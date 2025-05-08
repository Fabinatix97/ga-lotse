/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { CheckboxGroupField } from "@eshg/lib-portal/components/formFields/CheckboxGroupField";
import { FieldSetControl } from "@eshg/lib-portal/components/formFields/FieldSetControl";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Legend } from "@eshg/lib-portal/components/formFields/Legend";
import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";
import { validatePositiveInteger } from "@eshg/lib-portal/helpers/validators";
import { ApiConcern } from "@eshg/sti-protection-api";

import {
  AnamnesisFormData,
  FormDataWithoutConcern,
  defaultPreviousIllnesses,
} from "@/lib/businessModules/stiProtection/components/anamnesis/AnamnesisStepper.config";
import { useFormData } from "@/lib/businessModules/stiProtection/components/appointment/AppointmentDataContext";
import { useTranslation } from "@/lib/i18n/client";

import { PrivacyNotice } from "./PrivacyNotice";
import {
  ExaminableIllnesses,
  useExaminableIllnessNames,
  useSexWorkTypeOptions,
  useSexualContactGenderOptions,
  useSexualContactRiskFactorOptions,
  useSexualOrientationOptions,
} from "./options";

export function PreviousIllnessesStep() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);
  const { setFieldValue, initialValues, values } =
    useFormikContext<FormDataWithoutConcern>();
  const [{ concern }] = useFormData<AnamnesisFormData>();

  const isForSexWork = concern === ApiConcern.SexWork;
  const examinableIllnessNames = useExaminableIllnessNames();
  const sexualOrientationOptions = useSexualOrientationOptions();
  const sexualContactGenderOptions = useSexualContactGenderOptions();
  const sexualContactFactorOptions = useSexualContactRiskFactorOptions();
  const sexWorkTypeOptions = useSexWorkTypeOptions();

  return (
    <>
      <PrivacyNotice />
      <Typography level="h2">{t("previous_illnesses.title")}</Typography>
      <Box component="section" aria-label={t("previous_illnesses.title")}>
        <Grid container rowSpacing={2} columnSpacing={3}>
          {Object.keys(defaultPreviousIllnesses)
            .filter((t) => !["other", "otherData"].includes(t))
            .map((diseaseType) => (
              <Grid key={diseaseType} xxs={12}>
                <YesOrNoWithFollowUp
                  name={`previousIllnesses.${diseaseType}`}
                  label={
                    <Typography level="title-sm">
                      {
                        examinableIllnessNames[
                          diseaseType as ExaminableIllnesses
                        ]
                      }
                    </Typography>
                  }
                  ariaLabel={
                    examinableIllnessNames[diseaseType as ExaminableIllnesses]
                  }
                  positiveLabel={t("stiProtection/forms:common.yes")}
                  negativeLabel={t("stiProtection/forms:common.no")}
                  resetLabel={t("stiProtection/forms:common.reset")}
                />
              </Grid>
            ))}
          <Grid xxs={12}>
            <YesOrNoWithFollowUp
              name="previousIllnesses.other"
              label={
                <Typography level="title-sm">
                  {t("previous_illnesses.other")}
                </Typography>
              }
              ariaLabel={t("previous_illnesses.other")}
              positiveLabel={t("stiProtection/forms:common.yes")}
              negativeLabel={t("stiProtection/forms:common.no")}
              resetLabel={t("stiProtection/forms:common.reset")}
              onReset={async () =>
                await setFieldValue(
                  "previousIllnesses.otherData",
                  initialValues.previousIllnesses.otherData,
                )
              }
            >
              <InputField
                sx={{ gridColumn: 2 }}
                name="previousIllnesses.otherData"
                label={t("previous_illnesses.other_data")}
              />
            </YesOrNoWithFollowUp>
          </Grid>
        </Grid>
      </Box>
      <Typography level="h2">
        {t("sexual_orientation_and_contact.title")}
      </Typography>
      <Box
        component="section"
        aria-label={t("sexual_orientation_and_contact.title")}
      >
        <Grid container rowSpacing={2} columnSpacing={3} alignItems="flex-end">
          <Grid xxs={12} xs={6}>
            <SelectField
              name="sexualOrientationAndContact.sexualOrientation"
              label={t("sexual_orientation_and_contact.sexual_orientation")}
              options={sexualOrientationOptions}
            />
          </Grid>
          <Grid xxs={12} xs={6}>
            <NumberField
              name="sexualOrientationAndContact.numberOfSexualPartnersLast12Months"
              label={t(
                "sexual_orientation_and_contact.number_of_sexual_partners_last_12_months",
              )}
              validate={validatePositiveInteger}
            />
          </Grid>
          <Grid xxs={12}>
            <CheckboxGroupField
              name="sexualOrientationAndContact.sexualContactGenders"
              label={t("sexual_orientation_and_contact.sexual_contact_genders")}
              labelLevel="title-sm"
              options={sexualContactGenderOptions}
            />
          </Grid>
          <Grid xxs={12}>
            <CheckboxGroupField
              sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
              name="sexualOrientationAndContact.sexualContactFactors"
              label={t("sexual_orientation_and_contact.sexual_contact")}
              labelLevel="title-sm"
              options={sexualContactFactorOptions}
              orientation="vertical"
            />
          </Grid>
          {isForSexWork && (
            <>
              <Grid xxs={12}>
                <CheckboxGroupField
                  sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
                  name="sexualOrientationAndContact.sexWorkType"
                  label={
                    <Typography level="title-sm">
                      {t("sexual_orientation_and_contact.sex_work")}
                    </Typography>
                  }
                  options={sexWorkTypeOptions}
                  orientation="vertical"
                />
              </Grid>
              <Grid xxs={12}>
                <FieldSetControl aria-label={t("sex_work.employment_duration")}>
                  <Legend>
                    <Typography level="title-sm">
                      {t("sex_work.employment_duration")}
                    </Typography>
                  </Legend>
                  <MonthAndYearFields
                    fieldName="sexualOrientationAndContact.startInSexWork"
                    date={values.sexualOrientationAndContact.startInSexWork}
                    monthLabel={t("stiProtection/forms:common.month")}
                    yearLabel={t("stiProtection/forms:common.year")}
                  />
                </FieldSetControl>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </>
  );
}
