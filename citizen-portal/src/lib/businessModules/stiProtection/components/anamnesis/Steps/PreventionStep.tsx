/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";

import { multiLineEllipsis } from "@/lib/baseModule/theme/mixins";
import { FormDataWithoutConcern } from "@/lib/businessModules/stiProtection/components/anamnesis/AnamnesisStepper.config";
import { CheckboxGroupField } from "@/lib/businessModules/stiProtection/components/shared/formFields/CheckboxGroupField";
import { RadioButtonsField } from "@/lib/businessModules/stiProtection/components/shared/formFields/RadioButtonsField";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/components/shared/formFields/YesOrNoWithFollowUp";
import { InfoModal } from "@/lib/businessModules/travelMedicine/components/shared/components/InfoModal";
import { useTranslation } from "@/lib/i18n/client";
import { TextareaField } from "@/lib/shared/components/form/TextareaField";

import { PrivacyNotice } from "./PrivacyNotice";
import {
  StandardRiskQuestion,
  useSafeSexRegularityOptions,
  useStandardRiskFactorNames,
  useStiProtectiveMeasuresOptions,
  useVaccineOptions,
} from "./options";

export function PreventionStep() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);
  const { setFieldValue, initialValues, values } =
    useFormikContext<FormDataWithoutConcern>();
  const [isOpenInfoModal, setIsOpenInfoModal] = useState(false);

  const safeSexRegularityOptions = useSafeSexRegularityOptions();
  const standardRiskFactorNames = useStandardRiskFactorNames();
  const stiProtectiveMeasuresOptions = useStiProtectiveMeasuresOptions();
  const vaccineOptions = useVaccineOptions();

  type StandardRiskFactor = keyof typeof standardRiskFactorNames;

  return (
    <>
      <PrivacyNotice />
      <Typography level="h2">{t("prevention.title")}</Typography>
      <Box component="section" aria-label={t("prevention.title")}>
        <Grid container rowSpacing={2} columnSpacing={3}>
          <Grid xxs={12}>
            <CheckboxGroupField
              sx={{ gridColumnStart: "span 2" }}
              name="prevention.vaccinations"
              label={t("prevention.vaccinations")}
              labelLevel="title-sm"
              options={vaccineOptions}
            />
          </Grid>
          <Grid xxs={12}>
            <RadioButtonsField
              sx={{ gridColumnStart: "span 2" }}
              name="prevention.safeSexRegularity"
              label={
                <Typography level="title-sm">
                  {t("prevention.safe_sex")}
                </Typography>
              }
              options={safeSexRegularityOptions}
              resettable
            />
          </Grid>
          <Grid xxs={12}>
            <CheckboxGroupField
              sx={{ gridColumnStart: "span 2" }}
              name="prevention.stiProtectiveMeasures"
              label={t("prevention.safe_sex_protective_measures")}
              labelLevel="title-sm"
              options={stiProtectiveMeasuresOptions}
              orientation="vertical"
            />
          </Grid>
          <Grid xxs={12}>
            <YesOrNoWithFollowUp
              name="prevention.infoAboutPrepDesired"
              orientation="vertical"
              label={
                <Stack direction="row" alignItems="center">
                  <Typography
                    level="title-sm"
                    sx={{ textWrap: "balance", ...multiLineEllipsis() }}
                  >
                    {t("prevention.info_about_PrEP_desired")}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => setIsOpenInfoModal(true)}
                  >
                    <InfoOutlined />
                  </IconButton>
                </Stack>
              }
              positiveLabel={t("stiProtection/forms:common.yes")}
              negativeLabel={t("stiProtection/forms:common.no")}
              resetLabel={t("stiProtection/forms:common.reset")}
            />
          </Grid>
        </Grid>
      </Box>
      <Typography level="h2">{t("risks.title")}</Typography>
      <Box component="section" aria-label={t("risks.title")}>
        <Grid container rowSpacing={3} columnSpacing={3}>
          {Object.entries(values.standardRiskFactors).map(
            ([riskName, { lastIncident }]: [string, StandardRiskQuestion]) => (
              <Grid xxs={12} key={riskName}>
                <YesOrNoWithFollowUp
                  key={riskName}
                  name={`standardRiskFactors.${riskName}.taken`}
                  label={
                    <Typography level="title-sm">
                      {standardRiskFactorNames[riskName as StandardRiskFactor]}
                    </Typography>
                  }
                  ariaLabel={
                    standardRiskFactorNames[riskName as StandardRiskFactor]
                  }
                  orientation="vertical"
                  sx={{ gridColumn: 1 }}
                  positiveLabel={t("stiProtection/forms:common.yes")}
                  negativeLabel={t("stiProtection/forms:common.no")}
                  resetLabel={t("stiProtection/forms:common.reset")}
                  onReset={async () =>
                    await setFieldValue(
                      `standardRiskFactors.${riskName}.lastIncident`,
                      initialValues.standardRiskFactors[
                        riskName as StandardRiskFactor
                      ].lastIncident,
                    )
                  }
                >
                  <FormControl>
                    <FormLabel>
                      {t("standard_risk_factor.most_recent_incident")}
                    </FormLabel>
                    <MonthAndYearFields
                      fieldName={`standardRiskFactors.${riskName}.lastIncident`}
                      date={lastIncident}
                      monthLabel={t("stiProtection/forms:common.month")}
                      yearLabel={t("stiProtection/forms:common.year")}
                    />
                  </FormControl>
                </YesOrNoWithFollowUp>
              </Grid>
            ),
          )}
          <Grid xxs={12}>
            <YesOrNoWithFollowUp
              name={`otherRisks.taken`}
              label={
                <Typography level="title-sm">
                  {t("prevention.other_risks")}
                </Typography>
              }
              ariaLabel={t("prevention.other_risks")}
              orientation="vertical"
              sx={{ gridColumn: 1 }}
              positiveLabel={t("stiProtection/forms:common.yes")}
              negativeLabel={t("stiProtection/forms:common.no")}
              resetLabel={t("stiProtection/forms:common.reset")}
            >
              <InputField
                name="otherRisks.description"
                label={t("prevention.other_risks_description")}
              />
            </YesOrNoWithFollowUp>
          </Grid>
        </Grid>
      </Box>
      <Typography level="h2">{t("remarks.title")}</Typography>
      <TextareaField
        name="remarks"
        label={t("remarks.input")}
        aria-label={t("remarks.input")}
      />
      <InfoModal
        modalTitle={t("prevention.PrEP_info_modal.title")}
        onClose={() => setIsOpenInfoModal((isOpen) => !isOpen)}
        open={isOpenInfoModal}
        sx={{
          minWidth: {
            xxs: "90vw",
            sm: 600,
          },
          maxWidth: {
            xxs: "90vw",
            sm: 600,
          },
        }}
      >
        {t("prevention.PrEP_info_modal.info")}
      </InfoModal>
    </>
  );
}
