/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Divider, Grid } from "@mui/joy";

import { ApiInspectionSampleEvaluationType } from "@eshg/inspection-api";
import { DateTimeField } from "@eshg/lib-employee-portal";
import {
  FormPlus,
  InputField,
  SelectField,
  SelectObjectFieldValue,
} from "@eshg/lib-portal";

import { InspectionActorSelection } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionActorSelection";
import { InspectionSampleSidebarFormType } from "@/lib/businessModules/inspection/components/inspection/measurements/sampleSidebar/InspectionSampleSidebarHelper";
import {
  EVALUATION_TYPE_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
} from "@/lib/businessModules/inspection/shared/constants";

interface InspectionSampleSidebarBasisDataProps {
  values: InspectionSampleSidebarFormType;
  onSelfAssignEvaluatingActor: () => void;
  onFacilityAssignEvaluatingActor: () => void;
  onSelfAssignSamplingActor: () => void;
  onFacilityAssignSamplingActor: () => void;
  onSamplingActorSelection?: (
    value: SelectObjectFieldValue<
      {
        label: string;
        value: string;
      },
      false
    >,
  ) => void;
  onEvaluatingActorSelection?: (
    value: SelectObjectFieldValue<
      {
        label: string;
        value: string;
      },
      false
    >,
  ) => void;
}

export function InspectionSampleSidebarBasisData({
  values,
  onSelfAssignEvaluatingActor,
  onFacilityAssignEvaluatingActor,
  onSelfAssignSamplingActor,
  onFacilityAssignSamplingActor,
  onSamplingActorSelection,
  onEvaluatingActorSelection,
}: InspectionSampleSidebarBasisDataProps) {
  return (
    <Grid container component={FormPlus} spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xxs={12}>
        <InputField
          name="pointOfWithdrawal"
          type="text"
          label="Entnahmestelle"
          required="Bitte eine Entnahmestelle eingeben"
        />
      </Grid>
      <Grid xxs={12}>
        <SelectField
          name="typeOfSample"
          label="Art der Probe"
          options={SAMPLE_TYPE_OPTIONS}
          required="Bitte Art der Probe auswählen"
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name="nameOfSamplingPoint"
          type="text"
          label="Name der Probennahmestelle"
          required="Bitte Namen der Probennahmestelle eingeben"
        />
      </Grid>
      <Grid xxs={12}>
        <SelectField
          name="evaluationType"
          label="Auswertungsart"
          options={EVALUATION_TYPE_OPTIONS}
          required="Bitte Auswertungsart auswählen"
        />
      </Grid>
      <Divider
        sx={{ marginBottom: 1, marginTop: 1, height: "1px", width: "100%" }}
      />
      <Grid xxs={12}>
        <InspectionActorSelection
          name="samplingActor"
          label="Probennehmer"
          required="Bitte Probennehmer eintragen"
          useLaboratories={false}
          onSelfAssign={onSelfAssignSamplingActor}
          onFacilityAssign={onFacilityAssignSamplingActor}
          onChange={onSamplingActorSelection}
        />
      </Grid>
      <Divider
        sx={{ marginBottom: 1, marginTop: 1, height: "1px", width: "100%" }}
      />
      <Grid xxs={12}>
        <InspectionActorSelection
          name="evaluatingActor"
          label="Auswerter"
          required="Bitte Auswerter eintragen"
          useLaboratories={
            values.evaluationType ===
            ApiInspectionSampleEvaluationType.Laboratory
          }
          onSelfAssign={onSelfAssignEvaluatingActor}
          onFacilityAssign={onFacilityAssignEvaluatingActor}
          onChange={onEvaluatingActorSelection}
        />
      </Grid>
      <Divider
        sx={{ marginBottom: 1, marginTop: 1, height: "1px", width: "100%" }}
      />
      <Grid xxs={12}>
        <DateTimeField
          name="timeOfSampling"
          label="Zeitpunkt der Probennahme"
        />
      </Grid>
      <Grid xxs={12}>
        <DateTimeField
          name="timeOfEvaluation"
          label="Zeitpunkt der Auswertung"
        />
      </Grid>
    </Grid>
  );
}
