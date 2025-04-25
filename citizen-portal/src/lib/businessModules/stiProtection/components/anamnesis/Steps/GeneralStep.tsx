/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, FormControl, FormLabel, Grid, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";
import { useValidators } from "@eshg/lib-portal/hooks/useValidators";

import { FormDataWithoutConcern } from "@/lib/businessModules/stiProtection/components/anamnesis/AnamnesisStepper.config";
import { validatePositiveInteger } from "@/lib/businessModules/stiProtection/components/anamnesis/helpers";
import { useTranslation } from "@/lib/i18n/client";
import { TextareaField } from "@/lib/shared/components/form/TextareaField";

import { PrivacyNotice } from "./PrivacyNotice";
import {
  ExaminableIllnesses,
  useExaminableIllnessNames,
  useRelationshipModelOptions,
} from "./options";

export function GeneralStep() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);
  const { validateLength, validatePastOrTodayDate } = useValidators();
  const { setFieldValue, initialValues, values } =
    useFormikContext<FormDataWithoutConcern>();

  const relationshipModelOptions = useRelationshipModelOptions();
  const examinableIllnessNames = useExaminableIllnessNames();

  return (
    <>
      <PrivacyNotice />
      <Typography level="h2">{t("general.title")}</Typography>
      <Box component="section" aria-label={t("general.title")}>
        <Grid container rowSpacing={2} columnSpacing={3}>
          <Grid xxs={12}>
            <InputField
              name="general.examinationReason"
              label={t("general.examinationReason")}
            />
          </Grid>
          <Grid xxs={12}>
            <TextareaField
              name="general.currentSymptoms"
              label={t("general.currentSymptoms")}
              validate={validateLength(0, 1000)}
            />
          </Grid>
          <Grid xxs={12} xs={6}>
            <DateField
              name="general.contactToClarifyDate"
              label={t("general.contactToClarifyDate")}
              validate={validatePastOrTodayDate}
            />
          </Grid>
          <Grid xxs={12} xs={6}>
            <SelectField
              name="general.relationshipModel"
              options={relationshipModelOptions}
              label={t("general.relationship_model.title")}
            />
          </Grid>
          <Grid xxs={12} xs={6}>
            <DateField
              name="general.lastMenstruation"
              label={t("general.lastMenstruation")}
              validate={validatePastOrTodayDate}
            />
          </Grid>
          <Grid xxs={12} xs={6}>
            <DateField
              name="general.lastCancerScreening"
              label={t("general.lastCancerScreening")}
              validate={validatePastOrTodayDate}
            />
          </Grid>
          <Grid xxs={12}>
            <InputField
              name="general.knownOperationsOrIllnesses"
              label={t("general.knownOperationsOrIllnesses")}
            />
          </Grid>
          <Grid xxs={12}>
            <TextareaField
              name="general.medications"
              label={t("general.medications")}
              validate={validateLength(0, 1000)}
            />
          </Grid>
        </Grid>
        <YesOrNoWithFollowUp
          name="general.hasBeenPregnant"
          label={
            <Typography level="title-sm">
              {t("general.hasBeenPregnant")}
            </Typography>
          }
          ariaLabel={t("general.hasBeenPregnant")}
          orientation="vertical"
          positiveLabel={t("stiProtection/forms:common.yes")}
          negativeLabel={t("stiProtection/forms:common.no")}
          resetLabel={t("stiProtection/forms:common.reset")}
          onReset={async () => {
            await setFieldValue(
              "general.numberOfPregnancies",
              initialValues.general.numberOfPregnancies,
            );
            await setFieldValue(
              "general.numberOfBirthsOrAbortions",
              initialValues.general.numberOfBirthsOrAbortions,
            );
          }}
          sx={{
            mt: 4,
          }}
        >
          <Grid container rowSpacing={2} columnSpacing={3}>
            <Grid xxs={12} xs={6}>
              <NumberField
                name="general.numberOfPregnancies"
                label={t("general.numberOfPregnancies")}
                validate={validatePositiveInteger}
              />
            </Grid>
            <Grid xxs={12} xs={6}>
              <NumberField
                name="general.numberOfBirthsOrAbortions"
                label={t("general.numberOfBirthsOrAbortions")}
                validate={validatePositiveInteger}
              />
            </Grid>
          </Grid>
        </YesOrNoWithFollowUp>
        <Box mt={4} mb={3}>
          <Typography level="h2" mb={1}>
            {t("examinations.title")}
          </Typography>
          <Typography level="body-md">{t("examinations.subtitle")}</Typography>
        </Box>
        <Box component="section" aria-label={t("examinations.title")}>
          <Grid container rowSpacing={3} columnSpacing={3}>
            {Object.entries(values.examinations).map(
              ([diseaseType, { examinationDate }]) => (
                <Grid xxs={12} key={diseaseType}>
                  <YesOrNoWithFollowUp
                    name={`examinations.${diseaseType}.hadExamination`}
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
                    orientation="vertical"
                    positiveLabel={t("stiProtection/forms:common.yes")}
                    negativeLabel={t("stiProtection/forms:common.no")}
                    resetLabel={t("stiProtection/forms:common.reset")}
                    onReset={async () =>
                      await setFieldValue(
                        `examinations.${diseaseType}.examinationDate`,
                        initialValues.examinations[
                          diseaseType as ExaminableIllnesses
                        ].examinationDate,
                      )
                    }
                  >
                    <FormControl sx={{ gridColumn: 2 }}>
                      <FormLabel>
                        {t("examinations.had_examination.mostRecentExamDate")}
                      </FormLabel>
                      <MonthAndYearFields
                        fieldName={`examinations.${diseaseType}.examinationDate`}
                        date={examinationDate}
                        monthLabel={t("stiProtection/forms:common.month")}
                        yearLabel={t("stiProtection/forms:common.year")}
                      />
                    </FormControl>
                  </YesOrNoWithFollowUp>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
