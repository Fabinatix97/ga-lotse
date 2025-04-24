/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYear } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { YesOrNoFieldData } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import {
  ApiExamination,
  ApiGender,
  ApiPartnerRiskFactors,
  ApiProtectionMethod,
  ApiRelationshipModel,
  ApiSafeSexPractice,
  ApiSexWorkLocation,
  ApiSexualOrientation,
  ApiVaccination,
} from "@eshg/sti-protection-api";

import { useTranslation } from "@/lib/i18n/client";

export interface StandardRiskFactors {
  unprotectedVaginal: StandardRiskQuestion;
  unprotectedAnal: StandardRiskQuestion;
  unprotectedOral: StandardRiskQuestion;
}

export interface StandardRiskQuestion {
  taken: YesOrNoFieldData;
  lastIncident: MonthAndYear;
}

export interface StandardExaminationQuestion {
  hadExamination: YesOrNoFieldData;
  examinationDate: MonthAndYear;
}

export function useRelationshipModelOptions(): SelectOption<string, string>[] {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const relationshipModelNames = {
    NO_COMMITMENT: t("general.relationship_model.no_commitment"),
    MONOGAMOUS: t("general.relationship_model.monogamous"),
    OPEN: t("general.relationship_model.open"),
  } as const satisfies Record<ApiRelationshipModel, string>;

  return [
    ...buildEnumOptions(relationshipModelNames, false),
    {
      label: t("general.relationship_model.no_selection"),
      value: "",
    },
  ];
}

export type NotEndsWith<T, K extends string> = T extends `${infer _J}${K}`
  ? never
  : T;

export type ExaminableIllnesses = NotEndsWith<keyof ApiExamination, "Date">;

export function useExaminableIllnessNames() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const examinableIllnessNames = {
    chlamydia: t("examinations.examinableIllness.chlamydia"),
    gonorrhea: t("examinations.examinableIllness.gonorrhea"),
    hepA: t("examinations.examinableIllness.hepA"),
    hepB: t("examinations.examinableIllness.hepB"),
    hepC: t("examinations.examinableIllness.hepC"),
    hiv: t("examinations.examinableIllness.hiv"),
    syphilis: t("examinations.examinableIllness.syphilis"),
  } as const satisfies Record<ExaminableIllnesses, string>;

  return examinableIllnessNames;
}

export function useSexualContactRiskFactorOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const sexualContactRiskFactorNames = {
    [ApiPartnerRiskFactors.Homosexual]: t("partner_risk_factor.homosexual"),
    [ApiPartnerRiskFactors.BisexualMale]: t(
      "partner_risk_factor.bisexual_male",
    ),
    [ApiPartnerRiskFactors.HivPositive]: t("partner_risk_factor.hiv_positive"),
    [ApiPartnerRiskFactors.StiPositive]: t("partner_risk_factor.sti_positive"),
    [ApiPartnerRiskFactors.InjectedDrugs]: t(
      "partner_risk_factor.injected_drugs",
    ),
    [ApiPartnerRiskFactors.SexWorker]: t("partner_risk_factor.sex_worker"),
  } as const satisfies Record<ApiPartnerRiskFactors, string>;

  return buildEnumOptions(sexualContactRiskFactorNames);
}

export function useSexWorkTypeOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const sexWorkTypeNames = {
    [ApiSexWorkLocation.Bordello]: t("sex_work.types.bordello"),
    [ApiSexWorkLocation.Club]: t("sex_work.types.club"),
    [ApiSexWorkLocation.Escort]: t("sex_work.types.escort"),
    [ApiSexWorkLocation.Apartment]: t("sex_work.types.apartment"),
    [ApiSexWorkLocation.AppointmentApartment]: t(
      "sex_work.types.appointment_apartment",
    ),
    [ApiSexWorkLocation.MassageParlor]: t("sex_work.types.massage_parlor"),
    [ApiSexWorkLocation.TantraPractice]: t("sex_work.types.tantra_practice"),
    [ApiSexWorkLocation.StreetProstitution]: t(
      "sex_work.types.street_prostitution",
    ),
    [ApiSexWorkLocation.Other]: t("sex_work.types.other"),
  } as const satisfies Record<ApiSexWorkLocation, string>;

  return buildEnumOptions(sexWorkTypeNames);
}

export function useSexualContactGenderOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const sexualContactNames = {
    [ApiGender.Diverse]: t("sexual_contact.diverse"),
    [ApiGender.Female]: t("sexual_contact.female"),
    [ApiGender.Male]: t("sexual_contact.male"),
    [ApiGender.NotSpecified]: t("sexual_contact.not_specified"),
  } satisfies Record<ApiGender, string>;

  return buildEnumOptions(sexualContactNames);
}

export function useSexualOrientationOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const sexualOrientationNames = {
    [ApiSexualOrientation.Bisexual]: t("sexual_orientation.bisexual"),
    [ApiSexualOrientation.Heterosexual]: t("sexual_orientation.heterosexual"),
    [ApiSexualOrientation.Homosexual]: t("sexual_orientation.homosexual"),
    [ApiSexualOrientation.NotSpecified]: t("sexual_orientation.not_specified"),
  } satisfies Record<ApiSexualOrientation, string>;

  return buildEnumOptions(sexualOrientationNames);
}

export function useVaccineOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const vaccineNames = {
    [ApiVaccination.HepatitisA]: t("vaccines.hepA"),
    [ApiVaccination.HepatitisB]: t("vaccines.hepB"),
    [ApiVaccination.Hpv]: t("vaccines.hpv"),
  } as const satisfies Record<ApiVaccination, string>;

  return buildEnumOptions(vaccineNames);
}

export function useSafeSexRegularityOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const safeSexRegularityNames = {
    [ApiSafeSexPractice.Always]: t("safe_sex_regularity.always"),
    [ApiSafeSexPractice.Frequently]: t("safe_sex_regularity.frequently"),
    [ApiSafeSexPractice.Occasionally]: t("safe_sex_regularity.occasionally"),
    [ApiSafeSexPractice.Never]: t("safe_sex_regularity.never"),
  } as const satisfies Record<ApiSafeSexPractice, string>;

  return buildEnumOptions(safeSexRegularityNames);
}

export function useStiProtectiveMeasuresOptions() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const stiProtectiveMeasuresNames = {
    CONDOM: t("sti_protective_measure.condom"),
    DENTAL_DAM: t("sti_protective_measure.dental_dam"),
    GLOVES: t("sti_protective_measure.gloves"),
    PREP: t("sti_protective_measure.PrEP"),
    TASP: t("sti_protective_measure.TasP"),
    OTHER: t("sti_protective_measure.other"),
  } as const satisfies Record<ApiProtectionMethod, string>;

  return buildEnumOptions(stiProtectiveMeasuresNames);
}

export function useStandardRiskFactorNames() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  const standardRiskFactorNames = {
    unprotectedVaginal: t("standard_risk_factor.unprotected_vaginal"),
    unprotectedAnal: t("standard_risk_factor.unprotected_anal"),
    unprotectedOral: t("standard_risk_factor.unprotected_oral"),
  } as const satisfies { [K in keyof StandardRiskFactors]: string };

  return standardRiskFactorNames;
}
