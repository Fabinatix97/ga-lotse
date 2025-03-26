/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ExaminationResultWithDate,
  ScreeningExaminationResult,
  ToothDiagnoses,
} from "@eshg/dental";
import { ApiDecayStatus } from "@eshg/dental-api";
import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
} from "@eshg/lib-employee-portal";
import { Button, Stack } from "@mui/joy";
import { compareDesc } from "date-fns";
import { isDefined } from "remeda";

import {
  DecayHistoryTable,
  DecayTableValue,
} from "@/lib/businessModules/dental/features/examinations/DecayHistoryTable";
import {
  calculateDecayRisk,
  calculateDecayStatus,
} from "@/lib/businessModules/dental/features/examinations/decayCalculations";
import { DECAY_STATUS } from "@/lib/businessModules/dental/features/examinations/translations";

interface DecayHistorySidebarProps extends DrawerProps {
  dateOfExamination: Date;
  dateOfBirth: Date;
  currentDiagnoses: ToothDiagnoses;
  previousExaminationResults: ExaminationResultWithDate[];
}

export function DecayHistorySidebar(props: DecayHistorySidebarProps) {
  const currentExaminationResultWithDate: ScreeningExaminationResultWithDate = {
    resultWithDate: {
      result: {
        toothDiagnoses: props.currentDiagnoses,
      } as ScreeningExaminationResult,
      dateAndTime: props.dateOfExamination,
    },
  };

  const previousScreeningResults: ScreeningExaminationResultWithDate[] =
    props.previousExaminationResults
      .filter(
        (examination) =>
          isDefined(examination.result) &&
          examination.result.type === "screening",
      )
      .filter(
        (examination) =>
          examination.dateAndTime.getTime() !==
          props.dateOfExamination.getTime(),
      )
      .map((examination) => ({
        resultWithDate: {
          result: examination.result as ScreeningExaminationResult,
          dateAndTime: examination.dateAndTime,
        },
      }));

  const examinationResultsWithDate: ScreeningExaminationResultWithDate[] = [
    currentExaminationResultWithDate,
    ...previousScreeningResults,
  ].sort((a, b) =>
    compareDesc(a.resultWithDate.dateAndTime, b.resultWithDate.dateAndTime),
  );

  const decayRiskColumns: DecayTableValue[] = examinationResultsWithDate.map(
    (result) => {
      const decayRisk = calculateDecayRisk(result, props.dateOfBirth);
      return {
        date: result.resultWithDate.dateAndTime,
        decayValue: decayRisk,
        showWarning: decayRisk === "Ja",
      };
    },
  );
  const decayStatusColumns: DecayTableValue[] = examinationResultsWithDate.map(
    (result) => {
      const decayStatus = calculateDecayStatus(result);
      return {
        date: result.resultWithDate.dateAndTime,
        decayValue: decayStatus,
        showWarning:
          decayStatus === DECAY_STATUS[ApiDecayStatus.TreatmentRequired],
      };
    },
  );

  return (
    <>
      <SidebarContent title="Historie automatisierter Werte">
        <Stack gap={3}>
          <DecayHistoryTable
            title="Kariesrisiko"
            valueColumnName="Risiko"
            rows={decayRiskColumns}
          />
          <DecayHistoryTable
            title="Kariesstatus"
            valueColumnName="Status"
            rows={decayStatusColumns}
          />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              color="neutral"
              variant="soft"
              key="close"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}

export interface ScreeningExaminationResultWithDate {
  resultWithDate: {
    result: ScreeningExaminationResult;
    dateAndTime: Date;
  };
}
