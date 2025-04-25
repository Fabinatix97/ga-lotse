/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiDecayStatus, ApiDentitionType } from "@eshg/dental-api";
import { formatBoolean } from "@eshg/lib-employee-portal";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { parseOptionalValue } from "@eshg/lib-portal/helpers/form";

import { ExaminationResult } from "@/api/models/ExaminationResult";
import { DecayHistoryItem } from "@/components/examination/DecayHistorySidebar";
import { DecayHistoryRow } from "@/components/examination/DecayHistoryTable";
import { calculateDmftValuesByDentitionType } from "@/stores/examination/actions/dmftValues";
import { calculateDecayRiskValue } from "@/stores/examination/selectors/decayRisk";
import { selectDecayStatus } from "@/stores/examination/selectors/decayStatus";
import { selectDmftValues } from "@/stores/examination/selectors/dmftValues";
import { DECAY_STATUS } from "@/translations/examination";
import {
  AdditionalInformationFormValues,
  ExaminationFormValues,
} from "@/types/examination";

const EMPTY_VALUE = "-";

export function calculateDecayRisk(
  historyItem: DecayHistoryItem,
  dateOfBirth: Date,
): DecayHistoryRow {
  const dmftValues = calculateDmftValuesByDentitionType(historyItem.dentition);
  const selectedDmftValues = selectDmftValues({
    dmftValues,
  });
  const hasDecayRisk = calculateDecayRiskValue(
    calculateAge(dateOfBirth, historyItem.dateOfExamination),
    selectedDmftValues.primaryTeeth,
    selectedDmftValues.secondaryTeeth,
    dmftValues.secondaryTeeth.decayed,
  );

  return {
    value: isDefined(hasDecayRisk) ? formatBoolean(hasDecayRisk) : EMPTY_VALUE,
    dateOfExamination: historyItem.dateOfExamination,
    hasDecayRisk: hasDecayRisk === true,
  };
}

export function calculateDecayStatus(
  historyItem: DecayHistoryItem,
): DecayHistoryRow {
  const dmftValues = calculateDmftValuesByDentitionType(historyItem.dentition);
  const decayStatus = selectDecayStatus({ dmftValues });

  return {
    value: isDefined(decayStatus) ? DECAY_STATUS[decayStatus] : EMPTY_VALUE,
    dateOfExamination: historyItem.dateOfExamination,
    hasDecayRisk: decayStatus === ApiDecayStatus.TreatmentRequired,
  };
}

export function mapToExaminationFormValues(
  examinationResult: ExaminationResult | undefined,
  note: string | undefined,
  defaultDentitionType: ApiDentitionType | undefined,
): ExaminationFormValues {
  return {
    note: parseOptionalValue(note),
    ...mapExaminationResultFormValues(examinationResult, defaultDentitionType),
  };
}

function mapExaminationResultFormValues(
  examinationResult: ExaminationResult | undefined,
  defaultDentitionType: ApiDentitionType | undefined,
): AdditionalInformationFormValues {
  if (examinationResult?.type === "screening") {
    return {
      dentitionType: parseOptionalValue(examinationResult.dentitionType),
      oralHygieneStatus: parseOptionalValue(
        examinationResult.oralHygieneStatus,
      ),
      mihStatus: parseOptionalValue(examinationResult.mihStatus),
      orthodonticFindings: examinationResult.orthodonticFindings ?? [],
      orthodonticStatus: parseOptionalValue(
        examinationResult.orthodonticStatus,
      ),
      fluorideVarnishApplied: parseOptionalValue(
        examinationResult.fluorideVarnishApplied,
      ),
      plaque: examinationResult.plaque,
      calculus: examinationResult.calculus,
      gingivitis: examinationResult.gingivitis,
      parodontitis: examinationResult.parodontitis,
    };
  }

  if (examinationResult?.type === "fluoridation") {
    return {
      dentitionType: "",
      oralHygieneStatus: "",
      mihStatus: "",
      orthodonticFindings: [],
      orthodonticStatus: "",
      fluorideVarnishApplied: parseOptionalValue(
        examinationResult.fluorideVarnishApplied,
      ),
      plaque: false,
      calculus: false,
      gingivitis: false,
      parodontitis: false,
    };
  }

  return {
    dentitionType: defaultDentitionType ?? "",
    oralHygieneStatus: "",
    mihStatus: "",
    orthodonticFindings: [],
    orthodonticStatus: "",
    fluorideVarnishApplied: "",
    plaque: false,
    calculus: false,
    gingivitis: false,
    parodontitis: false,
  };
}
