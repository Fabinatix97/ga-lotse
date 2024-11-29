/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGender,
  ApiPartnerRiskFactors,
  ApiProtectionMethod,
  ApiRelationshipModel,
  ApiSafeSexPractice,
  ApiSexWorkLocation,
  ApiSexualOrientation,
  ApiVaccination,
} from "@eshg/employee-portal-api/stiProtection";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import {
  sexualContactNames as sexualContactGenderNames,
  sexualOrientationNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

import { StandardRiskFactors } from "./MedicalHistoryForm.config";

export const sexualOrientationOptions = buildEnumOptions<ApiSexualOrientation>(
  sexualOrientationNames,
);
export const sexualContactGenderOptions = buildEnumOptions<ApiGender>(
  sexualContactGenderNames,
);

export const sexualContactFactorNames = {
  [ApiPartnerRiskFactors.Homosexual]: "Homosexuell",
  [ApiPartnerRiskFactors.BisexualMale]: "bisexueller Mann",
  [ApiPartnerRiskFactors.HivPositive]: "HIV-Positiv",
  [ApiPartnerRiskFactors.StiPositive]: "eine STI",
  [ApiPartnerRiskFactors.InjectedDrugs]: "Drogen gespritzt",
  [ApiPartnerRiskFactors.SexWorker]: "im Sexgewerbe tätig",
} as const satisfies { [K in ApiPartnerRiskFactors]: string };

export const sexualContactFactorOptions = Object.entries(
  sexualContactFactorNames,
).map(([value, label]) => ({ value, label }));

export const sexWorkTypeNames = {
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

export const sexWorkTypeOptions = Object.entries(sexWorkTypeNames).map(
  ([value, label]) => ({ value, label }),
);

export const vaccineNames = {
  [ApiVaccination.HepatitisA]: "Hepatitis A",
  [ApiVaccination.HepatitisB]: "Hepatitis B",
  [ApiVaccination.Hpv]: "HPV",
} as const satisfies { [K in ApiVaccination]: string };

export const vaccineOptions = Object.entries(vaccineNames).map(
  ([value, label]) => ({ value, label }),
);

export const safeSexRegularityNames = {
  [ApiSafeSexPractice.Always]: "Immer",
  [ApiSafeSexPractice.Frequently]: "Häufig",
  [ApiSafeSexPractice.Occasionally]: "Gelegentlich",
  [ApiSafeSexPractice.Never]: "Nie",
} as const satisfies { [K in ApiSafeSexPractice]: string };

export const safeSexRegularityOptions = Object.entries(
  safeSexRegularityNames,
).map(([value, label]) => ({ value, label }));

export const stiProtectiveMeasuresNames = {
  CONDOM: "Kondome",
  DENTAL_DAM: "Lecktuch",
  GLOVES: "Handschuhe",
  PREP: "PrEP (Prä-Expositions-Prophylaxe)",
  TASP: "Schutz durch Therapie",
  OTHER: "Sonstiges",
} as const satisfies { [K in ApiProtectionMethod]: string };

export const stiProtectiveMeasuresOptions = Object.entries(
  stiProtectiveMeasuresNames,
).map(([value, label]) => ({ value, label }));

export const standardRiskFactorNames = {
  unprotectedVaginal: "Ungeschützter Vaginalverkehr",
  unprotectedAnal: "Ungeschützter Analverkehr",
  unprotectedOral: "Ungeschützter Oralverkehr",
} as const satisfies { [K in keyof StandardRiskFactors]: string };

export type StandardRiskFactor = keyof typeof standardRiskFactorNames;

export const standardRiskFactorOptions = Object.entries(
  standardRiskFactorNames,
).map(([value, label]) => ({ value, label }));

export const relationshipModelNames = {
  NO_COMMITMENT: "Keine feste Beziehung",
  MONOGAMOUS: "Monogam",
  OPEN: "Offen",
} as const satisfies { [K in ApiRelationshipModel]: string };

export const relationshipModelOptions = Object.entries(
  relationshipModelNames,
).map(([value, label]) => ({ value, label }));
