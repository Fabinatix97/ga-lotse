/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap, buildEnumOptions } from "@eshg/lib-portal";
import {
  ApiGender,
  ApiMPFacilityType,
  ApiReportingReason,
  ApiRoleStatus,
  ApiSalutation,
  ApiTitle,
} from "@eshg/measles-protection-api";

import { TranslateFn } from "@/lib/i18n/client";

const facilityTypeNames = {
  [ApiMPFacilityType.School]: "common.facility_types.school",
  [ApiMPFacilityType.DayNursery]: "common.facility_types.day_nursery",
  [ApiMPFacilityType.Daycare]: "common.facility_types.daycare",
  [ApiMPFacilityType.ChildrensHome]: "common.facility_types.childrens_home",
  [ApiMPFacilityType.RefugeeAccommodation]:
    "common.facility_types.refugee_accommodation",
  [ApiMPFacilityType.Hospital]: "common.facility_types.hospital",
  [ApiMPFacilityType.MedicalPractice]: "common.facility_types.medical_practice",
  [ApiMPFacilityType.OutpatientSurgery]:
    "common.facility_types.outpatient_surgery",
  [ApiMPFacilityType.RehabilitationCentre]:
    "common.facility_types.rehabilitation_centre",
  [ApiMPFacilityType.DialysisCentre]: "common.facility_types.dialysis_centre",
  [ApiMPFacilityType.DayClinic]: "common.facility_types.day_clinic",
  [ApiMPFacilityType.MaternityCentre]: "common.facility_types.maternity_centre",
  [ApiMPFacilityType.OtherMedicalPractice]:
    "common.facility_types.other_medical_practice",
  [ApiMPFacilityType.PublicHealthService]:
    "common.facility_types.public_health_service",
  [ApiMPFacilityType.EmergencyService]:
    "common.facility_types.emergency_service",
  [ApiMPFacilityType.CivilProtection]: "common.facility_types.civil_protection",
  [ApiMPFacilityType.Other]: "common.facility_types.other",
} satisfies Record<ApiMPFacilityType, string>;

const salutationNames: EnumMap<ApiSalutation> = {
  [ApiSalutation.NotSpecified]: "base/translation:salutation.not_specified",
  [ApiSalutation.Neutral]: "base/translation:salutation.neutral",
  [ApiSalutation.Male]: "base/translation:salutation.male",
  [ApiSalutation.Female]: "base/translation:salutation.female",
};

const titleNames: EnumMap<ApiTitle> = {
  [ApiTitle.Dr]: "base/translation:title.dr",
  [ApiTitle.Prof]: "base/translation:title.prof",
  [ApiTitle.ProfDr]: "base/translation:title.prof_dr",
};

const genderNames: EnumMap<ApiGender> = {
  [ApiGender.NotSpecified]: "base/translation:gender.not_specified",
  [ApiGender.Male]: "base/translation:gender.male",
  [ApiGender.Female]: "base/translation:gender.female",
  [ApiGender.Diverse]: "base/translation:gender.diverse",
};

export const roleStatusNames: EnumMap<ApiRoleStatus> = {
  [ApiRoleStatus.Employee]: "common.role_status.employee",
  [ApiRoleStatus.Supervised]: "common.role_status.supervised",
} satisfies Record<ApiRoleStatus, string>;

export const reportingReasonNames: EnumMap<ApiReportingReason> = {
  [ApiReportingReason.FirstVaccine]: "common.reporting_reason.first_vaccine",
  [ApiReportingReason.MedicalContraindication]:
    "common.reporting_reason.medical_contraindication",
  [ApiReportingReason.NoProof]: "common.reporting_reason.no_proof",
  [ApiReportingReason.Other]: "common.reporting_reason.other",
  [ApiReportingReason.UnassessableProof]:
    "common.reporting_reason.unassessable_proof",
} satisfies Record<ApiReportingReason, string>;

function translateMap<TEnum extends string>(
  t: TranslateFn,
  valueToLabelMap: Record<TEnum, string>,
) {
  const entries = Object.entries(valueToLabelMap)
    .filter((entry): entry is [TEnum, string] => typeof entry[1] === "string")
    .map(([value, label]: [TEnum, string]) => [value, t(label)]);
  return Object.fromEntries(entries) as Record<TEnum, string>;
}

export function facilityTypeOptions(t: TranslateFn) {
  return buildEnumOptions<ApiMPFacilityType>(
    translateMap(t, facilityTypeNames),
  );
}
export function salutationOptions(t: TranslateFn) {
  return buildEnumOptions<ApiSalutation>(translateMap(t, salutationNames));
}
export function titleOptions(t: TranslateFn) {
  return buildEnumOptions<ApiTitle>(translateMap(t, titleNames));
}
export function genderOptions(t: TranslateFn) {
  return buildEnumOptions<ApiGender>(translateMap(t, genderNames));
}
export function roleStatusOptions(t: TranslateFn) {
  return buildEnumOptions<ApiRoleStatus>(translateMap(t, roleStatusNames));
}
export function reportingReasonOptions(t: TranslateFn) {
  return buildEnumOptions<ApiReportingReason>(
    translateMap(t, reportingReasonNames),
  );
}
