/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import {
  mapBoolToYesOrNo,
  mapYesOrNoToBool,
} from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";

import { GeneralSectionData } from "./GeneralSection";
import { PregnancySectionData } from "./PregnancySection";

export type ApiGetConsultation200Response = ApiConsultation;
export interface ApiConsultation {
  general: {
    mainReason: string | undefined;

    furtherGenderInfo: string | undefined;

    hasSufficientGermanLanguageSkills: boolean | undefined;
    isIlliterate: boolean;
    otherKnownLanguages: string | undefined;

    hasHealthInsurance: boolean | undefined;
    hasGermanHealthInsurance: boolean;

    hasInsecureResidence: boolean | undefined;

    hasSymptoms: boolean | undefined;
    symptoms: string | undefined;

    drugUse: string | undefined;

    referral: string | undefined;
  };
  pregnancy?: {
    hasPregnancyRelatedInfo: boolean;
    lastCytologyTest: Date | undefined;
    startOfLastPeriod: Date | undefined;
    numberOfPregnancies: number | undefined;
    numberOfInducedAbortions: number | undefined;
    numberOfBirths: number | undefined;
    numberOfOtherAbortions: number | undefined;
    numberOfEctopicPregnancies: number | undefined;
  };
}

export function mapFormValuesToApi(
  formData: ConsultationFormData,
): ApiConsultation {
  return {
    general: {
      mainReason: mapOptionalValue(formData.general.mainReason),
      furtherGenderInfo: mapOptionalValue(formData.general.furtherGenderInfo),
      hasSufficientGermanLanguageSkills:
        formData.general.hasSufficientGermanLanguageSkills ?? undefined,
      isIlliterate: formData.general.isIlliterate,
      otherKnownLanguages: mapOptionalValue(
        formData.general.otherKnownLanguages,
      ),
      hasHealthInsurance: mapYesOrNoToBool(formData.general.hasHealthInsurance),
      hasGermanHealthInsurance: formData.general.hasGermanHealthInsurance,
      hasInsecureResidence: mapYesOrNoToBool(
        formData.general.hasInsecureResidence,
      ),
      hasSymptoms: mapYesOrNoToBool(formData.general.hasSymptoms),
      symptoms: mapOptionalValue(formData.general.symptoms),
      drugUse: mapOptionalValue(formData.general.drugUse),
      referral: mapOptionalValue(formData.general.referral),
    },
    pregnancy: {
      hasPregnancyRelatedInfo:
        formData.pregnancy.hasPregnancyRelatedInfo ?? undefined,
      lastCytologyTest: formData.pregnancy.lastCytologyTest ?? undefined,
      startOfLastPeriod: formData.pregnancy.startOfLastPeriod ?? undefined,
      numberOfPregnancies: mapOptionalValue(
        formData.pregnancy.numberOfPregnancies,
      ),
      numberOfInducedAbortions: mapOptionalValue(
        formData.pregnancy.numberOfInducedAbortions,
      ),
      numberOfBirths: mapOptionalValue(formData.pregnancy.numberOfBirths),
      numberOfOtherAbortions: mapOptionalValue(
        formData.pregnancy.numberOfOtherAbortions,
      ),
      numberOfEctopicPregnancies: mapOptionalValue(
        formData.pregnancy.numberOfEctopicPregnancies,
      ),
    },
  };
}
export function mapApiToForm(
  apiData: ApiGetConsultation200Response | undefined,
): ConsultationFormData {
  return {
    general: {
      mainReason: apiData?.general.mainReason ?? "",
      furtherGenderInfo: apiData?.general.furtherGenderInfo ?? "",
      hasSufficientGermanLanguageSkills:
        apiData?.general.hasSufficientGermanLanguageSkills ?? null,
      isIlliterate: apiData?.general.isIlliterate ?? false,
      otherKnownLanguages: apiData?.general.otherKnownLanguages ?? "",
      hasHealthInsurance: mapBoolToYesOrNo(apiData?.general.hasHealthInsurance),
      hasGermanHealthInsurance:
        apiData?.general.hasGermanHealthInsurance ?? false,
      hasInsecureResidence: mapBoolToYesOrNo(
        apiData?.general.hasInsecureResidence,
      ),
      hasSymptoms: mapBoolToYesOrNo(apiData?.general.hasSymptoms),
      symptoms: apiData?.general.symptoms ?? "",
      drugUse: apiData?.general.drugUse ?? "",
      referral: apiData?.general.referral ?? "",
    },
    pregnancy: {
      hasPregnancyRelatedInfo:
        apiData?.pregnancy?.hasPregnancyRelatedInfo ?? false,
      lastCytologyTest: apiData?.pregnancy?.lastCytologyTest ?? null,
      startOfLastPeriod: apiData?.pregnancy?.startOfLastPeriod ?? null,
      numberOfPregnancies: apiData?.pregnancy?.numberOfPregnancies ?? "",
      numberOfInducedAbortions:
        apiData?.pregnancy?.numberOfInducedAbortions ?? "",
      numberOfBirths: apiData?.pregnancy?.numberOfBirths ?? "",
      numberOfOtherAbortions: apiData?.pregnancy?.numberOfOtherAbortions ?? "",
      numberOfEctopicPregnancies:
        apiData?.pregnancy?.numberOfEctopicPregnancies ?? "",
    },
  };
}

export interface ConsultationFormData {
  general: GeneralSectionData;
  pregnancy: PregnancySectionData;
}
