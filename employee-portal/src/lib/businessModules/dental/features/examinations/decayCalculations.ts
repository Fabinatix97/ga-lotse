/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ScreeningExaminationResult } from "@eshg/dental";
import { ApiTooth } from "@eshg/dental-api";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { isDefined } from "remeda";

import { ScreeningExaminationResultWithDate } from "@/lib/businessModules/dental/features/examinations/DecayHistorySidebar";
import { DECAY_STATUS } from "@/lib/businessModules/dental/features/examinations/translations";
import { calculateDmftValuesForTeeth } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/actions/dmftValues";
import { TOOTH_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/constants";
import { createToothResult } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/factories";
import { calculateDecayRiskValue } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayRisk";
import { selectDecayStatus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayStatus";
import { selectDmftValues } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/dmftValues";
import { Tooth } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

export function calculateDecayRisk(
  result: ScreeningExaminationResultWithDate,
  dateOfBirth: Date,
) {
  const dmftValues = calculateDmftValues(result.resultWithDate.result);
  const selectedDmftValues = selectDmftValues({
    dmftValues,
  });
  const decayRisk = calculateDecayRiskValue(
    calculateAge(dateOfBirth, result.resultWithDate.dateAndTime),
    selectedDmftValues.primaryTeeth,
    selectedDmftValues.secondaryTeeth,
    dmftValues.secondaryTeeth.decayed,
  );
  return isDefined(decayRisk) ? displayBoolean(decayRisk) : "-";
}

export function calculateDecayStatus(
  result: ScreeningExaminationResultWithDate,
) {
  const dmftValues = calculateDmftValues(result.resultWithDate.result);
  const decayStatus = selectDecayStatus({ dmftValues });
  return decayStatus === undefined ? "-" : DECAY_STATUS[decayStatus];
}

function calculateDmftValues(result: ScreeningExaminationResult) {
  const toothDiagnoses: Tooth[] = Object.entries(result.toothDiagnoses).map(
    ([k, v]) =>
      ({
        type: "ToothWithDiagnosis",
        toothNumber: k as ApiTooth,
        toothType: TOOTH_TYPES[k as ApiTooth],
        isRemovable: false,
        mainResult: createToothResult(v.mainResult),
        secondaryResult1: createToothResult(v.secondaryResult1),
        secondaryResult2: createToothResult(v.secondaryResult2),
        previousResults: [],
      }) as Tooth,
  );
  return {
    primaryTeeth: calculateDmftValuesForTeeth(toothDiagnoses, "PRIMARY_TOOTH"),
    secondaryTeeth: calculateDmftValuesForTeeth(
      toothDiagnoses,
      "SECONDARY_TOOTH",
    ),
  };
}
