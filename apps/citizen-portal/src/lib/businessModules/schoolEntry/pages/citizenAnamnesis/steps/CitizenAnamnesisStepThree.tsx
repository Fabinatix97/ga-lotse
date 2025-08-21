/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel, Grid, Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { useId } from "react";

import {
  InputArrayField,
  InputField,
  NumberField,
  getIndexLabel,
} from "@eshg/lib-portal";

import { QuarterWidthGrid } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/QuarterWidthGrid";
import { ToggleableSection } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/ToggleableSection";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

import { LocalBooleanRadioField } from "./components/LocalBooleanRadioField";

export function CitizenAnamnesisStepThree() {
  const id_birthWeight = useId();

  const { t } = useTranslation(["schoolEntry/anamnesis"]);

  const developmentInfo = createFieldNameMapper("developmentInfo");
  const illnessAndAccidentInfo = createFieldNameMapper(
    "illnessAndAccidentInfo",
  );
  const familyHistoryInfo = createFieldNameMapper("familyHistoryInfo");

  return (
    <ContentSheet>
      <ContentSheetTitle>{t("health.title")}</ContentSheetTitle>
      <Typography level="h3">{t("health.development")}</Typography>
      <LocalBooleanRadioField
        name={developmentInfo("developmentConspicuities")}
        label={
          <Typography level="title-md">
            {t("health.developmentConspicuities")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name={developmentInfo("gestationalAge")}
        label={
          <Typography level="title-md">{t("health.gestationalAge")}</Typography>
        }
        allowDeselection
      />
      <QuarterWidthGrid>
        <NumberField
          name={developmentInfo("birthWeight")}
          label={
            <FormLabel id={id_birthWeight}>
              <Typography level="body-sm">{t("health.birthWeight")}</Typography>
              <Typography sx={visuallyHidden}>in Gramm</Typography>
            </FormLabel>
          }
          endDecorator={<Typography aria-hidden>g</Typography>}
          aria-labelledby={`${id_birthWeight}`}
        />
      </QuarterWidthGrid>
      <LocalBooleanRadioField
        name={developmentInfo("infancyConspicuities")}
        label={
          <Typography level="title-md">
            {t("health.infancyConspicuities")}
          </Typography>
        }
        allowDeselection
      />
      <Typography level="h3">{t("health.dentalHealth")}</Typography>
      <QuarterWidthGrid>
        <NumberField
          name={developmentInfo("dailyTeethBrushing")}
          min={0}
          label={
            <FormLabel>
              <Typography level="title-md">
                {t("health.dailyTeethBrushing")}
              </Typography>
            </FormLabel>
          }
          endDecorator={<Typography>{t("health.daily")}</Typography>}
        />
      </QuarterWidthGrid>
      <LocalBooleanRadioField
        name={developmentInfo("teethBrushingAfterCare")}
        label={
          <Typography level="title-md">
            {t("health.teethBrushingAfterCare")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name={developmentInfo("electricToothBrush")}
        label={
          <Typography level="title-md">
            {t("health.electricToothBrush")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name={developmentInfo("fluorideToothPaste")}
        label={
          <Typography level="title-md">
            {t("health.fluorideToothPaste")}
          </Typography>
        }
        allowDeselection
      />
      <Typography level="h3">{t("health.illnesses")}</Typography>
      <LocalBooleanRadioField
        name={illnessAndAccidentInfo("severeIllnesses")}
        label={
          <Stack>
            <Typography level="title-md">
              {t("health.infectiousDiseases")}
            </Typography>
            <Typography level="body-md">
              {t("health.infectiousDiseasesExample")}
            </Typography>
          </Stack>
        }
        allowDeselection
      />
      <ToggleableSection
        name={illnessAndAccidentInfo("allergies.show")}
        title={t("health.allergies")}
      >
        <InputArrayField
          minCount={1}
          addMoreLabel={t("health.addAllergie")}
          name={illnessAndAccidentInfo("allergies.values")}
          label={(index) => (
            <Typography level="body-sm">
              {getIndexLabel(t("health.allergieDescription"), index)}
            </Typography>
          )}
        />
      </ToggleableSection>
      <LocalBooleanRadioField
        name={illnessAndAccidentInfo("hospitalizationsOrOperations")}
        label={
          <Typography level="title-md">
            {t("health.hospitalization")}
          </Typography>
        }
        allowDeselection
      />
      <Grid container sx={{ flexGrow: 1 }} spacing={2}>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
          <InputField
            name={illnessAndAccidentInfo("underMedicalTreatmentFor")}
            label={
              <Typography level="body-sm" component={FormLabel}>
                {t("health.medicalTreatment")}
              </Typography>
            }
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
          <InputField
            name={illnessAndAccidentInfo("regularMedication")}
            label={
              <Typography level="body-sm" component={FormLabel}>
                {t("health.medicationIntake")}
              </Typography>
            }
            placeholder={t("health.preparation")}
          />
        </Grid>
      </Grid>
      <Stack>
        <Typography level="h3">{t("health.familyHistory.title")}</Typography>
        <Typography level="body-md">
          {t("health.familyHistory.description")}
        </Typography>
      </Stack>
      <LocalBooleanRadioField
        name={familyHistoryInfo("spectaclesInFamily")}
        label={
          <Typography level="title-md">
            {t("health.familyHistory.glasses")}
          </Typography>
        }
        allowDeselection
      />

      <ToggleableSection
        name={familyHistoryInfo("chronicIllnessOrDisabilityInFamily.show")}
        title={t("health.familyHistory.chronicalIllnessTitle")}
      >
        <InputField
          name={familyHistoryInfo("chronicIllnessOrDisabilityInFamily.value")}
          label={
            <Typography level="body-sm">
              {t("health.familyHistory.chronicalIllnessDescription")}
            </Typography>
          }
          aria-label={t("health.familyHistory.chronicalIllness")}
          placeholder={t("health.familyHistory.enterChronicalIllness")}
        />
      </ToggleableSection>
    </ContentSheet>
  );
}
