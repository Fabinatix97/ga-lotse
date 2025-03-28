/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ExaminationResultWithDate,
  ExaminationStatus,
  ExaminationStatusChip,
  ScreeningExaminationResult,
} from "@eshg/dental";
import {
  ApiDentitionType,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticFinding,
  ApiOrthodonticStatus,
} from "@eshg/dental-api";
import {
  DetailsItem,
  DetailsSection,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Divider, Grid, Stack, Typography } from "@mui/joy";
import { compareDesc } from "date-fns";
import { isDefined } from "remeda";
import { useShallow } from "zustand/react/shallow";

import {
  DecayHistoryItem,
  DecayHistorySidebar,
} from "@/lib/businessModules/dental/features/examinations/DecayHistorySidebar";
import { OrthodonticFindingsField } from "@/lib/businessModules/dental/features/examinations/OrthodonticFindingsField";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { createDentitionByType } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/factories";
import { selectDecayRiskValue } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayRisk";
import { selectDecayStatus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayStatus";
import { selectDmftValues } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/dmftValues";
import { Dentition } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/types";
import { DENTITION_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { OpenHistorySidebarButton } from "@/lib/businessModules/dental/shared/OpenHistorySidebarButton";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

import {
  DECAY_STATUS,
  MIH_STATUS,
  ORAL_HYGIENE_STATUS,
  ORTHODONTIC_FINDINGS,
  ORTHODONTIC_STATUS,
} from "./translations";

export const ORAL_HYGIENE_STATUS_OPTIONS =
  buildEnumOptions<ApiOralHygieneStatus>(ORAL_HYGIENE_STATUS, true);

export const MIH_STATUS_OPTIONS = buildEnumOptions<ApiMihStatus>(
  MIH_STATUS,
  true,
);

export const ORTHODONTIC_STATUS_OPTIONS =
  buildEnumOptions<ApiOrthodonticStatus>(ORTHODONTIC_STATUS, true);

export const ORTHODONTIC_FINDINGS_OPTIONS =
  buildEnumOptions<ApiOrthodonticFinding>(ORTHODONTIC_FINDINGS);

export interface AdditionalInformationFormValues {
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  oralHygieneStatus?: OptionalFieldValue<ApiOralHygieneStatus>;
  mihStatus?: OptionalFieldValue<ApiMihStatus>;
  orthodonticFindings: ApiOrthodonticFinding[];
  orthodonticStatus?: OptionalFieldValue<ApiOrthodonticStatus>;
  fluorideVarnishApplied: OptionalFieldValue<boolean>;
  plaque: boolean;
  calculus: boolean;
  gingivitis: boolean;
  parodontitis: boolean;
}

interface AdditionalInformationFormSectionProps {
  screening: boolean;
  fluoridation: boolean;
  fluoridationConsentGiven?: boolean;
  status: ExaminationStatus;
  participantDateOfBirth: Date;
  dateOfExamination: Date;
  previousExaminations: ExaminationResultWithDate[];
}

export function AdditionalInformationFormSection(
  props: AdditionalInformationFormSectionProps,
) {
  const { screening, fluoridation, fluoridationConsentGiven, status } = props;

  return (
    <InformationSheet>
      <DetailsSection title="Zusatzinfos">
        <ExaminationStatusChip status={status} />
        {fluoridation && (
          <FluoridationField
            fluoridationConsentGiven={fluoridationConsentGiven}
          />
        )}
        {screening && (
          <ScreeningFields
            participantDateOfBirth={props.participantDateOfBirth}
            dateOfExamination={props.dateOfExamination}
            previousExaminations={props.previousExaminations}
          />
        )}
      </DetailsSection>
    </InformationSheet>
  );
}

interface ScreeningFieldsProps {
  participantDateOfBirth: Date;
  dateOfExamination: Date;
  previousExaminations: ExaminationResultWithDate[];
}

function ScreeningFields(props: ScreeningFieldsProps) {
  const dmftValues = useDentalExaminationStore(useShallow(selectDmftValues));
  const decayRisk = useDentalExaminationStore(
    useShallow(
      selectDecayRiskValue(
        calculateAge(props.participantDateOfBirth, props.dateOfExamination),
      ),
    ),
  );
  const decayStatus = useDentalExaminationStore(useShallow(selectDecayStatus));
  const hasResult = useDentalExaminationStore((store) => store.hasResult);
  const dentition = useDentalExaminationStore((store) => store.dentition);
  const toggleDentition = useDentalExaminationStore(
    (state) => state.toggleDentition,
  );
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
    <>
      <SelectField
        name="dentitionType"
        label="Gebisstyp"
        options={DENTITION_TYPE_OPTIONS}
        disabled={hasResult}
        hint={hasResult ? "Es wurden bereits Befunde eingetragen" : undefined}
        onChange={(value) => {
          toggleDentition(value as ApiDentitionType);
        }}
      />
      <Grid container spacing={3}>
        <Grid xxs={12} xxl={6}>
          <SelectField
            name="oralHygieneStatus"
            label="Mundhygienestatus"
            options={ORAL_HYGIENE_STATUS_OPTIONS}
          />
        </Grid>
        <Grid xxs={12} xxl={6}>
          <SelectField
            name="mihStatus"
            label="MIH-Status"
            options={MIH_STATUS_OPTIONS}
          />
        </Grid>
        <Grid xxs={12} xxl={6}>
          <OrthodonticFindingsField />
        </Grid>
        <Grid xxs={12} xxl={6}>
          <SelectField
            name="orthodonticStatus"
            label="KFO-Behandlung"
            options={ORTHODONTIC_STATUS_OPTIONS}
          />
        </Grid>
      </Grid>
      <Divider orientation="horizontal" />
      <Typography component="h3" fontWeight={600}>
        Parodontalstatus
      </Typography>
      <ParodontalCheckboxes />
      <Divider orientation="horizontal" />
      <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
        <Typography component="h3" fontWeight={600}>
          Automatisierte Werte
        </Typography>
        <OpenHistorySidebarButton
          onClick={decayHistorySidebar.open}
          name="Historie"
        />
      </Stack>
      <Stack direction="row" gap={3} flexWrap="wrap">
        <DetailsItem
          label="Kariesrisiko"
          value={decayRisk === undefined ? "-" : decayRisk ? "Ja" : "Nein"}
        />
        <DetailsItem
          label="Kariesstatus"
          value={decayStatus === undefined ? "-" : DECAY_STATUS[decayStatus]}
        />
        <DetailsItem
          label="dmf-t/DMF-T"
          value={`${dmftValues.primaryTeeth}/${dmftValues.secondaryTeeth}`}
        />
      </Stack>
    </>
  );
}

function resolveDecayHistoryItems(
  currentDentition: Dentition,
  props: ScreeningFieldsProps,
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

interface FluoridationFieldProps {
  fluoridationConsentGiven?: boolean;
}

function FluoridationField(props: FluoridationFieldProps) {
  if (!props.fluoridationConsentGiven) {
    return (
      <Alert
        color="warning"
        message="Keine Einverständniserklärung für die Fluoridierung."
      />
    );
  }

  return (
    <SoftRequiredBooleanSelectField
      name="fluorideVarnishApplied"
      label="Fluoridierung"
      orientation="vertical"
      softRequired
    />
  );
}

function ParodontalCheckboxes() {
  return (
    <Grid container spacing={2}>
      <Grid md={12} xl={6}>
        <CheckboxField name="plaque" label="Plaque" />
      </Grid>
      <Grid md={12} xl={6}>
        <CheckboxField name="calculus" label="Zahnstein" />
      </Grid>
      <Grid md={12} xl={6}>
        <CheckboxField name="gingivitis" label="Gingivitis" />
      </Grid>
      <Grid md={12} xl={6}>
        <CheckboxField name="parodontitis" label="Parodontitis" />
      </Grid>
    </Grid>
  );
}
