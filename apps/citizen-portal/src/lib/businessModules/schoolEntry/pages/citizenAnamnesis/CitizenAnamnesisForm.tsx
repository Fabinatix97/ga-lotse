/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { Formik } from "formik";
import { useId } from "react";

import {
  FormPlus,
  MonthAndYear,
  MultiStepForm,
  OptionalFieldValue,
  StepFactory,
  dropBlankStrings,
  mapMonthAndYear,
  mapNullableValue,
  mapOptionalDate,
  mapOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiAddCitizenAnamnesisRequest,
  ApiMediaConsumption,
  ApiSchoolEntryCountryCode,
} from "@eshg/school-entry-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { SchoolEntryChild } from "@/lib/businessModules/schoolEntry/api/models/SchoolEntryChild";
import { useAddCitizenAnamnesis } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryCitizenApi";
import { CitizenAnamnesisSidePanel } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/CitizenAnamnesisSidePanel";
import { CitizenAnamnesisStepFour } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/CitizenAnamnesisStepFour";
import { CitizenAnamnesisStepThree } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/CitizenAnamnesisStepThree";
import { CitizenAnamnesisStepTwo } from "@/lib/businessModules/schoolEntry/pages/citizenAnamnesis/steps/CitizenAnamnesisStepTwo";
import { useCitizenRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

import { CitizenAnamnesisStepOne } from "./steps/CitizenAnamnesisStepOne";

export interface CitizenAnamnesisFormValues {
  childLanguageScreening: OptionalFieldValue<boolean>;
  languageScreeningConsent: OptionalFieldValue<boolean>;
  preliminaryCourse: OptionalFieldValue<boolean>;
  promotionBeforeSchoolEntry: PromotionBeforeSchoolEntryValues;
  migrationBackground: MigrationBackgroundValues;
  additionalChildInfo: AdditionalChildInfoValues;
  daycareAndSchoolInfo: DaycareAndSchoolInfoValues;
  interestsAndSportsInfo: InterestAndSportsInfoValues;
  personalConspicuities: boolean | null;
  developmentInfo: DevelopmentInfoValues;
  illnessAndAccidentInfo: IllnessAndAccidentInfoValues;
  familyHistoryInfo: FamilyHistoryInfoValues;
  promotionTherapyAndAidInfo: PromotionTherapyAndAidInfoValues;
}

interface MigrationBackgroundValues {
  child: {
    nationality: OptionalFieldValue<ApiSchoolEntryCountryCode>;
    countryOfBirth: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  };
  firstParent: {
    nationality: OptionalFieldValue<ApiSchoolEntryCountryCode>;
    countryOfBirth: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  };
  secondParent: ToggleableSectionFormValue & {
    nationality: OptionalFieldValue<ApiSchoolEntryCountryCode>;
    countryOfBirth: OptionalFieldValue<ApiSchoolEntryCountryCode>;
  };
}

interface PromotionBeforeSchoolEntryValues {
  earlySupport: boolean | null;
  integrationPlace: boolean | null;
  ergotherapy: boolean | null;
  speechTherapy: boolean | null;
  physiotherapy: boolean | null;
}

interface AdditionalChildInfoValues {
  responsiblePhysician: OptionalFieldValue<string>;
  siblings: ToggleableSectionFormValue & {
    birthYears: number[];
  };
}

interface DaycareAndSchoolInfoValues {
  wasInDaycare: ToggleableSectionFormValue;
  inDaycareSince: MonthAndYear;
  daycareName: OptionalFieldValue<string>;
  schoolName: OptionalFieldValue<string>;
}

interface InterestAndSportsInfoValues {
  canSwim: boolean | null;
  hasSeahorseBadge: boolean | null;
  clubSport: OptionalFieldValue<string>;
  otherInterests: OptionalFieldValue<string>;
  mediaConsumption: ApiMediaConsumption | null;
}

interface DevelopmentInfoValues {
  developmentConspicuities: boolean | null;
  infancyConspicuities: boolean | null;
  gestationalAge: boolean | null;
  birthWeight: OptionalFieldValue<number>;
  dailyTeethBrushing: OptionalFieldValue<number>;
  teethBrushingAfterCare: boolean | null;
  electricToothBrush: boolean | null;
  fluorideToothPaste: boolean | null;
}

interface IllnessAndAccidentInfoValues {
  severeIllnesses: boolean | null;
  allergies: ToggleableSectionFormValue & { values: string[] };
  hospitalizationsOrOperations: boolean | null;
  underMedicalTreatmentFor: OptionalFieldValue<string>;
  regularMedication: OptionalFieldValue<string>;
}

interface FamilyHistoryInfoValues {
  spectaclesInFamily: boolean | null;
  chronicIllnessOrDisabilityInFamily: ToggleableSectionFormValue & {
    value: OptionalFieldValue<string>;
  };
}

interface PromotionTherapyAndAidInfoValues {
  visionImpairment: boolean | null;
  hearingImpairment: boolean | null;
  speechImpairment: boolean | null;
  spectacles: ToggleableSectionFormValue & {
    since: OptionalFieldValue<string>;
  };
  visionSchool: ToggleableSectionFormValue & {
    since: OptionalFieldValue<string>;
  };
  hearingAid: ToggleableSectionFormValue & {
    which: OptionalFieldValue<string>;
  };
  speechTherapy: {
    start: OptionalFieldValue<string>;
    end: OptionalFieldValue<string>;
  };
  ergoTherapy: {
    start: OptionalFieldValue<string>;
    end: OptionalFieldValue<string>;
  };
  physioTherapy: {
    start: OptionalFieldValue<string>;
    end: OptionalFieldValue<string>;
  };
  additionalTherapies: ToggleableSectionFormValue & {
    which: OptionalFieldValue<string>;
  };
}

interface ToggleableSectionFormValue {
  show: boolean | null;
}

const INITIAL_VALUES: CitizenAnamnesisFormValues = {
  childLanguageScreening: "",
  languageScreeningConsent: "",
  preliminaryCourse: "",
  migrationBackground: {
    child: {
      countryOfBirth: "",
      nationality: "",
    },
    firstParent: {
      countryOfBirth: "",
      nationality: "",
    },
    secondParent: {
      show: null,
      countryOfBirth: "",
      nationality: "",
    },
  },
  promotionBeforeSchoolEntry: {
    earlySupport: null,
    integrationPlace: null,
    ergotherapy: null,
    speechTherapy: null,
    physiotherapy: null,
  },
  additionalChildInfo: {
    responsiblePhysician: "",
    siblings: {
      show: null,
      birthYears: [],
    },
  },
  daycareAndSchoolInfo: {
    wasInDaycare: {
      show: null,
    },
    inDaycareSince: { month: null, year: "" },
    daycareName: "",
    schoolName: "",
  },
  interestsAndSportsInfo: {
    canSwim: null,
    hasSeahorseBadge: null,
    clubSport: "",
    otherInterests: "",
    mediaConsumption: null,
  },
  personalConspicuities: null,
  developmentInfo: {
    developmentConspicuities: null,
    infancyConspicuities: null,
    gestationalAge: null,
    birthWeight: "",
    dailyTeethBrushing: "",
    teethBrushingAfterCare: null,
    electricToothBrush: null,
    fluorideToothPaste: null,
  },
  illnessAndAccidentInfo: {
    allergies: {
      show: null,
      values: [""],
    },
    severeIllnesses: null,
    hospitalizationsOrOperations: null,
    regularMedication: "",
    underMedicalTreatmentFor: "",
  },
  familyHistoryInfo: {
    spectaclesInFamily: null,
    chronicIllnessOrDisabilityInFamily: {
      show: null,
      value: "",
    },
  },
  promotionTherapyAndAidInfo: {
    visionImpairment: null,
    hearingImpairment: null,
    speechImpairment: null,
    spectacles: {
      since: "",
      show: null,
    },
    visionSchool: {
      since: "",
      show: null,
    },
    hearingAid: {
      which: "",
      show: null,
    },
    speechTherapy: {
      start: "",
      end: "",
    },
    ergoTherapy: {
      start: "",
      end: "",
    },
    physioTherapy: {
      start: "",
      end: "",
    },
    additionalTherapies: {
      which: "",
      show: null,
    },
  },
};

const STEPS: StepFactory<CitizenAnamnesisFormValues>[] = [
  ({ values }) => <CitizenAnamnesisStepOne values={values} />,
  CitizenAnamnesisStepTwo,
  CitizenAnamnesisStepThree,
  CitizenAnamnesisStepFour,
];

interface CitizenAnamnesisFormProps {
  child: SchoolEntryChild;
}

export function CitizenAnamnesisForm(props: CitizenAnamnesisFormProps) {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  const addCitizenAnamnesis = useAddCitizenAnamnesis();
  const router = useScopedRouter();
  const citizenRoutes = useCitizenRoutes();

  async function handleSubmit(values: CitizenAnamnesisFormValues) {
    await addCitizenAnamnesis.mutateAsync(mapToRequest(values), {
      onSuccess: () => {
        void router.push(citizenRoutes.appointment.index(undefined));
      },
    });
  }

  const titleId = useId();
  const stepperTitleId = useId();
  return (
    <MultiStepForm<CitizenAnamnesisFormValues> steps={STEPS}>
      {({ Outlet, currentStep, totalSteps, titleRef }) => (
        <>
          <PageTitle
            titleRef={titleRef}
            titleId={titleId}
            toolbar={
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                titleId={stepperTitleId}
              />
            }
          >
            {t("title")}
          </PageTitle>
          <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
            {(formikProps) => (
              <FormPlus
                aria-labelledby={titleId}
                aria-describedby={stepperTitleId}
              >
                <TwoColumnGrid
                  content={<Outlet {...formikProps} />}
                  sidePanel={<CitizenAnamnesisSidePanel child={props.child} />}
                />
              </FormPlus>
            )}
          </Formik>
        </>
      )}
    </MultiStepForm>
  );
}

function StepIndicator({
  currentStep,
  totalSteps,
  titleId,
}: {
  currentStep: number;
  totalSteps: number;
  titleId?: string;
}) {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  return (
    <Typography
      component="span"
      data-testid="multiStepFormIndicator"
      level="h4"
      id={titleId}
      sx={{
        color: theme.palette.text.tertiary,
      }}
    >
      {t("step")} <span data-testid="currentFormStep">{currentStep}</span>{" "}
      {t("stepsRemaining")} {totalSteps}
    </Typography>
  );
}

function mapToRequest(
  values: CitizenAnamnesisFormValues,
): ApiAddCitizenAnamnesisRequest {
  return {
    anamnesis: {
      childLanguageScreening: mapOptionalValue(values.childLanguageScreening),
      languageScreeningConsent: mapOptionalValue(
        values.languageScreeningConsent,
      ),
      preliminaryCourse: mapOptionalValue(values.preliminaryCourse),
      migrationBackground: {
        countryOfBirthChild: mapOptionalValue(
          values.migrationBackground.child.countryOfBirth,
        ),
        nationalityChild: mapOptionalValue(
          values.migrationBackground.child.nationality,
        ),
        countryOfBirthFirstParent: mapOptionalValue(
          values.migrationBackground.firstParent.countryOfBirth,
        ),
        nationalityFirstParent: mapOptionalValue(
          values.migrationBackground.firstParent.nationality,
        ),
        countryOfBirthSecondParent: fallbackIfExplicitlyHidden(
          values.migrationBackground.secondParent,
          mapOptionalValue(
            values.migrationBackground.secondParent.countryOfBirth,
          ),
          ApiSchoolEntryCountryCode.Uuu,
        ),
        nationalitySecondParent: fallbackIfExplicitlyHidden(
          values.migrationBackground.secondParent,
          mapOptionalValue(values.migrationBackground.secondParent.nationality),
          ApiSchoolEntryCountryCode.Uuu,
        ),
      },
      promotionBeforeSchoolEntry: {
        earlySupport: mapNullableValue(
          values.promotionBeforeSchoolEntry.earlySupport,
        ),
        ergotherapy: mapNullableValue(
          values.promotionBeforeSchoolEntry.ergotherapy,
        ),
        integrationPlace: mapNullableValue(
          values.promotionBeforeSchoolEntry.integrationPlace,
        ),
        physiotherapy: mapNullableValue(
          values.promotionBeforeSchoolEntry.physiotherapy,
        ),
        speechTherapy: mapNullableValue(
          values.promotionBeforeSchoolEntry.speechTherapy,
        ),
      },
      additionalChildInfo: {
        responsiblePhysician: mapOptionalValue(
          values.additionalChildInfo.responsiblePhysician,
        ),
        siblingsBirthYears: values.additionalChildInfo.siblings.show
          ? values.additionalChildInfo.siblings.birthYears
          : undefined,
      },
      daycareAndSchoolInfo: {
        wasInDaycare: mapNullableValue(
          values.daycareAndSchoolInfo.wasInDaycare.show,
        ),
        inDaycareSince: onlyIfShown(
          values.daycareAndSchoolInfo.wasInDaycare,
          mapMonthAndYear(values.daycareAndSchoolInfo.inDaycareSince),
        ),
        daycareName: onlyIfShown(
          values.daycareAndSchoolInfo.wasInDaycare,
          mapOptionalValue(values.daycareAndSchoolInfo.daycareName),
        ),
        schoolName: mapOptionalValue(values.daycareAndSchoolInfo.schoolName),
      },
      developmentInfo: {
        developmentConspicuities: mapNullableValue(
          values.developmentInfo.developmentConspicuities,
        ),
        infancyConspicuities: mapNullableValue(
          values.developmentInfo.infancyConspicuities,
        ),
        gestationalAge: mapNullableValue(values.developmentInfo.gestationalAge),
        birthWeight: mapOptionalValue(values.developmentInfo.birthWeight),
        dailyTeethBrushing: mapOptionalValue(
          values.developmentInfo.dailyTeethBrushing,
        ),
        teethBrushingAfterCare: mapNullableValue(
          values.developmentInfo.teethBrushingAfterCare,
        ),
        electricToothBrush: mapNullableValue(
          values.developmentInfo.electricToothBrush,
        ),
        fluorideToothPaste: mapNullableValue(
          values.developmentInfo.fluorideToothPaste,
        ),
      },
      familyHistoryInfo: {
        spectaclesInFamily: mapNullableValue(
          values.familyHistoryInfo.spectaclesInFamily,
        ),
        chronicIllnessOrDisabilityInFamily: onlyIfShown(
          values.familyHistoryInfo.chronicIllnessOrDisabilityInFamily,
          mapOptionalValue(
            values.familyHistoryInfo.chronicIllnessOrDisabilityInFamily.value,
          ),
        ),
      },
      illnessAndAccidentInfo: {
        allergies: values.illnessAndAccidentInfo.allergies.show
          ? dropBlankStrings(values.illnessAndAccidentInfo.allergies.values)
          : [],
        severeIllnesses: mapNullableValue(
          values.illnessAndAccidentInfo.severeIllnesses,
        ),
        hospitalizationsOrOperations: mapNullableValue(
          values.illnessAndAccidentInfo.hospitalizationsOrOperations,
        ),
        underMedicalTreatmentFor: mapOptionalValue(
          values.illnessAndAccidentInfo.underMedicalTreatmentFor,
        ),
        regularMedication: mapOptionalValue(
          values.illnessAndAccidentInfo.regularMedication,
        ),
      },
      interestsAndSportsInfo: {
        canSwim: mapNullableValue(values.interestsAndSportsInfo.canSwim),
        hasSeahorseBadge: mapNullableValue(
          values.interestsAndSportsInfo.hasSeahorseBadge,
        ),
        clubSport: mapOptionalValue(values.interestsAndSportsInfo.clubSport),
        otherInterests: mapOptionalValue(
          values.interestsAndSportsInfo.otherInterests,
        ),
        mediaConsumption: mapNullableValue(
          values.interestsAndSportsInfo.mediaConsumption,
        ),
      },
      promotionTherapyAndAidInfo: {
        visionImpairment: mapNullableValue(
          values.promotionTherapyAndAidInfo.visionImpairment,
        ),
        hearingImpairment: mapNullableValue(
          values.promotionTherapyAndAidInfo.hearingImpairment,
        ),
        speechImpairment: mapNullableValue(
          values.promotionTherapyAndAidInfo.speechImpairment,
        ),
        spectaclesSince: onlyIfShown(
          values.promotionTherapyAndAidInfo.spectacles,
          mapOptionalDate(values.promotionTherapyAndAidInfo.spectacles.since),
        ),
        visionSchoolSince: onlyIfShown(
          values.promotionTherapyAndAidInfo.visionSchool,
          mapOptionalDate(values.promotionTherapyAndAidInfo.visionSchool.since),
        ),
        hearingAid: onlyIfShown(
          values.promotionTherapyAndAidInfo.hearingAid,
          mapOptionalValue(values.promotionTherapyAndAidInfo.hearingAid.which),
        ),
        speechTherapyStart: onlyIfShown(
          { show: values.promotionBeforeSchoolEntry.speechTherapy },
          mapOptionalDate(
            values.promotionTherapyAndAidInfo.speechTherapy.start,
          ),
        ),
        speechTherapyEnd: onlyIfShown(
          { show: values.promotionBeforeSchoolEntry.speechTherapy },
          mapOptionalDate(values.promotionTherapyAndAidInfo.speechTherapy.end),
        ),
        ergoTherapyStart: onlyIfShown(
          { show: values.promotionBeforeSchoolEntry.ergotherapy },
          mapOptionalDate(values.promotionTherapyAndAidInfo.ergoTherapy.start),
        ),
        ergoTherapyEnd: onlyIfShown(
          { show: values.promotionBeforeSchoolEntry.ergotherapy },
          mapOptionalDate(values.promotionTherapyAndAidInfo.ergoTherapy.end),
        ),
        physioTherapyStart: onlyIfShown(
          { show: values.promotionBeforeSchoolEntry.physiotherapy },
          mapOptionalDate(
            values.promotionTherapyAndAidInfo.physioTherapy.start,
          ),
        ),
        physioTherapyEnd: onlyIfShown(
          { show: values.promotionBeforeSchoolEntry.physiotherapy },
          mapOptionalDate(values.promotionTherapyAndAidInfo.physioTherapy.end),
        ),
        additionalTherapies: onlyIfShown(
          values.promotionTherapyAndAidInfo.additionalTherapies,
          mapOptionalValue(
            values.promotionTherapyAndAidInfo.additionalTherapies.which,
          ),
        ),
      },
      personalConspicuities: mapNullableValue(values.personalConspicuities),
    },
  };
}

function onlyIfShown<TValue>(
  section: ToggleableSectionFormValue,
  value: TValue,
): TValue | undefined {
  return section.show ? value : undefined;
}

function fallbackIfExplicitlyHidden<TValue>(
  section: ToggleableSectionFormValue,
  value: TValue,
  fallback: TValue,
): TValue {
  return section.show === false ? fallback : value;
}
