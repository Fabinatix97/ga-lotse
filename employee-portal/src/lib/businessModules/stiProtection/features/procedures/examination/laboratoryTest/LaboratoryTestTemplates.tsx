/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiHepatitisLaboratoryTest,
  ApiLaboratoryTest,
  ApiLaboratoryTestSamples,
} from "@eshg/employee-portal-api/stiProtection";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Divider, Grid, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useFormikContext } from "formik";
import { PropsWithChildren, ReactNode } from "react";

import {
  YesOrNoFieldData,
  YesOrNoWithFollowUp,
  mapBoolToYesOrNo,
  mapYesOrNoToBool,
} from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";
import {
  SectionGrid,
  SubRow,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import {
  areAllValuesUndefined,
  guardValue,
  mapOptionalBool,
  mapOptionalString,
} from "@/lib/businessModules/stiProtection/shared/helpers";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import { LaboratoryTestExaminationData } from "./LaboratoryTestExamination";

export interface LaboratoryTestData {
  value: string;
  result: YesOrNoFieldData;
  remark: string;
}

export const defaultLaboratoryTestFormData = {
  value: "",
  result: null,
  remark: "",
};

export function mapApiLaboratoryTestToFormData(
  responseData: ApiLaboratoryTest | undefined,
): LaboratoryTestData {
  if (responseData === undefined) {
    return defaultLaboratoryTestFormData;
  }
  return {
    value: responseData.value ?? "",
    result: mapBoolToYesOrNo(responseData.result),
    remark: responseData.remark ?? "",
  };
}

export function mapLaboratoryTestFormDataToApi(
  formData: LaboratoryTestData | null,
): ApiLaboratoryTest | undefined {
  if (formData === null) {
    return undefined;
  }

  const mappedValues = {
    value: mapOptionalString(formData.value),
    result: mapYesOrNoToBool(formData.result ?? ""),
    remark: mapOptionalString(formData.remark),
  };

  if (areAllValuesUndefined(mappedValues)) {
    return undefined;
  } else {
    return mappedValues;
  }
}

export interface HepatitisLaboratoryTestData extends LaboratoryTestData {
  infection?: boolean;
  vaccineTitre?: boolean;
}

export const defaultHepatitisLaboratoryTestFormData = {
  infection: false,
  vaccineTitre: false,
  value: "",
  result: null,
  remark: "",
};

export function mapApiHepatitisLaboratoryTestToFormData(
  responseData: ApiHepatitisLaboratoryTest | undefined,
): HepatitisLaboratoryTestData {
  if (responseData === undefined) {
    return defaultHepatitisLaboratoryTestFormData;
  }
  return {
    infection: responseData.infection ?? false,
    vaccineTitre: responseData.vaccineTitre ?? false,
    value: responseData.value ?? "",
    result: mapBoolToYesOrNo(responseData.result),
    remark: responseData.remark ?? "",
  };
}

export function mapHepatitisLaboratoryTestFormDataToApi(
  formData: HepatitisLaboratoryTestData | null,
): ApiHepatitisLaboratoryTest | undefined {
  if (formData === null) {
    return undefined;
  }

  const mappedValues = {
    infection: mapOptionalBool(formData.infection),
    vaccineTitre: mapOptionalBool(formData.vaccineTitre),
    value: mapOptionalString(formData.value),
    result: mapYesOrNoToBool(formData.result ?? ""),
    remark: mapOptionalString(formData.remark),
  };

  if (areAllValuesUndefined(mappedValues)) {
    return undefined;
  } else {
    return mappedValues;
  }
}

export interface LaboratoryTestSamplesData {
  oralSampleRequested: boolean;
  oralSampleData: LaboratoryTestData;
  urethralSampleRequested: boolean;
  urethralSampleData: LaboratoryTestData;
  analSampleRequested: boolean;
  analSampleData: LaboratoryTestData;
}

export const defaultLaboratoryTestSamplesFormData = {
  oralSampleRequested: false,
  oralSampleData: defaultLaboratoryTestFormData,
  urethralSampleRequested: false,
  urethralSampleData: defaultLaboratoryTestFormData,
  analSampleRequested: false,
  analSampleData: defaultLaboratoryTestFormData,
};

export function mapApiLaboratoryTestSamplesToFormData(
  responseData: ApiLaboratoryTestSamples | undefined,
): LaboratoryTestSamplesData {
  if (responseData === undefined) {
    return defaultLaboratoryTestSamplesFormData;
  }

  return {
    oralSampleRequested: responseData.oralSampleRequested ?? false,
    oralSampleData: mapApiLaboratoryTestToFormData(responseData.oralSampleData),
    urethralSampleRequested: responseData.urethralSampleRequested ?? false,
    urethralSampleData: mapApiLaboratoryTestToFormData(
      responseData.urethralSampleData,
    ),
    analSampleRequested: responseData.analSampleRequested ?? false,
    analSampleData: mapApiLaboratoryTestToFormData(responseData.analSampleData),
  };
}

export function mapLaboratoryTestSamplesFormDataToApi(
  formData: LaboratoryTestSamplesData | null,
): ApiLaboratoryTestSamples | undefined {
  if (formData === null) {
    return undefined;
  }

  const mappedValues = {
    oralSampleRequested: mapOptionalBool(formData.oralSampleRequested),
    oralSampleData: guardValue(
      formData.oralSampleRequested,
      mapLaboratoryTestFormDataToApi(formData.oralSampleData),
    ),
    urethralSampleRequested: mapOptionalBool(formData.urethralSampleRequested),
    urethralSampleData: guardValue(
      formData.urethralSampleRequested,
      mapLaboratoryTestFormDataToApi(formData.urethralSampleData),
    ),
    analSampleRequested: mapOptionalBool(formData.analSampleRequested),
    analSampleData: guardValue(
      formData.analSampleRequested,
      mapLaboratoryTestFormDataToApi(formData.analSampleData),
    ),
  };

  if (areAllValuesUndefined(mappedValues)) {
    return undefined;
  } else {
    return mappedValues;
  }
}

export interface LaboratoryTestProps extends PropsWithChildren {
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
      rowGap={2}
      sx={{ ...props.sx }}
    >
      <Grid xxs={12} md={6} xxl={3} paddingLeft={0}>
        <CheckboxField name={testRequestedPath} label={label} />
      </Grid>
      {isTestRequested ? (
        <SectionGrid>{props.children}</SectionGrid>
      ) : undefined}
    </Stack>
  );
}

