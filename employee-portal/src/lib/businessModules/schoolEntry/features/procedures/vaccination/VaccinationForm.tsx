/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiBooleanWithUnknown,
  ApiVaccinationSchemeValue,
  UpdateVaccinationStatusRequest,
} from "@eshg/employee-portal-api/schoolEntry";
import {
  SoftRequiredBooleanSelectField,
  SoftRequiredSelectField,
} from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import {
  FormProps,
  OptionalFieldValue,
  SetFieldValueHelper,
} from "@eshg/lib-portal/types/form";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Divider, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FieldArray, Formik, FormikHelpers } from "formik";
import { isDefined } from "remeda";

import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { SetAllNumberInput } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/SetAllNumberInput";
import {
  BOOLEAN_WITH_UNKNOWN_OPTIONS,
  VACCINATION_SCHEME_OPTIONS,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";
import {
  BOOLEAN_SELECT_STYLE,
  BOOLEAN_WITH_UNKNOWN_STYLE,
} from "@/lib/businessModules/schoolEntry/features/procedures/styles";
import { OtherVaccinationForm } from "@/lib/businessModules/schoolEntry/features/procedures/vaccination/OtherVaccinationForm";
import {
  VACCINATION_FIELD_STYLE,
  VaccinationField,
} from "@/lib/businessModules/schoolEntry/features/procedures/vaccination/VaccinationField";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { FormStack } from "@/lib/shared/components/form/FormStack";

export function emptyOtherVaccination(): OtherVaccinationValues {
  return {
    description: "",
    count: "",
  };
}

export interface VaccinationFormValues {
  vaccinationScheme: OptionalFieldValue<ApiVaccinationSchemeValue>;
  diphtheria: OptionalFieldValue<number>;
  tetanus: OptionalFieldValue<number>;
  pertussis: OptionalFieldValue<number>;
  hib: OptionalFieldValue<number>;
  polio: OptionalFieldValue<number>;
  hepatitisB: OptionalFieldValue<number>;
  pneumococcus: OptionalFieldValue<number>;
  mmr: OptionalFieldValue<number>;
  varicella: OptionalFieldValue<number>;
  meningococcusB: OptionalFieldValue<number>;
  meningococcusC: OptionalFieldValue<number>;
  rota: OptionalFieldValue<number>;
  tbe: OptionalFieldValue<number>;
  hepatitisA: OptionalFieldValue<number>;
  otherVaccinations: OtherVaccinationValues[];
  vaccinationPassPresented: OptionalFieldValue<boolean>;
  perkombiHbv: OptionalFieldValue<ApiBooleanWithUnknown>;
  measlesContraIndication: OptionalFieldValue<boolean>;
  measlesContraIndicationIsPermanent: OptionalFieldValue<boolean>;
  measlesContraIndicationUntil: string;
}

export interface OtherVaccinationValues {
  description: OptionalFieldValue<string>;
  count: OptionalFieldValue<number>;
}

interface NameLabel {
  name: string;
  label: string;
}

const VACCINATIONS: NameLabel[][] = [
  [
    { name: "diphtheria", label: "Diphtherie" },
    { name: "tetanus", label: "Tetanus" },
    { name: "pertussis", label: "Pertussis" },
    { name: "hib", label: "Hib" },
    { name: "polio", label: "Polio" },
    { name: "hepatitisB", label: "Hep. B" },
    { name: "pneumococcus", label: "Pneumokokken" },
  ],
  [
    { name: "mmr", label: "MMR" },
    { name: "varicella", label: "Varizellen" },
    { name: "meningococcusB", label: "Meningokokken B" },
    { name: "meningococcusC", label: "Meningokokken C" },
    { name: "rota", label: "Rota" },
    { name: "tbe", label: "FSME" },
    { name: "hepatitisA", label: "Hep. A" },
  ],
];

const FIXED_BUTTON_STYLE: SxProps = {
  width: "32px",
  height: "32px",
  marginTop: "auto",
};

interface VaccinationFormProps extends FormProps<VaccinationFormValues> {
  valuesToMutationBundle: (
    values: VaccinationFormValues,
  ) => MutationBundle<UpdateVaccinationStatusRequest>;
}

export function VaccinationForm(props: VaccinationFormProps) {
  const disabled = useIsFormDisabled();

  async function handleSubmit(
    formValues: VaccinationFormValues,
    helpers: FormikHelpers<VaccinationFormValues>,
  ) {
    await props.onSubmit(formValues);
    helpers.resetForm({ values: formValues });
  }

  function setAllInRow(
    value: OptionalFieldValue<number>,
    index: number,
    setFieldValue: SetFieldValueHelper,
  ) {
    VACCINATIONS[index]?.forEach((vaccination) => {
      void setFieldValue(vaccination.name, value);
    });
  }

  function validateContraIndicationValues(values: VaccinationFormValues) {
    if (
      isDefined(values.measlesContraIndicationUntil) &&
      !isEmptyString(values.measlesContraIndicationUntil) &&
      isDefined(values.measlesContraIndicationIsPermanent) &&
      values.measlesContraIndicationIsPermanent
    ) {
      return "Bitte nur eine Option angeben.";
    }

    return undefined;
  }

  return (
    <Formik initialValues={props.initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting, handleSubmit, setFieldValue }) => (
        <FormStack onSubmit={handleSubmit}>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={props.valuesToMutationBundle(values)}
          />
          <SoftRequiredSelectField
            name="vaccinationScheme"
            label="Impfschema"
            options={VACCINATION_SCHEME_OPTIONS}
            sx={{ " .MuiSelect-root": { width: "140px" } }}
            softRequired
          />
          {VACCINATIONS.map((vaccinations, index) => (
            <Stack
              gap={2}
              direction="row"
              key={index}
              data-testid={`allRow${index}`}
            >
              <SetAllNumberInput
                label="Alle"
                onChange={(value) => setAllInRow(value, index, setFieldValue)}
                sx={VACCINATION_FIELD_STYLE}
                validate={validateIntegerAnd(validateRange(0, 9))}
              />
              <Stack direction="row" gap={2} flexWrap="wrap">
                {vaccinations.map((vaccination) => (
                  <VaccinationField
                    key={vaccination.name}
                    name={vaccination.name}
                    label={vaccination.label}
                    softRequired
                  />
                ))}
              </Stack>
            </Stack>
          ))}
          <Stack direction="row" gap={3} flexWrap="wrap">
            <FieldArray name="otherVaccinations">
              {({ push, remove }) => (
                <>
                  {values.otherVaccinations.map((values, index) => (
                    <Stack
                      direction="row"
                      gap={2}
                      key={index}
                      data-testid="otherVaccinationForm"
                    >
                      <OtherVaccinationForm
                        name={`otherVaccinations.${index}`}
                        description={values.description}
                        count={values.count}
                      />
                      {!disabled && index > 0 && (
                        <Button
                          aria-label="Impfung löschen"
                          color="neutral"
                          variant="outlined"
                          size="sm"
                          sx={FIXED_BUTTON_STYLE}
                          onClick={() => remove(index)}
                        >
                          <DeleteOutlined />
                        </Button>
                      )}
                    </Stack>
                  ))}
                  {!disabled && (
                    <Button
                      color="neutral"
                      variant="outlined"
                      aria-label="Weitere Impfung hinzufügen"
                      size="sm"
                      sx={FIXED_BUTTON_STYLE}
                      onClick={() => push(emptyOtherVaccination())}
                    >
                      <Add />
                    </Button>
                  )}
                </>
              )}
            </FieldArray>
          </Stack>
          <SoftRequiredSelectField
            name="perkombiHbv"
            label="PerkombiHBV"
            options={BOOLEAN_WITH_UNKNOWN_OPTIONS}
            sx={BOOLEAN_WITH_UNKNOWN_STYLE}
            softRequired
          />
          <Divider />
          <SoftRequiredBooleanSelectField
            name="vaccinationPassPresented"
            label="Impfbuch vorgelegt"
            allowDeselection
            sx={BOOLEAN_SELECT_STYLE}
          />
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap">
            <SoftRequiredBooleanSelectField
              name="measlesContraIndication"
              label="Medizinische Kontraindikation gegen Masernimpfung besteht"
              allowDeselection
              sx={BOOLEAN_SELECT_STYLE}
            />
            {values.measlesContraIndication && (
              <>
                <SoftRequiredBooleanSelectField
                  name="measlesContraIndicationIsPermanent"
                  label="Ständig"
                  allowDeselection
                  validate={() => validateContraIndicationValues(values)}
                  sx={BOOLEAN_SELECT_STYLE}
                />
                <DateField
                  name="measlesContraIndicationUntil"
                  label="oder bis zum"
                  validate={() => validateContraIndicationValues(values)}
                  component={HorizontalField}
                />
              </>
            )}
          </Stack>
          <FormFooter isSubmitting={isSubmitting} />
        </FormStack>
      )}
    </Formik>
  );
}
