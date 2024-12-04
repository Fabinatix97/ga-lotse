/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAdditionalChildInfo,
  ApiCheckUps,
  ApiDaycareAndSchoolInfo,
  ApiDevelopmentInfo,
  ApiFamilyHistoryInfo,
  ApiIllnessAndAccidentInfo,
  ApiInterestsAndSportsInfo,
  ApiMigrationBackground,
  ApiPromotionBeforeSchoolEntry,
  ApiPromotionTherapyAndAidInfo,
  UpdateAnamnesisRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { mapMonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import {
  mapOptionalDate,
  mapOptionalValue,
  parseOptionalDate,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import {
  useCountryCodesApi,
  useSchoolEntryApi,
} from "@/lib/businessModules/schoolEntry/api/clients";
import { Anamnesis } from "@/lib/businessModules/schoolEntry/api/models/Anamnesis";
import { useUpdateAnamnesisOptions } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { getCountryCodesQuery } from "@/lib/businessModules/schoolEntry/api/queries/countryCodesApi";
import {
  getAnamnesisQuery,
  getProcedureQuery,
} from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import {
  AdditionalChildInfoValues,
  AnamnesisForm,
  AnamnesisFormValues,
  CheckUpsValues,
  DaycareAndSchoolInfoValues,
  DevelopmentInfoValues,
  FamilyHistoryInfoValues,
  IllnessAndAccidentInfoValues,
  InterestAndSportsInfoValues,
  MigrationBackgroundValues,
  PromotionBeforeSchoolEntryValues,
  PromotionTherapyAndAidInfoValues,
} from "@/lib/businessModules/schoolEntry/features/procedures/anamnesis/AnamnesisForm";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { ContentPanelTitle } from "@/lib/shared/components/contentPanel/ContentPanelTitle";

export default function SchoolEntryAnamnesisPage(
  props: SchoolEntryProcedurePageProps,
) {
  const procedureId = props.params.procedureId;
  const schoolEntryApi = useSchoolEntryApi();
  const countryCodesApi = useCountryCodesApi();
  const [{ data: procedure }, { data: anamnesis }, { data: countryCodes }] =
    useSuspenseQueries({
      queries: [
        getProcedureQuery(schoolEntryApi, procedureId),
        getAnamnesisQuery(schoolEntryApi, procedureId),
        getCountryCodesQuery(countryCodesApi),
      ],
    });
  const updateAnamnesisOptions = useUpdateAnamnesisOptions(procedureId);
  const updateAnamnesis = useHandledMutation(updateAnamnesisOptions);

  async function handleSubmit(values: AnamnesisFormValues) {
    await updateAnamnesis.mutateAsync(
      mapToRequest(procedureId, values, anamnesis.version),
    );
  }

  return (
    <ContentPanel>
      <ContentPanelTitle>S1 - Anamnese</ContentPanelTitle>
      <DisabledFormProvider disabled={procedure.isClosed}>
        <AnamnesisForm
          initialValues={mapToFormValues(anamnesis)}
          onSubmit={handleSubmit}
          dateOfBirth={procedure.child.dateOfBirth}
          countryCodes={countryCodes}
          valuesToMutationBundle={(values) => ({
            mutationOptions: updateAnamnesisOptions,
            variableSupplier: () =>
              mapToRequest(procedureId, values, anamnesis.version),
          })}
        />
      </DisabledFormProvider>
    </ContentPanel>
  );
}

function mapToFormValues(apiAnamnesis: Anamnesis): AnamnesisFormValues {
  return {
    childLanguageScreening: parseOptionalValue(
      apiAnamnesis.childLanguageScreening,
    ),
    preliminaryCourse: parseOptionalValue(apiAnamnesis.preliminaryCourse),
    additionalChildInfo: parseAdditionalChildInfo(
      apiAnamnesis.additionalChildInfo,
    ),
    daycareAndSchoolInfo: parseDaycareAndSchoolInfo(
      apiAnamnesis.daycareAndSchoolInfo,
    ),
    developmentInfo: parseDevelopmentInfo(apiAnamnesis.developmentInfo),
    checkUps: parseCheckUps(apiAnamnesis.checkUps),
    familyHistoryInfo: parseFamilyHistoryInfo(apiAnamnesis.familyHistoryInfo),
    illnessAndAccidentInfo: parseIllnessAndAccidentInfo(
      apiAnamnesis.illnessAndAccidentInfo,
    ),
    promotionBeforeSchoolEntry: parsePromotionBeforeSchoolEntry(
      apiAnamnesis.promotionBeforeSchoolEntry,
    ),
    promotionTherapyAndAidInfo: parsePromotionTherapyAndAidInfo(
      apiAnamnesis.promotionTherapyAndAidInfo,
    ),
    interestsAndSportsInfo: parseInterestAndSportInfo(
      apiAnamnesis.interestsAndSportsInfo,
    ),
    migrationBackground: parseMigrationBackground(
      apiAnamnesis.migrationBackground,
    ),
    personalConspicuities: parseOptionalValue(
      apiAnamnesis.personalConspicuities,
    ),
  };
}

function parseInterestAndSportInfo(
  interestAndSportInfo: ApiInterestsAndSportsInfo,
) {
  return {
    canSwim: parseOptionalValue(interestAndSportInfo.canSwim),
    hasSeahorseBadge: parseOptionalValue(interestAndSportInfo.hasSeahorseBadge),
    clubSport: parseOptionalValue(interestAndSportInfo.clubSport),
    otherInterests: parseOptionalValue(interestAndSportInfo.otherInterests),
  };
}

function parseMigrationBackground(migrationBackground: ApiMigrationBackground) {
  return {
    nationalityChild: parseOptionalValue(migrationBackground.nationalityChild),
    countryOfBirthChild: parseOptionalValue(
      migrationBackground.countryOfBirthChild,
    ),
    nationalityFirstParent: parseOptionalValue(
      migrationBackground.nationalityFirstParent,
    ),
    countryOfBirthFirstParent: parseOptionalValue(
      migrationBackground.countryOfBirthFirstParent,
    ),
    nationalitySecondParent: parseOptionalValue(
      migrationBackground.nationalitySecondParent,
    ),
    countryOfBirthSecondParent: parseOptionalValue(
      migrationBackground.countryOfBirthSecondParent,
    ),
    hasMigrationBackground: parseOptionalValue(
      migrationBackground.hasMigrationBackground,
    ),
    inGermanySince: parseMonthAndYear(migrationBackground.inGermanySince),
  };
}

function parseMonthAndYear(date: Date | undefined) {
  return {
    month: isDefined(date) ? date.getMonth() : null,
    year: parseOptionalValue(date?.getFullYear()),
  };
}

function parseAdditionalChildInfo(additionalChildInfo: ApiAdditionalChildInfo) {
  return {
    responsiblePhysician: parseOptionalValue(
      additionalChildInfo.responsiblePhysician,
    ),
    numberOfSiblings: parseOptionalValue(additionalChildInfo.numberOfSiblings),
    siblingsBirthYears: isDefined(additionalChildInfo.siblingsBirthYears)
      ? additionalChildInfo.siblingsBirthYears
      : [],
  };
}

function parseDaycareAndSchoolInfo(
  daycareAndSchoolInfo: ApiDaycareAndSchoolInfo,
) {
  return {
    wasInDaycare: parseOptionalValue(daycareAndSchoolInfo.wasInDaycare),
    inDaycareSince: parseMonthAndYear(daycareAndSchoolInfo.inDaycareSince),
    daycareName: parseOptionalValue(daycareAndSchoolInfo.daycareName),
    schoolName: parseOptionalValue(daycareAndSchoolInfo.schoolName),
  };
}

function parseDevelopmentInfo(developmentInfo: ApiDevelopmentInfo) {
  return {
    birthWeight: parseOptionalValue(developmentInfo.birthWeight),
    gestationalAge: parseOptionalValue(developmentInfo.gestationalAge),
    developmentConspicuities: parseOptionalValue(
      developmentInfo.developmentConspicuities,
    ),
    infancyConspicuities: parseOptionalValue(
      developmentInfo.infancyConspicuities,
    ),
  };
}

function parseCheckUps(checkUps: ApiCheckUps) {
  return {
    u2: parseOptionalValue(checkUps.u2),
    u3: parseOptionalValue(checkUps.u3),
    u4: parseOptionalValue(checkUps.u4),
    u5: parseOptionalValue(checkUps.u5),
    u6: parseOptionalValue(checkUps.u6),
    u7: parseOptionalValue(checkUps.u7),
    u7a: parseOptionalValue(checkUps.u7a),
    u8: parseOptionalValue(checkUps.u8),
    u9: parseOptionalValue(checkUps.u9),
  };
}

function parseFamilyHistoryInfo(familyHistoryInfo: ApiFamilyHistoryInfo) {
  return {
    spectaclesInFamily: parseOptionalValue(
      familyHistoryInfo.spectaclesInFamily,
    ),
    chronicIllnessOrDisabilityInFamily: parseOptionalValue(
      familyHistoryInfo.chronicIllnessOrDisabilityInFamily,
    ),
  };
}

function parseIllnessAndAccidentInfo(
  illnessAndAccidentInfo: ApiIllnessAndAccidentInfo,
) {
  return {
    severeIllnesses: parseOptionalValue(illnessAndAccidentInfo.severeIllnesses),
    allergies: isDefined(illnessAndAccidentInfo.allergies)
      ? illnessAndAccidentInfo.allergies
      : [],
    hospitalizationsOrOperations: parseOptionalValue(
      illnessAndAccidentInfo.hospitalizationsOrOperations,
    ),
    underMedicalTreatmentFor: parseOptionalValue(
      illnessAndAccidentInfo.underMedicalTreatmentFor,
    ),
    regularMedication: parseOptionalValue(
      illnessAndAccidentInfo.regularMedication,
    ),
  };
}

function parsePromotionBeforeSchoolEntry(
  promotionBeforeSchoolEntry: ApiPromotionBeforeSchoolEntry,
) {
  return {
    earlySupport: parseOptionalValue(promotionBeforeSchoolEntry.earlySupport),
    integrationPlace: parseOptionalValue(
      promotionBeforeSchoolEntry.integrationPlace,
    ),
    ergotherapy: parseOptionalValue(promotionBeforeSchoolEntry.ergotherapy),
    speechTherapy: parseOptionalValue(promotionBeforeSchoolEntry.speechTherapy),
    physiotherapy: parseOptionalValue(promotionBeforeSchoolEntry.physiotherapy),
  };
}

function parsePromotionTherapyAndAidInfo(
  promotionTherapyAndAidInfo: ApiPromotionTherapyAndAidInfo,
) {
  return {
    visionImpairment: parseOptionalValue(
      promotionTherapyAndAidInfo.visionImpairment,
    ),
    hearingImpairment: parseOptionalValue(
      promotionTherapyAndAidInfo.hearingImpairment,
    ),
    speechImpairment: parseOptionalValue(
      promotionTherapyAndAidInfo.speechImpairment,
    ),
    spectaclesSince: parseOptionalDate(
      promotionTherapyAndAidInfo.spectaclesSince,
    ),
    visionSchoolSince: parseOptionalDate(
      promotionTherapyAndAidInfo.visionSchoolSince,
    ),
    hearingAid: parseOptionalValue(promotionTherapyAndAidInfo.hearingAid),
    speechTherapyStart: parseOptionalDate(
      promotionTherapyAndAidInfo.speechTherapyStart,
    ),
    speechTherapyEnd: parseOptionalDate(
      promotionTherapyAndAidInfo.speechTherapyEnd,
    ),
    ergoTherapyStart: parseOptionalDate(
      promotionTherapyAndAidInfo.ergoTherapyStart,
    ),
    ergoTherapyEnd: parseOptionalDate(
      promotionTherapyAndAidInfo.ergoTherapyEnd,
    ),
    physioTherapyStart: parseOptionalDate(
      promotionTherapyAndAidInfo.physioTherapyStart,
    ),
    physioTherapyEnd: parseOptionalDate(
      promotionTherapyAndAidInfo.physioTherapyEnd,
    ),
    additionalTherapies: parseOptionalValue(
      promotionTherapyAndAidInfo.additionalTherapies,
    ),
  };
}

function mapToRequest(
  procedureId: string,
  formValues: AnamnesisFormValues,
  version: number,
): UpdateAnamnesisRequest {
  return {
    procedureId,
    apiAnamnesis: {
      version,
      childLanguageScreening: mapOptionalValue(
        formValues.childLanguageScreening,
      ),
      preliminaryCourse: mapOptionalValue(formValues.preliminaryCourse),
      additionalChildInfo: mapAdditionalChildInfo(
        formValues.additionalChildInfo,
      ),
      daycareAndSchoolInfo: mapDaycareAndSchoolInfo(
        formValues.daycareAndSchoolInfo,
      ),
      developmentInfo: mapDevelopmentInfo(formValues.developmentInfo),
      checkUps: mapCheckups(formValues.checkUps),
      promotionBeforeSchoolEntry: mapPromotionBeforeSchoolEntry(
        formValues.promotionBeforeSchoolEntry,
      ),
      migrationBackground: mapMigrationBackground(
        formValues.migrationBackground,
      ),
      familyHistoryInfo: mapFamilyHistoryInfo(formValues.familyHistoryInfo),
      illnessAndAccidentInfo: mapIllnessAndAccidentInfo(
        formValues.illnessAndAccidentInfo,
      ),
      interestsAndSportsInfo: mapInterestsAndSportsInfo(
        formValues.interestsAndSportsInfo,
      ),
      promotionTherapyAndAidInfo: mapPromotionTherapyAndAidInfo(
        formValues.promotionTherapyAndAidInfo,
        formValues.promotionBeforeSchoolEntry,
      ),
      personalConspicuities: mapOptionalValue(formValues.personalConspicuities),
    },
  };
}

function mapInterestsAndSportsInfo(values: InterestAndSportsInfoValues) {
  return {
    canSwim: mapOptionalValue(values.canSwim),
    hasSeahorseBadge: mapOptionalValue(values.hasSeahorseBadge),
    clubSport: mapOptionalValue(values.clubSport),
    otherInterests: mapOptionalValue(values.otherInterests),
  };
}

function mapIllnessAndAccidentInfo(values: IllnessAndAccidentInfoValues) {
  return {
    severeIllnesses: mapOptionalValue(values.severeIllnesses),
    allergies: values.allergies?.length === 0 ? undefined : values.allergies,
    hospitalizationsOrOperations: mapOptionalValue(
      values.hospitalizationsOrOperations,
    ),
    underMedicalTreatmentFor: mapOptionalValue(values.underMedicalTreatmentFor),
    regularMedication: mapOptionalValue(values.regularMedication),
  };
}

function mapAdditionalChildInfo(values: AdditionalChildInfoValues) {
  return {
    responsiblePhysician: mapOptionalValue(values.responsiblePhysician),
    numberOfSiblings: mapOptionalValue(values.numberOfSiblings),
    siblingsBirthYears:
      values.siblingsBirthYears.length === 0 ||
      isEmptyString(values.numberOfSiblings)
        ? undefined
        : values.siblingsBirthYears,
  };
}

function mapDaycareAndSchoolInfo(values: DaycareAndSchoolInfoValues) {
  return {
    wasInDaycare: mapOptionalValue(values.wasInDaycare),
    inDaycareSince:
      values.wasInDaycare === true
        ? mapMonthAndYear(values.inDaycareSince)
        : undefined,
    daycareName:
      values.wasInDaycare === true
        ? mapOptionalValue(values.daycareName)
        : undefined,
    schoolName: mapOptionalValue(values.schoolName),
  };
}

function mapDevelopmentInfo(values: DevelopmentInfoValues) {
  return {
    birthWeight: mapOptionalValue(values.birthWeight),
    gestationalAge: mapOptionalValue(values.gestationalAge),
    developmentConspicuities: mapOptionalValue(values.developmentConspicuities),
    infancyConspicuities: mapOptionalValue(values.infancyConspicuities),
  };
}

function mapCheckups(values: CheckUpsValues): ApiCheckUps {
  return {
    u2: mapOptionalValue(values.u2),
    u3: mapOptionalValue(values.u3),
    u4: mapOptionalValue(values.u4),
    u5: mapOptionalValue(values.u5),
    u6: mapOptionalValue(values.u6),
    u7: mapOptionalValue(values.u7),
    u7a: mapOptionalValue(values.u7a),
    u8: mapOptionalValue(values.u8),
    u9: mapOptionalValue(values.u9),
  };
}

function mapFamilyHistoryInfo(
  values: FamilyHistoryInfoValues,
): ApiFamilyHistoryInfo {
  return {
    spectaclesInFamily: mapOptionalValue(values.spectaclesInFamily),
    chronicIllnessOrDisabilityInFamily: mapOptionalValue(
      values.chronicIllnessOrDisabilityInFamily,
    ),
  };
}

function mapPromotionBeforeSchoolEntry(
  values: PromotionBeforeSchoolEntryValues,
): ApiPromotionBeforeSchoolEntry {
  return {
    earlySupport: mapOptionalValue(values.earlySupport),
    integrationPlace: mapOptionalValue(values.integrationPlace),
    ergotherapy: mapOptionalValue(values.ergotherapy),
    speechTherapy: mapOptionalValue(values.speechTherapy),
    physiotherapy: mapOptionalValue(values.physiotherapy),
  };
}

function mapPromotionTherapyAndAidInfo(
  values: PromotionTherapyAndAidInfoValues,
  promotionBeforeSchoolEntryValues: PromotionBeforeSchoolEntryValues,
) {
  return {
    visionImpairment: mapOptionalValue(values.visionImpairment),
    hearingImpairment: mapOptionalValue(values.hearingImpairment),
    speechImpairment: mapOptionalValue(values.speechImpairment),
    spectaclesSince: mapOptionalDate(values.spectaclesSince),
    visionSchoolSince: mapOptionalDate(values.visionSchoolSince),
    hearingAid: mapOptionalValue(values.hearingAid),
    speechTherapyStart: promotionBeforeSchoolEntryValues.speechTherapy
      ? mapOptionalDate(values.speechTherapyStart)
      : undefined,
    speechTherapyEnd: promotionBeforeSchoolEntryValues.speechTherapy
      ? mapOptionalDate(values.speechTherapyEnd)
      : undefined,
    ergoTherapyStart: promotionBeforeSchoolEntryValues.ergotherapy
      ? mapOptionalDate(values.ergoTherapyStart)
      : undefined,
    ergoTherapyEnd: promotionBeforeSchoolEntryValues.ergotherapy
      ? mapOptionalDate(values.ergoTherapyEnd)
      : undefined,
    physioTherapyStart: promotionBeforeSchoolEntryValues.physiotherapy
      ? mapOptionalDate(values.physioTherapyStart)
      : undefined,
    physioTherapyEnd: promotionBeforeSchoolEntryValues.physiotherapy
      ? mapOptionalDate(values.physioTherapyEnd)
      : undefined,
    additionalTherapies: mapOptionalValue(values.additionalTherapies),
  };
}

function mapMigrationBackground(
  values: MigrationBackgroundValues,
): ApiMigrationBackground {
  return {
    nationalityChild: mapOptionalValue(values.nationalityChild),
    countryOfBirthChild: mapOptionalValue(values.countryOfBirthChild),
    nationalityFirstParent: mapOptionalValue(values.nationalityFirstParent),
    countryOfBirthFirstParent: mapOptionalValue(
      values.countryOfBirthFirstParent,
    ),
    nationalitySecondParent: mapOptionalValue(values.nationalitySecondParent),
    countryOfBirthSecondParent: mapOptionalValue(
      values.countryOfBirthSecondParent,
    ),
    hasMigrationBackground: mapOptionalValue(values.hasMigrationBackground),
    inGermanySince: mapMonthAndYear(values.inGermanySince),
  };
}
