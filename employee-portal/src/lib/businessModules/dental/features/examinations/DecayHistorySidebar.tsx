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
import { ApiTooth } from "@eshg/dental-api";
import { DataTable, TableSheet } from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { Button, Stack, Typography } from "@mui/joy";
import {
  CellContext,
  ColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";
import { compareDesc } from "date-fns";
import { isDefined } from "remeda";

import { DECAY_STATUS } from "@/lib/businessModules/dental/features/examinations/translations";
import { calculateDmftValuesForTeeth } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/actions/dmftValues";
import { TOOTH_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/constants";
import { createToothResult } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/factories";
import { calculateDecayRiskValue } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayRisk";
import { selectDecayStatus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayStatus";
import { selectDmftValues } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/dmftValues";
import { Tooth } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

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

  return (
    <>
      <SidebarContent title="Historie automatisierter Werte">
        <Stack gap={3}>
          <DecayHistoryTable
            title="Kariesrisiko"
            dateOfBirth={props.dateOfBirth}
            examinationResultsWithDate={examinationResultsWithDate}
            columns={[
              columnHelper.accessor("resultWithDate", {
                header: "Risiko",
                cell: (
                  columnProps: CellContext<
                    ScreeningExaminationResultWithDate,
                    {
                      result: ScreeningExaminationResult;
                      dateAndTime: Date;
                    }
                  >,
                ) => {
                  const examinationResultWithDate = columnProps.getValue();
                  const dmftValues = calculateDmftValues(
                    examinationResultWithDate.result,
                  );
                  const selectedDmftValues = selectDmftValues({
                    dmftValues,
                  });
                  const decayRisk = calculateDecayRiskValue(
                    calculateAge(
                      props.dateOfBirth,
                      examinationResultWithDate.dateAndTime,
                    ),
                    selectedDmftValues.primaryTeeth,
                    selectedDmftValues.secondaryTeeth,
                    dmftValues.secondaryTeeth.decayed,
                  );
                  return isDefined(decayRisk) ? displayBoolean(decayRisk) : "-";
                },
                meta: {
                  width: 120,
                },
              }),
            ]}
          />
          <DecayHistoryTable
            title="Kariesstatus"
            dateOfBirth={props.dateOfBirth}
            examinationResultsWithDate={examinationResultsWithDate}
            columns={[
              columnHelper.accessor("resultWithDate.result", {
                header: "Status",
                cell: (
                  columnProps: CellContext<
                    ScreeningExaminationResultWithDate,
                    ScreeningExaminationResult
                  >,
                ) => {
                  const dmftValues = calculateDmftValues(
                    columnProps.getValue(),
                  );
                  const decayStatus = selectDecayStatus({ dmftValues });
                  return decayStatus === undefined
                    ? "-"
                    : DECAY_STATUS[decayStatus];
                },
                meta: {
                  width: 120,
                },
              }),
            ]}
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

interface ScreeningExaminationResultWithDate {
  resultWithDate: {
    result: ScreeningExaminationResult;
    dateAndTime: Date;
  };
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
const columnHelper = createColumnHelper<ScreeningExaminationResultWithDate>();

interface DecayTableProps {
  title: string;
  dateOfBirth: Date;
  examinationResultsWithDate: ScreeningExaminationResultWithDate[];
  columns:
    | ColumnDef<
        ScreeningExaminationResultWithDate,
        {
          result: ScreeningExaminationResult;
          dateAndTime: Date;
        }
      >[]
    | ColumnDef<
        ScreeningExaminationResultWithDate,
        ScreeningExaminationResult
      >[];
}

function DecayHistoryTable(props: DecayTableProps) {
  return (
    <TableSheet
      title={
        <Typography fontWeight={600} component={"h3"}>
          {props.title}
        </Typography>
      }
    >
      <DataTable
        data={props.examinationResultsWithDate}
        striped
        columns={[
          ...props.columns,
          columnHelper.accessor("resultWithDate.dateAndTime", {
            header: "Datum",
            cell: (
              columnProps: CellContext<
                ScreeningExaminationResultWithDate,
                Date
              >,
            ) => formatDate(columnProps.getValue()),
            meta: {
              width: 120,
            },
          }),
        ]}
        enableSortingRemoval={false}
      />
    </TableSheet>
  );
}
