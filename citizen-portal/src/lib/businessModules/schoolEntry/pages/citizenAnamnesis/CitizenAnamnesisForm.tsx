/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddCitizenAnamnesisRequest,
  ApiSchoolEntryCountryCode,
} from "@eshg/citizen-portal-api/schoolEntry";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import {
  MultiStepForm,
  StepFactory,
} from "@eshg/lib-portal/components/form/MultiStepForm";
import {
  MonthAndYear,
  mapMonthAndYear,
} from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import {
  dropBlankStrings,
  mapNullableValue,
  mapOptionalDate,
  mapOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

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

import { CitizenAnamnesisStepOne } from "./steps/CitizenAnamnesisStepOne";

export interface CitizenAnamnesisFormValues {
  childLanguageScreening: OptionalFieldValue<boolean>;
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
    inGermanySince: MonthAndYear;
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
  ergotherapy: OptionalFieldValue<boolean>;
  speechTherapy: OptionalFieldValue<boolean>;
  physiotherapy: OptionalFieldValue<boolean>;
}

interface AdditionalChildInfoValues {
  responsiblePhysician: OptionalFieldValue<string>;
  siblings: ToggleableSectionFormValue & {
    birthYears: string[];
  };
}

interface DaycareAndSchoolInfoValues {
  inDaycareSince: MonthAndYear;
  daycareName: OptionalFieldValue<string>;
  schoolName: OptionalFieldValue<string>;
}

interface InterestAndSportsInfoValues {
  canSwim: boolean | null;
  hasSeahorseBadge: boolean | null;
}

interface DevelopmentInfoValues {
  developmentConspicuities: boolean | null;
  infancyConspicuities: boolean | null;
  gestationalAge: boolean | null;
  birthWeight: OptionalFieldValue<number>;
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
  speechTherapy: ToggleableSectionFormValue & {
    start: OptionalFieldValue<string>;
    end: OptionalFieldValue<string>;
  };
  ergoTherapy: ToggleableSectionFormValue & {
    start: OptionalFieldValue<string>;
    end: OptionalFieldValue<string>;
  };
  physioTherapy: ToggleableSectionFormValue & {
    start: OptionalFieldValue<string>;
    end: OptionalFieldValue<string>;
  };
  additionalTherapies: ToggleableSectionFormValue & {
    which: OptionalFieldValue<string>;
  };
}

interface ToggleableSectionFormValue {
  show: boolean;
}

const INITIAL_VALUES: CitizenAnamnesisFormValues = {
  childLanguageScreening: "",
  preliminaryCourse: "",
  migrationBackground: {
    child: {
      countryOfBirth: "",
      nationality: "",
      inGermanySince: { month: null, year: "" },
    },
    firstParent: {
      countryOfBirth: "",
      nationality: "",
    },
    secondParent: {
      show: false,
      countryOfBirth: "",
      nationality: "",
    },
  },
  promotionBeforeSchoolEntry: {
    earlySupport: null,
    integrationPlace: null,
    ergotherapy: "",
    speechTherapy: "",
    physiotherapy: "",
  },
  additionalChildInfo: {
    responsiblePhysician: "",
    siblings: {
      show: false,
      birthYears: [""],
    },
  },
  daycareAndSchoolInfo: {
    inDaycareSince: { month: null, year: "" },
    daycareName: "",
    schoolName: "",
  },
  interestsAndSportsInfo: {
    canSwim: null,
    hasSeahorseBadge: null,
  },
  personalConspicuities: null,
  developmentInfo: {
    developmentConspicuities: null,
    infancyConspicuities: null,
    gestationalAge: null,
    birthWeight: "",
  },
  illnessAndAccidentInfo: {
    allergies: {
      show: false,
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
      show: false,
      value: "",
    },
  },
  promotionTherapyAndAidInfo: {
    visionImpairment: null,
    hearingImpairment: null,
    speechImpairment: null,
    spectacles: {
      since: "",
      show: false,
    },
    visionSchool: {
      since: "",
      show: false,
    },
    hearingAid: {
      which: "",
      show: false,
    },
    speechTherapy: {
      start: "",
      end: "",
      show: false,
    },
    ergoTherapy: {
      start: "",
      end: "",
      show: false,
    },
    physioTherapy: {
      start: "",
      end: "",
      show: false,
    },
    additionalTherapies: {
      which: "",
      show: false,
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
  const router = useRouter();
  const citizenRoutes = useCitizenRoutes();

  async function handleSubmit(values: CitizenAnamnesisFormValues) {
    await addCitizenAnamnesis
      .mutateAsync(mapToRequest(values), {
        onSuccess: () => {
          void router.push(citizenRoutes.appointment.index(undefined));
        },
      })
      .catch();
  }
  return (
    <MultiStepForm<CitizenAnamnesisFormValues> steps={STEPS}>
      {({ Outlet, currentStep, totalSteps }) => (
        <>
          <PageTitle
            toolbar={
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            }
          >
            {t("title")}
          </PageTitle>
          <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
            {(formikProps) => (
              <FormPlus>
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
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  return (
    <Typography
      data-testid="multiStepFormIndicator"
      level="body-lg"
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
      preliminaryCourse: mapOptionalValue(values.preliminaryCourse),
      migrationBackground: {
        inGermanySince: mapMonthAndYear(
          values.migrationBackground.child.inGermanySince,
        ),
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
        countryOfBirthSecondParent: onlyIfShown(
          values.migrationBackground.secondParent,
          mapOptionalValue(
            values.migrationBackground.secondParent.countryOfBirth,
          ),
        ),
        nationalitySecondParent: onlyIfShown(
          values.migrationBackground.secondParent,
          mapOptionalValue(values.migrationBackground.secondParent.nationality),
        ),
      },
      promotionBeforeSchoolEntry: {
        earlySupport: mapNullableValue(
          values.promotionBeforeSchoolEntry.earlySupport,
        ),
        ergotherapy: mapOptionalValue(
          values.promotionBeforeSchoolEntry.ergotherapy,
        ),
        integrationPlace: mapNullableValue(
          values.promotionBeforeSchoolEntry.integrationPlace,
        ),
        physiotherapy: mapOptionalValue(
          values.promotionBeforeSchoolEntry.physiotherapy,
        ),
        speechTherapy: mapOptionalValue(
          values.promotionBeforeSchoolEntry.speechTherapy,
        ),
      },
      additionalChildInfo: {
        responsiblePhysician: mapOptionalValue(
          values.additionalChildInfo.responsiblePhysician,
        ),
        siblingsBirthYears: values.additionalChildInfo.siblings.show
          ? dropBlankStrings(
              values.additionalChildInfo.siblings.birthYears,
            ).map(parseInt)
          : [],
      },
      daycareAndSchoolInfo: {
        inDaycareSince: mapMonthAndYear(
          values.daycareAndSchoolInfo.inDaycareSince,
        ),
        daycareName: mapOptionalValue(values.daycareAndSchoolInfo.daycareName),
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
          values.promotionTherapyAndAidInfo.speechTherapy,
          mapOptionalDate(
            values.promotionTherapyAndAidInfo.speechTherapy.start,
          ),
        ),
        speechTherapyEnd: onlyIfShown(
          values.promotionTherapyAndAidInfo.speechTherapy,
          mapOptionalDate(values.promotionTherapyAndAidInfo.speechTherapy.end),
        ),
        ergoTherapyStart: onlyIfShown(
          values.promotionTherapyAndAidInfo.ergoTherapy,
          mapOptionalDate(values.promotionTherapyAndAidInfo.ergoTherapy.start),
        ),
        ergoTherapyEnd: onlyIfShown(
          values.promotionTherapyAndAidInfo.ergoTherapy,
          mapOptionalDate(values.promotionTherapyAndAidInfo.ergoTherapy.end),
        ),
        physioTherapyStart: onlyIfShown(
          values.promotionTherapyAndAidInfo.physioTherapy,
          mapOptionalDate(
            values.promotionTherapyAndAidInfo.physioTherapy.start,
          ),
        ),
        physioTherapyEnd: onlyIfShown(
          values.promotionTherapyAndAidInfo.physioTherapy,
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
