/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGender,
  ApiMPFacilityType,
  ApiReportingReason,
  ApiRoleStatus,
  ApiSalutation,
  ApiTitle,
} from "@eshg/citizen-portal-api/measlesProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const facilityTypeNames = {
  [ApiMPFacilityType.School]: "Schule",
  [ApiMPFacilityType.DayNursery]: "Kindertageseinrichtung und Kinderhort",
  [ApiMPFacilityType.Daycare]: "Kindertagespflege",
  [ApiMPFacilityType.ChildrensHome]: "Heim",
  [ApiMPFacilityType.RefugeeAccommodation]:
    "Gemeinschaftsunterkunft für Geflüchtete",
  [ApiMPFacilityType.Hospital]: "Krankenhaus",
  [ApiMPFacilityType.MedicalPractice]:
    "Arztpraxis, Zahnarztpraxis oder psychotherapeutische Praxis",
  [ApiMPFacilityType.OutpatientSurgery]: "Einrichtung für ambulantes Operieren",
  [ApiMPFacilityType.RehabilitationCentre]:
    "Vorsorge- oder Rehabilitationseinrichtung",
  [ApiMPFacilityType.DialysisCentre]: "Dialyseeinrichtung",
  [ApiMPFacilityType.DayClinic]: "Tagesklinik",
  [ApiMPFacilityType.MaternityCentre]: "Entbindungseinrichtung",
  [ApiMPFacilityType.OtherMedicalPractice]:
    "Praxis sonstiger humanmedizinischer Heilberufe",
  [ApiMPFacilityType.PublicHealthService]:
    "Einrichtung des öffentlichen Gesundheitsdienstes",
  [ApiMPFacilityType.EmergencyService]: "Rettungsdienst",
  [ApiMPFacilityType.CivilProtection]:
    "Einrichtung des Zivil- und Katastrophenschutzes",
  [ApiMPFacilityType.Other]: "Andere",
} satisfies Record<ApiMPFacilityType, string>;

export const salutationNames: EnumMap<ApiSalutation> = {
  [ApiSalutation.NotSpecified]: "Keine Angabe",
  [ApiSalutation.Neutral]: "Neutral",
  [ApiSalutation.Male]: "Herr",
  [ApiSalutation.Female]: "Frau",
};

export const titleNames: EnumMap<ApiTitle> = {
  [ApiTitle.Dr]: "Dr.",
  [ApiTitle.Prof]: "Prof.",
  [ApiTitle.ProfDr]: "Prof. Dr.",
};

export const genderNames: EnumMap<ApiGender> = {
  [ApiGender.NotSpecified]: "Keine Angabe",
  [ApiGender.Male]: "Männlich",
  [ApiGender.Female]: "Weiblich",
  [ApiGender.Diverse]: "Divers",
};

export const roleStatusNames: EnumMap<ApiRoleStatus> = {
  [ApiRoleStatus.Employee]: "Beschäftigte:r",
  [ApiRoleStatus.Supervised]: "Betreut / Bewohner:in",
} satisfies Record<ApiRoleStatus, string>;

export const reportingReasonNames: EnumMap<ApiReportingReason> = {
  [ApiReportingReason.FirstVaccine]: "nur 1. Impfung",
  [ApiReportingReason.MedicalContraindication]:
    "med. Kontraindikation / Attest",
  [ApiReportingReason.NoProof]: "ohne Nachweis",
  [ApiReportingReason.Other]: "anderer Grund",
  [ApiReportingReason.UnassessableProof]:
    "Nachweis nicht beurteilbar (z.B. unleserlich, Fremdsprache)",
} satisfies Record<ApiReportingReason, string>;

export const facilityTypeOptions =
  buildEnumOptions<ApiMPFacilityType>(facilityTypeNames);
export const salutationOptions =
  buildEnumOptions<ApiSalutation>(salutationNames);
export const titleOptions = buildEnumOptions<ApiTitle>(titleNames);
export const genderOptions = buildEnumOptions<ApiGender>(genderNames);
export const roleStatusOptions =
  buildEnumOptions<ApiRoleStatus>(roleStatusNames);
export const reportingReasonOptions =
  buildEnumOptions<ApiReportingReason>(reportingReasonNames);
