/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { FormLabel, Grid, IconButton, Typography } from "@mui/joy";
import { FieldArray } from "formik";
import { Fragment, useId } from "react";

import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { YearField } from "@eshg/lib-portal/components/formFields/YearField";

import { CitizenAnamnesisFormValues } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/CitizenAnamnesisForm";
import { CitizenPortalMonthAndYearFields } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/CitizenPortalMonthAndYearFields";
import { LocalBooleanRadioField } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/LocalBooleanRadioField";
import { QuarterWidthGrid } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/QuarterWidthGrid";
import { ToggleableSection } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/components/ToggleableSection";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { createFieldNameMapper } from "@/lib/shared/helpers/form";

export function CitizenAnamnesisStepTwo({
  values,
}: {
  values: CitizenAnamnesisFormValues;
}) {
  const dayCareSinceId = useId();
  const clubSportAndOtherId = useId();

  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  const promotionBeforeSchoolEntry = createFieldNameMapper(
    "promotionBeforeSchoolEntry",
  );
  const additionalChildInfo = createFieldNameMapper("additionalChildInfo");
  const daycareAndSchoolInfo = createFieldNameMapper("daycareAndSchoolInfo");
  const interestsAndSportsInfo = createFieldNameMapper(
    "interestsAndSportsInfo",
  );

  return (
    <ContentSheet>
      <Typography level="h2">{t("additionalInfo.title")}</Typography>
      <InputField
        name={additionalChildInfo("responsiblePhysician")}
        label={
          <Typography level="body-sm" component={FormLabel}>
            {t("additionalInfo.pediatrician")}
          </Typography>
        }
      />
      <ToggleableSection
        title={t("additionalInfo.siblings")}
        name={additionalChildInfo("siblings.show")}
      >
        <FieldArray name={additionalChildInfo("siblings.birthYears")}>
          {({ push, remove }) => (
            <Grid
              container
              sx={{ flexGrow: 1 }}
              spacing={2}
              alignItems="flex-end"
            >
              {values.additionalChildInfo.siblings.birthYears.map(
                (_value, index, array) => {
                  const canRemove = array.length > 1;
                  return (
                    <Fragment key={index}>
                      <Grid
                        {...byBreakpoint({
                          mobile: canRemove ? 11 : 12,
                          desktop: 7,
                        })}
                      >
                        <YearField
                          min={1900}
                          max={new Date().getFullYear()}
                          name={additionalChildInfo(
                            `siblings.birthYears.${index}`,
                          )}
                          label={t("additionalInfo.siblingBirthYear", {
                            index: index + 1,
                          })}
                          fieldDecorator={
                            canRemove && (
                              <IconButton
                                color="danger"
                                aria-label={t("additionalInfo.removeSibling")}
                                onClick={() => {
                                  return remove(index);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )
                          }
                        />
                      </Grid>
                    </Fragment>
                  );
                },
              )}
              <Grid xxs={10}>
                <FormAddMoreButton onClick={() => push("")}>
                  {t("additionalInfo.addSibling")}
                </FormAddMoreButton>
              </Grid>
            </Grid>
          )}
        </FieldArray>
      </ToggleableSection>
      <Typography level="h3">{t("additionalInfo.dayCareAndSchool")}</Typography>
      <ToggleableSection
        name={daycareAndSchoolInfo("wasInDaycare.show")}
        title={t("additionalInfo.wasInDaycare")}
      >
        <Grid container sx={{ flexGrow: 1 }} spacing={2}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 12 })}>
            <Typography level="body-sm" id={dayCareSinceId}>
              {t("additionalInfo.dayCareSince")}
            </Typography>
            <CitizenPortalMonthAndYearFields
              fieldName={daycareAndSchoolInfo("inDaycareSince")}
              date={values.daycareAndSchoolInfo.inDaycareSince}
              aria-labelledby={dayCareSinceId}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <InputField
              name={daycareAndSchoolInfo("daycareName")}
              label={
                <Typography level="body-sm" component={FormLabel}>
                  {t("additionalInfo.dayCareName")}
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </ToggleableSection>
      <LocalBooleanRadioField
        label={
          <Typography level="title-md">
            {t("additionalInfo.integrationPlace")}
          </Typography>
        }
        name={promotionBeforeSchoolEntry("integrationPlace")}
        allowDeselection
      />
      <LocalBooleanRadioField
        label={
          <Typography level="title-md">
            {t("additionalInfo.earlySupport")}
          </Typography>
        }
        name={promotionBeforeSchoolEntry("earlySupport")}
        allowDeselection
      />
      <LocalBooleanRadioField
        label={
          <Typography level="title-md">
            {t("additionalInfo.languageScreening")}
          </Typography>
        }
        name="childLanguageScreening"
        allowDeselection
      />
      <LocalBooleanRadioField
        label={
          <Typography level="title-md">
            {t("additionalInfo.preliminaryCourse")}
          </Typography>
        }
        name="preliminaryCourse"
        allowDeselection
      />
      <QuarterWidthGrid>
        <InputField
          name={daycareAndSchoolInfo("schoolName")}
          label={t("additionalInfo.schoolName")}
        />
      </QuarterWidthGrid>
      <Typography level="h3">{t("additionalInfo.interests")}</Typography>
      <Typography level="title-md" id={clubSportAndOtherId}>
        {t("additionalInfo.clubSportAndOther")}
      </Typography>
      <Grid
        container
        sx={{ flexGrow: 1 }}
        spacing={2}
        role="group"
        aria-labelledby={clubSportAndOtherId}
      >
        <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
          <InputField
            name={interestsAndSportsInfo("clubSport")}
            label={t("additionalInfo.clubSport")}
          />
        </Grid>
        <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
          <InputField
            name={interestsAndSportsInfo("otherInterests")}
            label={t("additionalInfo.otherInterests")}
          />
        </Grid>
      </Grid>
      <LocalBooleanRadioField
        name={interestsAndSportsInfo("canSwim")}
        label={
          <Typography level="title-md">
            {t("additionalInfo.canSwim")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name={interestsAndSportsInfo("hasSeahorseBadge")}
        label={
          <Typography level="title-md">
            {t("additionalInfo.seahorseBadge")}
          </Typography>
        }
        allowDeselection
      />
      <LocalBooleanRadioField
        name="personalConspicuities"
        label={
          <>
            <Typography level="title-md">
              {t("additionalInfo.personalCharacteristics")}
            </Typography>
            <Typography level="body-md">
              {t("additionalInfo.personalCharacteristicsDescription")}
            </Typography>
          </>
        }
        allowDeselection
      />
    </ContentSheet>
  );
}
