/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { PropsWithChildren } from "react";

import { CheckboxField, TextareaField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";

import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

import { RapidTestExaminationData } from "./helpers";

export interface RapidTestProps extends PropsWithChildren {
  name: string;
  label: string;
}

function RapidTest(props: RapidTestProps) {
  const { name, label } = props;
  const { getFieldMeta } = useFormikContext<RapidTestExaminationData>();

  function isTestRequested() {
    return getFieldMeta(name).value === true;
  }

  return (
    <Stack
      component="fieldset"
      aria-label={label}
      border={0}
      margin={0}
      padding={0}
      spacing={0}
      gap={1.25}
    >
      <Grid xxs={12} md={6} xxl={3} sx={{ paddingLeft: 0 }}>
        <CheckboxField name={name} label={label} />
      </Grid>
      {isTestRequested() ? (
        <FormGroupGrid>
          <Grid container xxs={12}>
            {props.children}
          </Grid>
        </FormGroupGrid>
      ) : undefined}
    </Stack>
  );
}

export interface RapidTestWithBooleanResultProps extends RapidTestProps {
  number: string;
  result: string;
  positiveFieldLabel?: string;
}

export function RapidTestWithBooleanResult(
  props: RapidTestWithBooleanResultProps,
) {
  const { getFieldMeta } = useFormikContext<RapidTestExaminationData>();
  const { name, label, number, result } = props;
  const positiveFieldLabel = props.positiveFieldLabel ?? "Positiv";

  function hasNumber() {
    const numberValue = getFieldMeta(number).value as string;
    return (
      numberValue !== null &&
      numberValue !== undefined &&
      !isEmptyString(numberValue.trim())
    );
  }

  return (
    <RapidTest label={label} name={name}>
      <Grid xxs={12} md={6} xxl={3}>
        <InputField name={number} label={"Nummer"} />
      </Grid>
      <Grid xxs={12} md={6} xxl={3}>
        <YesOrNoWithFollowUp
          name={result}
          label={"Ergebnis"}
          negativeLabel={"Negativ"}
          positiveLabel={positiveFieldLabel}
          required={hasNumber() ? "Bitte das Testergebnis angeben" : undefined}
        />
      </Grid>
    </RapidTest>
  );
}

export interface RapidTestWithTextResultProps extends RapidTestProps {
  result: string;
  positiveFieldLabel?: string;
}

export function RapidTestWithTextResult(props: RapidTestWithTextResultProps) {
  const { name, label, result } = props;

  return (
    <RapidTest label={label} name={name}>
      <Grid xxs={12} md={12} xxl={6}>
        <TextareaField name={result} label={"Ergebnis"} minRows={3} />
      </Grid>
    </RapidTest>
  );
}

export interface RapidTestWithUnitStringResultProps extends RapidTestProps {
  result: string;
  unitText: string;
}

export function RapidTestWithUnitStringResult(
  props: RapidTestWithUnitStringResultProps,
) {
  const { name, label, result, unitText } = props;

  return (
    <RapidTest label={label} name={name}>
      <Grid xxs={12} md={12} xxl={6}>
        <InputField name={result} label={unitText} />
      </Grid>
    </RapidTest>
  );
}
