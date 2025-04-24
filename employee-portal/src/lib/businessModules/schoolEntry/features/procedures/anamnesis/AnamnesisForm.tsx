/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormFooter, FormStack } from "@eshg/lib-employee-portal";
import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  MonthAndYear,
  MonthAndYearFields,
} from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { FormProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import {
  ApiBooleanWithUnknown,
  ApiSchoolEntryCountryCode,
  UpdateAnamnesisRequest,
} from "@eshg/school-entry-api";
import { Divider, FormLabel, Stack } from "@mui/joy";
import { Formik } from "formik";

import { CountryCodes } from "@/lib/businessModules/schoolEntry/api/models/CountryCodes";
import { BirthDataAndChildInformationForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/BirthDataAndChildInformationForm";
import { CheckUpsForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/CheckUpsForm";
import { FamilyHistoryInfoForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/FamilyHistoryInfoForm";
import { IllnessAndAccidentInfoForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/IllnessAndAccidentInfoForm";
import { InterestAndSportsInfoForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/InterestsAndSportInfoForm";
import { MigrationBackgroundForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/MigrationBackgroundForm";
import { PromotionBeforeSchoolEntryForm } from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/PromotionBeforeSchoolEntryForm";
import { FlexLabel } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FlexLabel";
import {
  BOLD_LABEL_STYLE,
  BOOLEAN_SELECT_STYLE,
} from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";

export interface AnamnesisFormValues {
  childLanguageScreening: OptionalFieldValue<boolean>;
  preliminaryCourse: OptionalFieldValue<boolean>;
  additionalChildInfo: AdditionalChildInfoValues;
  daycareAndSchoolInfo: DaycareAndSchoolInfoValues;
  developmentInfo: DevelopmentInfoValues;
  checkUps: CheckUpsValues;
  familyHistoryInfo: FamilyHistoryInfoValues;
  illnessAndAccidentInfo: IllnessAndAccidentInfoValues;
  promotionBeforeSchoolEntry: PromotionBeforeSchoolEntryValues;
  promotionTherapyAndAidInfo: PromotionTherapyAndAidInfoValues;
  interestsAndSportsInfo: InterestAndSportsInfoValues;
  migrationBackground: MigrationBackgroundValues;
  personalConspicuities: OptionalFieldValue<boolean>;
}

export interface InterestAndSportsInfoValues {
  canSwim: OptionalFieldValue<boolean>;
  hasSeahorseBadge: OptionalFieldValue<boolean>;
  clubSport: OptionalFieldValue<string>;
  otherInterests: OptionalFieldValue<string>;
}

export interface FamilyHistoryInfoValues {
  spectaclesInFamily: OptionalFieldValue<boolean>;
  chronicIllnessOrDisabilityInFamily: OptionalFieldValue<string>;
}

export interface IllnessAndAccidentInfoValues {
  severeIllnesses: OptionalFieldValue<boolean>;
  allergies: string[];
  hospitalizationsOrOperations: OptionalFieldValue<boolean>;
  underMedicalTreatmentFor: OptionalFieldValue<string>;
  regularMedication: OptionalFieldValue<string>;
}

export interface AdditionalChildInfoValues {
  responsiblePhysician: OptionalFieldValue<string>;
  numberOfSiblings: OptionalFieldValue<number>;
  siblingsBirthYears: number[];
}

export interface DaycareAndSchoolInfoValues {
  wasInDaycare: OptionalFieldValue<boolean>;
  inDaycareSince: MonthAndYear;
  daycareName: OptionalFieldValue<string>;
  schoolName: OptionalFieldValue<string>;
}

export interface DevelopmentInfoValues {
  gestationalAge: OptionalFieldValue<boolean>;
  birthWeight: OptionalFieldValue<number>;
  developmentConspicuities: OptionalFieldValue<boolean>;
  infancyConspicuities: OptionalFieldValue<boolean>;
}

export interface CheckUpsValues {
  u2: OptionalFieldValue<ApiBooleanWithUnknown>;
  u3: OptionalFieldValue<ApiBooleanWithUnknown>;
  u4: OptionalFieldValue<ApiBooleanWithUnknown>;
  u5: OptionalFieldValue<ApiBooleanWithUnknown>;
  u6: OptionalFieldValue<ApiBooleanWithUnknown>;
  u7: OptionalFieldValue<ApiBooleanWithUnknown>;
  u7a: OptionalFieldValue<ApiBooleanWithUnknown>;
  u8: OptionalFieldValue<ApiBooleanWithUnknown>;
  u9: OptionalFieldValue<ApiBooleanWithUnknown>;
}

export interface PromotionBeforeSchoolEntryValues {
  earlySupport: OptionalFieldValue<boolean>;
  integrationPlace: OptionalFieldValue<boolean>;
  ergotherapy: OptionalFieldValue<boolean>;
  speechTherapy: OptionalFieldValue<boolean>;
  physiotherapy: OptionalFieldValue<boolean>;
}

export interface PromotionTherapyAndAidInfoValues {
  visionImpairment: OptionalFieldValue<boolean>;
  hearingImpairment: OptionalFieldValue<boolean>;
  speechImpairment: OptionalFieldValue<boolean>;
  spectaclesSince: OptionalFieldValue<string>;
  visionSchoolSince: OptionalFieldValue<string>;
  hearingAid: OptionalFieldValue<string>;
  speechTherapyStart: OptionalFieldValue<string>;
  speechTherapyEnd: OptionalFieldValue<string>;
  ergoTherapyStart: OptionalFieldValue<string>;
  ergoTherapyEnd: OptionalFieldValue<string>;
  physioTherapyStart: OptionalFieldValue<string>;
  physioTherapyEnd: OptionalFieldValue<string>;
  additionalTherapies: OptionalFieldValue<string>;
}

export interface MigrationBackgroundValues {
  nationalityChild: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  countryOfBirthChild: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  nationalityFirstParent: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  countryOfBirthFirstParent: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  nationalitySecondParent: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  countryOfBirthSecondParent: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  hasMigrationBackground: OptionalFieldValue<boolean>;
  inGermanySince: MonthAndYear;
}

export const TEXT_INPUT_STYLE = {
  ".MuiInput-root": { width: "270px" },
};

interface AnamnesisFormProps extends FormProps<AnamnesisFormValues> {
  dateOfBirth: Date;
  countryCodes: CountryCodes;
  valuesToMutationBundle: (
    values: AnamnesisFormValues,
  ) => MutationBundle<UpdateAnamnesisRequest>;
}

export function AnamnesisForm(props: AnamnesisFormProps) {
  const daycareAndSchoolInfo = createFieldNameMapper("daycareAndSchoolInfo");

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => {
        return (
          <FormStack onSubmit={handleSubmit}>
            <ConfirmLeaveDirtyFormEffect
              onSaveMutation={props.valuesToMutationBundle(values)}
            />
            <Divider />
            <Stack direction="row" gap={4} flexWrap="wrap">
              <BooleanSelectField
                component={HorizontalField}
                name={daycareAndSchoolInfo("wasInDaycare")}
                label={<FormLabel>war im Kindergarten</FormLabel>}
                allowDeselection
                sx={{ ...BOOLEAN_SELECT_STYLE }}
              />
              {values.daycareAndSchoolInfo.wasInDaycare.valueOf() === true && (
                <>
                  <FormLabel>seit</FormLabel>
                  <MonthAndYearFields
                    testId="inDaycareSince"
                    fieldName={daycareAndSchoolInfo("inDaycareSince")}
                    date={values.daycareAndSchoolInfo.inDaycareSince}
                  />
                  <InputField
                    name={daycareAndSchoolInfo("daycareName")}
                    label={<FlexLabel>Name Kindertagesstätte</FlexLabel>}
                    type="text"
                    component={HorizontalField}
                    sx={TEXT_INPUT_STYLE}
                  />
                </>
              )}
              <SoftRequiredBooleanSelectField
                name="childLanguageScreening"
                label={"Kiss"}
                sx={{ ...BOOLEAN_SELECT_STYLE, ...BOLD_LABEL_STYLE }}
                softRequired
                allowDeselection
              />
              <SoftRequiredBooleanSelectField
                name="preliminaryCourse"
                label={"Vorlaufkurs"}
                sx={{ ...BOOLEAN_SELECT_STYLE, ...BOLD_LABEL_STYLE }}
                softRequired
                allowDeselection
              />
              <InputField
                name={daycareAndSchoolInfo("schoolName")}
                label={<FlexLabel>Zuständige Schule </FlexLabel>}
                type="text"
                component={HorizontalField}
                sx={TEXT_INPUT_STYLE}
              />
            </Stack>
            <Divider />
            <BirthDataAndChildInformationForm
              values={values}
              setFieldValue={setFieldValue}
            />
            <Divider />
            <CheckUpsForm
              name="checkUps"
              setFieldValue={setFieldValue}
              values={values.checkUps}
            />
            <Divider />
            <FamilyHistoryInfoForm />
            <Divider />
            <IllnessAndAccidentInfoForm />
            <Divider />
            <PromotionBeforeSchoolEntryForm
              values={values}
              setFieldValue={setFieldValue}
            />
            <Divider />
            <InterestAndSportsInfoForm />
            <Divider />
            <MigrationBackgroundForm
              name="migrationBackground"
              values={values.migrationBackground}
              setFieldValue={setFieldValue}
              dateOfBirth={props.dateOfBirth}
              countryCodes={props.countryCodes}
            />
            <FormFooter isSubmitting={isSubmitting} />
          </FormStack>
        );
      }}
    </Formik>
  );
}
