/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WarningAmberOutlined } from "@mui/icons-material";
import { Stack, TypographyProps, styled } from "@mui/joy";
import { compareDesc } from "date-fns";
import { isDefined } from "remeda";
import { useShallow } from "zustand/react/shallow";

import { ApiDecayStatus } from "@eshg/dental-api";
import {
  DetailsItem,
  formatBoolean,
  useSidebar,
} from "@eshg/lib-employee-portal";
import {
  calculateAge,
  formatOptional,
  formatOptionalKey,
} from "@eshg/lib-portal";

import {
  ExaminationResultWithDate,
  ScreeningExaminationResult,
} from "../../api/models/ExaminationResult";
import { useExaminationStore } from "../../stores/examination/ExaminationStoreProvider";
import { createDentitionByType } from "../../stores/examination/factories";
import { selectDecayRiskValue } from "../../stores/examination/selectors/decayRisk";
import { selectDecayStatus } from "../../stores/examination/selectors/decayStatus";
import { selectDmftValues } from "../../stores/examination/selectors/dmftValues";
import { Dentition } from "../../stores/examination/types";
import { DECAY_STATUS } from "../../translations/examination";

import { DecayHistoryItem, DecayHistorySidebar } from "./DecayHistorySidebar";
import {
  ExaminationSection,
  ExaminationSectionHeader,
  ExaminationSectionTitle,
  ExaminationTitleProps,
} from "./ExaminationSection";
import { OpenHistorySidebarButton } from "./OpenHistorySidebarButton";

const WarningIcon = styled(WarningAmberOutlined)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  verticalAlign: "middle",
}));

interface AutomatedValuesSectionProps {
  participantDateOfBirth: Date;
  dateOfExamination: Date;
  previousExaminations: ExaminationResultWithDate[];
}

export function AutomatedValuesSection(props: AutomatedValuesSectionProps) {
  const dmftValues = useExaminationStore(useShallow(selectDmftValues));
  const hasDecayRisk = useExaminationStore(
    useShallow(
      selectDecayRiskValue(
        calculateAge(props.participantDateOfBirth, props.dateOfExamination),
      ),
    ),
  );
  const decayStatus = useExaminationStore(useShallow(selectDecayStatus));
  const requiresTreatment = decayStatus === ApiDecayStatus.TreatmentRequired;
  const dentition = useExaminationStore((store) => store.dentition);
  const decayHistorySidebar = useSidebar({
    component: (drawerProps) => (
      <DecayHistorySidebar
        historyItems={resolveDecayHistoryItems(dentition, props)}
        dateOfBirth={props.participantDateOfBirth}
        onClose={drawerProps.onClose}
      />
    ),
  });

  return (
    <ExaminationSection
      title="Automatisierte Werte"
      titleComponent={(props) => (
        <AutomatedValuesHeader
          {...props}
          showWarning={hasDecayRisk === true || requiresTreatment}
          onOpenHistory={decayHistorySidebar.open}
        />
      )}
    >
      <Stack direction="row" gap={3} flexWrap="wrap">
        <DetailsItem
          label="Kariesrisiko"
          value={formatOptional(hasDecayRisk, formatBoolean)}
          slotProps={{
            value: markAsWarningIf(hasDecayRisk === true),
          }}
        />
        <DetailsItem
          label="Kariesstatus"
          value={formatOptionalKey(decayStatus, DECAY_STATUS)}
          slotProps={{
            value: markAsWarningIf(requiresTreatment),
          }}
        />
        <DetailsItem
          label="dmf-t/DMF-T"
          value={`${dmftValues.primaryTeeth}/${dmftValues.secondaryTeeth}`}
        />
      </Stack>
    </ExaminationSection>
  );
}

function markAsWarningIf(condition: boolean): TypographyProps {
  return { color: condition ? "danger" : undefined };
}

interface AutomatedValuesHeaderProps extends ExaminationTitleProps {
  showWarning: boolean;
  onOpenHistory: () => void;
}

function AutomatedValuesHeader(props: AutomatedValuesHeaderProps) {
  const { titleId, showWarning, children, onOpenHistory } = props;

  return (
    <ExaminationSectionHeader>
      <ExaminationSectionTitle titleId={titleId}>
        {children}
        {showWarning && <WarningIcon color="danger" />}
      </ExaminationSectionTitle>
      <OpenHistorySidebarButton onClick={onOpenHistory} />
    </ExaminationSectionHeader>
  );
}

function resolveDecayHistoryItems(
  currentDentition: Dentition,
  props: AutomatedValuesSectionProps,
): DecayHistoryItem[] {
  const currentHistoryItem: DecayHistoryItem = {
    dentition: currentDentition,
    dateOfExamination: props.dateOfExamination,
  };

  const previousHistoryItems: DecayHistoryItem[] = props.previousExaminations
    .filter((examination) =>
      isPreviousScreeningExamination(examination, props.dateOfExamination),
    )
    .map((examination) => ({
      dentition: createDentitionByType(
        examination.result.dentitionType,
        examination.result.toothDiagnoses,
      ),
      dateOfExamination: examination.dateAndTime,
    }));

  return [currentHistoryItem, ...previousHistoryItems].sort((a, b) =>
    compareDesc(a.dateOfExamination, b.dateOfExamination),
  );
}

interface ScreeningExaminationResultWithDate {
  result: ScreeningExaminationResult;
  dateAndTime: Date;
}

function isPreviousScreeningExamination(
  examination: ExaminationResultWithDate,
  currentDateOfExamination: Date,
): examination is ScreeningExaminationResultWithDate {
  return (
    isDefined(examination.result) &&
    examination.result.type === "screening" &&
    examination.dateAndTime.getTime() !== currentDateOfExamination.getTime()
  );
}
