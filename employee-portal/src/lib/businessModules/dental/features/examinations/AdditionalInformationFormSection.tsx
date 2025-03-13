/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExaminationStatus } from "@eshg/dental";
import {
  ApiDentitionType,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticFinding,
  ApiOrthodonticStatus,
} from "@eshg/dental-api";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { SoftRequiredBooleanSelectField } from "@eshg/lib-portal/components/form/fieldVariants";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Chip, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useShallow } from "zustand/react/shallow";

import { ExaminationStatusChip } from "@/lib/businessModules/dental/features/examinations/ExaminationStatusChip";
import { useDentalExaminationStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/DentalExaminationStoreProvider";
import { selectDecayRiskValue } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayRisk";
import { selectDecayStatus } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/decayStatus";
import { selectDmftValues } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExaminationStore/selectors/dmftValues";
import { DENTITION_TYPE_OPTIONS } from "@/lib/businessModules/dental/features/prophylaxisSessions/options";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
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
          />
        )}
      </DetailsSection>
    </InformationSheet>
  );
}

function ScreeningFields(props: {
  participantDateOfBirth: Date;
  dateOfExamination: Date;
}) {
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

  const toggleDentition = useDentalExaminationStore(
    (state) => state.toggleDentition,
  );

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
          <SelectField
            name="orthodonticFindings"
            label="KFO-Anomalien"
            options={ORTHODONTIC_FINDINGS_OPTIONS}
            multiple={true}
            renderValue={(findings) =>
              findings.map((finding) => (
                <Chip
                  key={finding.value}
                  color="primary"
                  sx={{ marginRight: 0.5 }}
                >
                  {ORTHODONTIC_FINDINGS[finding.value as ApiOrthodonticFinding]}
                </Chip>
              ))
            }
          />
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
      <Typography component="h3" fontWeight={600}>
        Automatisierte Werte
      </Typography>
      <Stack direction="row" gap={3} sx={{ flexWrap: "wrap" }}>
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
