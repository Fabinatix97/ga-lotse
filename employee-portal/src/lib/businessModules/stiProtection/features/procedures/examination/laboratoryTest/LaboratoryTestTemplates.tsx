/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { PropsWithChildren, ReactNode } from "react";

import { Row } from "@eshg/lib-portal/components/Row";
import { CheckboxField } from "@eshg/lib-portal/components/formFields/CheckboxField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { TextareaField } from "@eshg/lib-portal/components/formFields/TextareaField";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";

import {
  SectionGrid,
  SubRow,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";

import { LaboratoryTestExaminationData } from "./helpers";

interface LaboratoryTestProps extends PropsWithChildren {
  testRequestedPath: string;
  label: string;
  sx?: SxProps;
}

function LaboratoryTest(props: LaboratoryTestProps) {
  const { testRequestedPath, label } = props;
  const { getFieldMeta } = useFormikContext<LaboratoryTestExaminationData>();
  const isTestRequested = getFieldMeta(testRequestedPath).value === true;

  return (
    <Stack
      component="fieldset"
      aria-label={label}
      border={0}
      margin={0}
      padding={0}
      spacing={0}
      rowGap={4}
      sx={{ ...props.sx }}
    >
      <Grid xxs={12} md={6} xxl={3} paddingLeft={0}>
        <CheckboxField
          name={testRequestedPath}
          label={
            <Typography component="span" fontWeight={600}>
              {label}
            </Typography>
          }
        />
      </Grid>
      {isTestRequested ? (
        <SectionGrid>{props.children}</SectionGrid>
      ) : undefined}
    </Stack>
  );
}

interface LaboratoryTestWithBooleanResultProps extends LaboratoryTestProps {
  dataPath: string;
  positiveFieldLabel?: string;
  topField?: ReactNode;
  middleField?: ReactNode;
  bottomField?: ReactNode;
}

export function LaboratoryTestWithBooleanResult(
  props: LaboratoryTestWithBooleanResultProps,
) {
  const {
    dataPath,
    label,
    testRequestedPath,
    middleField,
    topField,
    bottomField,
  } = props;
  const positiveFieldLabel = props.positiveFieldLabel ?? "Positiv";

  return (
    <LaboratoryTest label={label} testRequestedPath={testRequestedPath}>
      {topField && (
        <Grid paddingLeft={0} sx={{ gridColumn: 1 }}>
          {topField}
        </Grid>
      )}
      <SubRow sx={{ gridColumn: 1 }}>
        <YesOrNoWithFollowUp
          name={`${dataPath}.result`}
          label="Ergebnis"
          negativeLabel="Negativ"
          positiveLabel={positiveFieldLabel}
        />
        <InputField
          sx={{ gridColumn: 2 }}
          name={`${dataPath}.value`}
          label="Wert"
        />
      </SubRow>
      {middleField && (
        <Grid
          paddingLeft={0}
          paddingRight={0}
          sx={{ gridColumn: 1, gridColumnEnd: 3 }}
        >
          {middleField}
        </Grid>
      )}
      <TextareaField
        sx={{ gridColumn: 1 }}
        name={`${dataPath}.remark`}
        label="Bemerkung"
        minRows={2}
      />
      {bottomField && (
        <Grid
          paddingLeft={0}
          paddingRight={0}
          sx={{ gridColumn: 1, gridColumnEnd: 3 }}
        >
          {bottomField}
        </Grid>
      )}
    </LaboratoryTest>
  );
}

interface ImmunityLaboratoryTestProps extends LaboratoryTestProps {
  dataPath: string;
  bottomField?: ReactNode;
}

export function ImmunityLaboratoryTest(props: ImmunityLaboratoryTestProps) {
  const { testRequestedPath, label, dataPath } = props;

  return (
    <LaboratoryTest label={label} testRequestedPath={testRequestedPath}>
      <SubRow sx={{ gridColumn: 1 }}>
        <YesOrNoWithFollowUp
          name={`${dataPath}.result`}
          label="Ergebnis"
          negativeLabel="Negativ"
          positiveLabel="Positiv"
        />
        <InputField
          sx={{ gridColumn: 2 }}
          name={`${dataPath}.value`}
          label="Wert"
        />
      </SubRow>
      <SubRow sx={{ gridColumn: 1, display: "flex" }}>
        <CheckboxField name={`${dataPath}.infection`} label="Infektion" />
        <CheckboxField name={`${dataPath}.vaccineTitre`} label="Impftiter" />
      </SubRow>
      <TextareaField
        sx={{ gridColumn: 1 }}
        name={`${dataPath}.remark`}
        label="Bemerkung"
        minRows={2}
      />
      {props.bottomField ? (
        <Grid
          paddingLeft={0}
          paddingRight={0}
          sx={{ gridColumn: 1, gridColumnEnd: 3 }}
        >
          {props.bottomField}
        </Grid>
      ) : undefined}
    </LaboratoryTest>
  );
}

interface LaboratorySamplesTestProps extends LaboratoryTestProps {
  dataPath: string;
}

export function LaboratoryTestSamples(props: LaboratorySamplesTestProps) {
  const { label, testRequestedPath } = props;

  return (
    <LaboratoryTestWithBooleanResult
      topField={
        <Row>
          <CheckboxField
            name={`${props.dataPath}.oralSampleRequested`}
            label="Orale Probe"
          />
          <CheckboxField
            name={`${props.dataPath}.urethralSampleRequested`}
            label="Urethrale Probe"
          />
          <CheckboxField
            name={`${props.dataPath}.analSampleRequested`}
            label="Anale Probe"
          />
        </Row>
      }
      sx={{ gridColumn: 1 }}
      testRequestedPath={testRequestedPath}
      dataPath={props.dataPath}
      label={label}
    />
  );
}
