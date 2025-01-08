/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { FormLabel, Grid, Typography } from "@mui/joy";

import { LocalBooleanRadioField } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/LocalBooleanRadioField";
import { ToggleableSection } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/ToggleableSection";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

export function CitizenAnamnesisStepFour() {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);

  const promotionTherapyAndAidInfo = createFieldNameMapper(
    "promotionTherapyAndAidInfo",
  );

  const promotionBeforeSchoolEntry = createFieldNameMapper(
    "promotionBeforeSchoolEntry",
  );

  return (
    <ContentSheet>
      <Typography level="h2">{t("support.title")}</Typography>
      <Typography level="h3">{t("support.description")}</Typography>
      <LocalBooleanRadioField
        name={promotionTherapyAndAidInfo("visionImpairment")}
        label={
          <Typography level="title-md">
            {t("support.visionImpairment")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name={promotionTherapyAndAidInfo("hearingImpairment")}
        label={
          <Typography level="title-md">
            {t("support.hearingImpairment")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name={promotionTherapyAndAidInfo("speechImpairment")}
        label={
          <Typography level="title-md">
            {t("support.speechImpairment")}
          </Typography>
        }
        allowDeselection
      />
      <Typography level="h3">{t("support.aid")}</Typography>
      <ToggleableSection
        name={promotionTherapyAndAidInfo("spectacles.show")}
        title={t("support.spectacles.title")}
      >
        <DateField
          label={
            <FormLabel>
              <Typography level="body-sm">
                {t("support.spectacles.info")}
              </Typography>
            </FormLabel>
          }
          aria-description={t("support.spectacles.since")}
          name={promotionTherapyAndAidInfo("spectacles.since")}
        />
      </ToggleableSection>
      <ToggleableSection
        name={promotionTherapyAndAidInfo("visionSchool.show")}
        title={t("support.visionSchool.title")}
      >
        <DateField
          label={
            <FormLabel>
              <Typography level="body-sm">
                {t("support.visionSchool.info")}
              </Typography>
            </FormLabel>
          }
          aria-description={t("support.visionSchool.since")}
          name={promotionTherapyAndAidInfo("visionSchool.since")}
        />
      </ToggleableSection>
      <ToggleableSection
        name={promotionTherapyAndAidInfo("hearingAid.show")}
        title={t("support.hearingAid.title")}
      >
        <InputField
          label={
            <FormLabel>
              <Typography level="body-sm">
                {t("support.hearingAid.info")}
              </Typography>
            </FormLabel>
          }
          aria-description={t("support.hearingAid.which")}
          name={promotionTherapyAndAidInfo("hearingAid.which")}
        />
      </ToggleableSection>
      <Typography level="h3">{t("support.therapy.title")}</Typography>
      <ToggleableSection
        name={promotionBeforeSchoolEntry("speechTherapy")}
        title={t("support.therapy.speechTherapy")}
      >
        <Typography level="body-sm">{t("support.therapy.date")}</Typography>
        <Grid container sx={{ flexGrow: 1 }} spacing={2}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              label={t("support.therapy.from")}
              name={promotionTherapyAndAidInfo("speechTherapy.start")}
              aria-description={`${t("support.therapy.speechTherapy")} ${t("support.therapy.start")}`}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              label={t("support.therapy.to")}
              name={promotionTherapyAndAidInfo("speechTherapy.end")}
              aria-description={`${t("support.therapy.speechTherapy")} ${t("support.therapy.end")}`}
            />
          </Grid>
        </Grid>
      </ToggleableSection>
      <ToggleableSection
        name={promotionBeforeSchoolEntry("ergotherapy")}
        title={t("support.therapy.ergoTherapy")}
      >
        <Typography level="body-sm">{t("support.therapy.date")}</Typography>
        <Grid container sx={{ flexGrow: 1 }} spacing={2}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              label={t("support.therapy.from")}
              name={promotionTherapyAndAidInfo("ergoTherapy.start")}
              aria-description={`${t("support.therapy.ergoTherapy")} ${t("support.therapy.start")}`}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              label={t("support.therapy.to")}
              name={promotionTherapyAndAidInfo("ergoTherapy.end")}
              aria-description={`${t("support.therapy.ergoTherapy")} ${t("support.therapy.end")}`}
            />
          </Grid>
        </Grid>
      </ToggleableSection>
      <ToggleableSection
        name={promotionBeforeSchoolEntry("physiotherapy")}
        title={t("support.therapy.physioTherapy")}
      >
        <Typography level="body-sm">{t("support.therapy.date")}</Typography>
        <Grid container sx={{ flexGrow: 1 }} spacing={2}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              label={t("support.therapy.from")}
              name={promotionTherapyAndAidInfo("physioTherapy.start")}
              aria-description={`${t("support.therapy.physioTherapy")} ${t("support.therapy.end")}`}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <DateField
              label={t("support.therapy.to")}
              name={promotionTherapyAndAidInfo("physioTherapy.end")}
              aria-description={`${t("support.therapy.physioTherapy")} ${t("support.therapy.end")}`}
            />
          </Grid>
        </Grid>
      </ToggleableSection>
      <ToggleableSection
        name={promotionTherapyAndAidInfo("additionalTherapies.show")}
        title={t("support.therapy.other")}
      >
        <InputField
          name={promotionTherapyAndAidInfo("additionalTherapies.which")}
          label={
            <Typography level="body-sm">{t("support.therapy.info")}</Typography>
          }
          placeholder={t("support.therapy.enter")}
          aria-description={t("support.therapy.which")}
        />
      </ToggleableSection>
    </ContentSheet>
  );
}