export interface LaboratoryTestWithBooleanResultProps
  extends LaboratoryTestProps {
  dataPath: string;
  positiveFieldLabel?: string;
  topField?: ReactNode;
  bottomField?: ReactNode;
}

export function LaboratoryTestWithBooleanResult(
  props: LaboratoryTestWithBooleanResultProps,
) {
  const { testRequestedPath, label, dataPath } = props;
  const positiveFieldLabel = props.positiveFieldLabel ?? "Positiv";

  return (
    <LaboratoryTest label={label} testRequestedPath={testRequestedPath}>
      {props.topField ? (
        <Grid paddingLeft={0} sx={{ gridColumn: 1 }}>
          {props.topField}
        </Grid>
      ) : undefined}
      <SubRow sx={{ gridColumn: 1 }}>
        <YesOrNoWithFollowUp
          name={`${dataPath}.result`}
          label={"Ergebnis"}
          negativeLabel={"Negativ"}
          positiveLabel={positiveFieldLabel}
        />
        <InputField
          sx={{ gridColumn: 2 }}
          name={`${dataPath}.value`}
          label={"Wert"}
        />
      </SubRow>
      <TextareaField
        sx={{ gridColumn: 1 }}
        name={`${dataPath}.remark`}
        label={"Bemerkung"}
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

export interface HepatitsLaboratoryTestProps extends LaboratoryTestProps {
  dataPath: string;
  bottomField?: ReactNode;
}

export function HepatitisLaboratoryTest(props: HepatitsLaboratoryTestProps) {
  const { testRequestedPath, label, dataPath } = props;

  return (
    <LaboratoryTest label={label} testRequestedPath={testRequestedPath}>
      <SubRow sx={{ gridColumn: 1 }}>
        <YesOrNoWithFollowUp
          name={`${dataPath}.result`}
          label={"Ergebnis"}
          negativeLabel={"Negativ"}
          positiveLabel={"Positiv"}
        />
        <InputField
          sx={{ gridColumn: 2 }}
          name={`${dataPath}.value`}
          label={"Wert"}
        />
      </SubRow>
      <SubRow sx={{ gridColumn: 1, display: "flex" }}>
        <CheckboxField name={`${dataPath}.infection`} label={"Infektion"} />
        <CheckboxField name={`${dataPath}.vaccineTitre`} label={"Impftiter"} />
      </SubRow>
      <TextareaField
        sx={{ gridColumn: 1 }}
        name={`${dataPath}.remark`}
        label={"Bemerkung"}
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

export interface LaboratorySamplesTestProps extends LaboratoryTestProps {
  dataPath: string;
}

export function LaboratoryTestSamples(props: LaboratorySamplesTestProps) {
  const { testRequestedPath, label } = props;
  const { getFieldMeta } = useFormikContext<LaboratoryTestExaminationData>();
  const isTestRequested = getFieldMeta(testRequestedPath).value === true;

  return (
    <Stack
      component="fieldset"
      aria-label={`${label}-TestSamples`}
      border={0}
      margin={0}
      padding={0}
      spacing={0}
      rowGap={2}
    >
      <Grid xxs={12} md={6} xxl={3} paddingLeft={0}>
        <CheckboxField name={testRequestedPath} label={label} />
      </Grid>
      {isTestRequested ? (
        <Stack paddingLeft={5} rowGap={3}>
          <LaboratoryTestWithBooleanResult
            sx={{ gridColumn: 1 }}
            testRequestedPath={`${props.dataPath}.oralSampleRequested`}
            dataPath={`${props.dataPath}.oralSampleData`}
            label={"Orale Probe"}
          />
          <Divider />
          <LaboratoryTestWithBooleanResult
            sx={{ gridColumn: 1 }}
            testRequestedPath={`${props.dataPath}.urethralSampleRequested`}
            dataPath={`${props.dataPath}.urethralSampleData`}
            label={"Urethrale Probe"}
          />
          <Divider />
          <LaboratoryTestWithBooleanResult
            sx={{ gridColumn: 1 }}
            testRequestedPath={`${props.dataPath}.analSampleRequested`}
            dataPath={`${props.dataPath}.analSampleData`}
            label={"Anale Probe"}
          />
        </Stack>
      ) : undefined}
    </Stack>
  );
}
