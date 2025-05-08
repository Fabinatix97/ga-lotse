/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import {
  ApiGender,
  ApiPartnerRiskFactors,
  ApiProtectionMethod,
  ApiRelationshipModel,
  ApiSafeSexPractice,
  ApiSexWorkLocation,
  ApiSexualOrientation,
  ApiVaccination,
} from "@eshg/sti-protection-api";

import {
  sexualContactNames as sexualContactGenderNames,
  sexualOrientationNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

import { StandardRiskFactors } from "./MedicalHistoryForm.config";

export const sexualOrientationOptions = buildEnumOptions<ApiSexualOrientation>(
  sexualOrientationNames,
  true,
);
export const sexualContactGenderOptions = buildEnumOptions<ApiGender>(
  sexualContactGenderNames,
);

const sexualContactFactorNames = {
  [ApiPartnerRiskFactors.Homosexual]: "Homosexuell",
  [ApiPartnerRiskFactors.BisexualMale]: "bisexueller Mann",
  [ApiPartnerRiskFactors.HivPositive]: "HIV-Positiv",
  [ApiPartnerRiskFactors.StiPositive]: "eine STI",
  [ApiPartnerRiskFactors.InjectedDrugs]: "Drogen gespritzt",
  [ApiPartnerRiskFactors.SexWorker]: "im Sexgewerbe tätig",
} as const satisfies Record<ApiPartnerRiskFactors, string>;

export const sexualContactFactorOptions = buildEnumOptions(
  sexualContactFactorNames,
);

const sexWorkTypeNames = {
  [ApiSexWorkLocation.Bordello]: "Bordell",
  [ApiSexWorkLocation.Club]: "Club",
  [ApiSexWorkLocation.Escort]: "Escort",
  [ApiSexWorkLocation.Apartment]: "Wohnung",
  [ApiSexWorkLocation.AppointmentApartment]: "Terminwohnung",
  [ApiSexWorkLocation.MassageParlor]: "Massagesalon",
  [ApiSexWorkLocation.TantraPractice]: "Tantra-Praxis",
  [ApiSexWorkLocation.StreetProstitution]: "Straßenstrich",
  [ApiSexWorkLocation.Other]: "Sonstiges",
} as const;

export const sexWorkTypeOptions = buildEnumOptions(sexWorkTypeNames);

const vaccineNames = {
  [ApiVaccination.HepatitisA]: "Hepatitis A",
  [ApiVaccination.HepatitisB]: "Hepatitis B",
  [ApiVaccination.Hpv]: "HPV",
} as const satisfies Record<ApiVaccination, string>;

export const vaccineOptions = buildEnumOptions(vaccineNames);

const safeSexRegularityNames = {
  [ApiSafeSexPractice.Always]: "Immer",
  [ApiSafeSexPractice.Frequently]: "Häufig",
  [ApiSafeSexPractice.Occasionally]: "Gelegentlich",
  [ApiSafeSexPractice.Never]: "Nie",
} as const satisfies Record<ApiSafeSexPractice, string>;

export const safeSexRegularityOptions = buildEnumOptions(
  safeSexRegularityNames,
);

const stiProtectiveMeasuresNames = {
  CONDOM: "Kondome",
  DENTAL_DAM: "Lecktuch",
  GLOVES: "Handschuhe",
  PREP: "PrEP (Prä-Expositions-Prophylaxe)",
  TASP: "Schutz durch Therapie",
  OTHER: "Sonstiges",
} as const satisfies Record<ApiProtectionMethod, string>;

export const stiProtectiveMeasuresOptions = buildEnumOptions(
  stiProtectiveMeasuresNames,
);

export const standardRiskFactorNames = {
  unprotectedVaginal: "Ungeschützter Vaginalverkehr",
  unprotectedAnal: "Ungeschützter Analverkehr",
  unprotectedOral: "Ungeschützter Oralverkehr",
} as const satisfies { [K in keyof StandardRiskFactors]: string };

export type StandardRiskFactor = keyof typeof standardRiskFactorNames;

const relationshipModelNames = {
  NO_COMMITMENT: "Keine feste Beziehung",
  MONOGAMOUS: "Monogam",
  OPEN: "Offen",
} as const satisfies Record<ApiRelationshipModel, string>;

export const relationshipModelOptions = buildEnumOptions(
  relationshipModelNames,
  true,
);
