/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDecayStatus } from "@eshg/dental-api";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { isDefined } from "remeda";

import { DecayHistoryItem } from "@/lib/businessModules/dental/features/examinations/DecayHistorySidebar";
import { DECAY_STATUS } from "@/lib/businessModules/dental/features/examinations/translations";
import { calculateDmftValuesByDentitionType } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/actions/dmftValues";
import { calculateDecayRiskValue } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayRisk";
import { selectDecayStatus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayStatus";
import { selectDmftValues } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/dmftValues";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

import { DecayHistoryRow } from "./DecayHistoryTable";

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
    value: isDefined(hasDecayRisk) ? displayBoolean(hasDecayRisk) : EMPTY_VALUE,
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
