/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConsultation } from "@eshg/employee-portal-api/stiProtection";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";

import {
  mapBoolToYesOrNo,
  mapYesOrNoToBool,
} from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";

import { GeneralSectionData } from "./GeneralSection";
import { PregnancySectionData } from "./PregnancySection";

export function mapFormValuesToApi(
  formData: ConsultationFormData,
): ApiConsultation {
  return {
    general: {
      mainReason: mapOptionalValue(formData.general.mainReason),
      furtherGenderInfo: mapOptionalValue(formData.general.furtherGenderInfo),
      hasSufficientGermanLanguageSkills: mapYesOrNoToBool(
        formData.general.hasSufficientGermanLanguageSkills,
      ),
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
      notes: mapOptionalValue(formData.general.notes),
    },
    pregnancy: {
      hasPregnancyRelatedInfo:
        formData.pregnancy.hasPregnancyRelatedInfo ?? undefined,
      lastCytologyTest: ifDefined(
        mapOptionalValue(formData.pregnancy.lastCytologyTest),
        (a) => new Date(a),
      ),
      startOfLastPeriod: ifDefined(
        mapOptionalValue(formData.pregnancy.startOfLastPeriod),
        (a) => new Date(a),
      ),
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
  apiData: ApiConsultation | undefined,
): ConsultationFormData {
  return {
    general: {
      mainReason: apiData?.general?.mainReason ?? "",
      furtherGenderInfo: apiData?.general?.furtherGenderInfo ?? "",
      hasSufficientGermanLanguageSkills: mapBoolToYesOrNo(
        apiData?.general?.hasSufficientGermanLanguageSkills,
      ),
      isIlliterate: apiData?.general?.isIlliterate ?? false,
      otherKnownLanguages: apiData?.general?.otherKnownLanguages ?? "",
      hasHealthInsurance: mapBoolToYesOrNo(
        apiData?.general?.hasHealthInsurance,
      ),
      hasGermanHealthInsurance:
        apiData?.general?.hasGermanHealthInsurance ?? false,
      hasInsecureResidence: mapBoolToYesOrNo(
        apiData?.general?.hasInsecureResidence,
      ),
      hasSymptoms: mapBoolToYesOrNo(apiData?.general?.hasSymptoms),
      symptoms: apiData?.general?.symptoms ?? "",
      drugUse: apiData?.general?.drugUse ?? "",
      referral: apiData?.general?.referral ?? "",
      notes: apiData?.general?.notes ?? "",
    },
    pregnancy: {
      hasPregnancyRelatedInfo:
        apiData?.pregnancy?.hasPregnancyRelatedInfo ?? false,
      lastCytologyTest:
        apiData?.pregnancy?.lastCytologyTest?.toISOString().slice(0, 10) ?? "",
      startOfLastPeriod:
        apiData?.pregnancy?.startOfLastPeriod?.toISOString().slice(0, 10) ?? "",
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
