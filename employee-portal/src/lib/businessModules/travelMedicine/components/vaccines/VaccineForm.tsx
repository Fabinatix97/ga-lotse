/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import {
  ApiDisease,
  ApiInventoryVaccineWithoutRmbiVaccine,
} from "@eshg/travel-medicine-api";
import { DeleteOutlined } from "@mui/icons-material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Grid, IconButton, Stack, Typography } from "@mui/joy";
import { FieldArray, Formik } from "formik";
import { Ref } from "react";

import { routes } from "@/lib/baseModule/shared/routes";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  validateBatchId,
  validateNonNegativeNumberWithAtMostTwoDecimalDigits,
  validatePositiveInteger,
} from "@/lib/shared/helpers/validators";

export interface VaccineFormLoadings {
  // We're currently unable to display the inventory vaccine select box when
  // editing a vaccine. The only problem is the inventory vaccine name of the
  // vaccine itself; the API only gets us those which are unused.
  // The ugly workaround: when editing we replace the select box with a button
  // which links to the inventory. :(

  currentInventoryVaccineId: string | undefined;
  diseases: ApiDisease[] | undefined; // undefined while loading
  unusedInventoryVaccines: ApiInventoryVaccineWithoutRmbiVaccine[] | undefined; // undefined while loading
}

export interface VaccineFormValues {
  name: string;
  diseaseId: string;
  inventoryVaccineId: string;
  fee: number;
  offsets: number[];
  currentBatchId?: string;

  loadings: VaccineFormLoadings;
  currentVaccineId: string | undefined;
}

interface VaccineFormProps {
  initialValues: VaccineFormValues;
  formRef: Ref<SidebarFormHandle>;
  title: string;
  submitButtonLabel: string;
  onSubmit: (values: VaccineFormValues) => Promise<void>;
  onCancel: () => void;
}

function mapDiseasesToOption(disease: ApiDisease) {
  return { value: disease.id, label: disease.name };
}

function mapInventoryVaccinesToOption(
  inventoryVaccine: ApiInventoryVaccineWithoutRmbiVaccine,
) {
  return {
    value: inventoryVaccine.id,
    label: inventoryVaccine.name + " (Inventar)",
  };
}

function validateForm(values: VaccineFormValues) {
  const errors = {
    offsets: [] as string[],
  };

  if (values.offsets.length <= 1) return undefined;

  for (let i = 1; i < values.offsets.length; i++) {
    if (values.offsets[i]! - values.offsets[i - 1]! <= 0) {
      errors.offsets[i] =
        `Der Abstand von der ${i + 2}. Impfung zur Erstimpfung muss größer sein als ${values.offsets[i - 1]} Wochen!`;
    }
  }
  return errors.offsets.length === 0 ? undefined : errors;
}

function diseasesSelect(loadings: Readonly<VaccineFormLoadings>) {
  let textHint: string | undefined = undefined;
  let textRequired: string | undefined = undefined;

  if (loadings.diseases === undefined) {
    textHint = "Verfügbare Krankheiten werden geladen...";
  } else if (loadings.diseases.length == 0) {
    textHint = "Es sind keine Krankheiten definiert.";
  } else {
    textRequired = "Bitte eine Krankheit auswählen";
  }
  return (
    <SelectField
      name="diseaseId"
      label="Krankheit"
      disabled={loadings.diseases === undefined}
      options={loadings.diseases?.map(mapDiseasesToOption) ?? []}
      hint={textHint}
      required={textRequired}
    />
  );
}

function inventoryVaccinesSelect(loadings: Readonly<VaccineFormLoadings>) {
  let textHint: string | undefined = undefined;
  let textRequired: string | undefined = undefined;

  // ugly workaround: in case we're editing a vaccine display a button, not the select box
  if (loadings.currentInventoryVaccineId !== undefined) {
    return (
      <InternalLinkButton
        href={routes.inventory.details(loadings.currentInventoryVaccineId)}
        startDecorator={<ListAltIcon />}
      >
        Inventar-Impfstoff
      </InternalLinkButton>
    );
  }

  if (loadings.unusedInventoryVaccines === undefined) {
    textHint = "Zuweisbare Inventar-Impfstoffe werden geladen...";
  } else if (loadings.unusedInventoryVaccines.length == 0) {
    textHint = "Alle Inventar-Impfstoffe sind bereits zugewiesen.";
    textRequired = "Bitte einen Inventar-Impfstoff auswählen";
  } else {
    textRequired = "Bitte einen Inventar-Impfstoff auswählen";
  }
  return (
    <SelectField
      name="inventoryVaccineId"
      label="Inventar-Impfstoff"
      disabled={loadings.unusedInventoryVaccines === undefined}
      options={
        loadings.unusedInventoryVaccines?.map(mapInventoryVaccinesToOption) ??
        []
      }
      hint={textHint}
      required={textRequired}
    />
  );
}

export function VaccineForm(props: Readonly<VaccineFormProps>) {
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize={true}
      onSubmit={props.onSubmit}
      validate={validateForm}
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <InputField
                name="name"
                label="Name"
                required="Bitte einen Namen angeben"
                validate={validateLength(0, 200)}
              />
              {diseasesSelect(props.initialValues.loadings)}
              {inventoryVaccinesSelect(props.initialValues.loadings)}
              <NumberField
                name="fee"
                label="Preis in €"
                min={0.0}
                validate={validateNonNegativeNumberWithAtMostTwoDecimalDigits}
                required={"Bitte einen Preis angeben"}
              />
              <InputField
                name="currentBatchId"
                label="Aktuelle Chargennummer"
                validate={validateBatchId}
              />
              <Stack gap={2} rowGap={2}>
                <FieldArray name="offsets">
                  {({ push, remove }) => (
                    <>
                      {values.offsets.map((value, index) => (
                        <Stack gap={2} rowGap={2} key={index}>
                          <Grid container columnSpacing={2} rowGap={2}>
                            <Grid xs={12}>
                              <Typography level="title-md">
                                {index + 2}. Impfung
                              </Typography>
                            </Grid>
                            <Grid xs={11}>
                              <NumberField
                                name={`offsets[${index}]`}
                                min={1.0}
                                label={`Abstand in Wochen zwischen der 1. und ${index + 2}. Impfung`}
                                required="Bitte den Abstand zwischen Impfungen in (ganzen) Wochen angeben"
                                validate={validatePositiveInteger}
                              />
                            </Grid>
                            <Grid xs={1} pl={0} sx={{ paddingTop: "28px" }}>
                              <IconButton
                                sx={{
                                  "--IconButton-size":
                                    "var(--Input-minHeight, 2rem)",
                                }}
                                aria-label={`Entfernen`}
                                color="danger"
                                variant="outlined"
                                onClick={() => remove(index)}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Stack>
                      ))}

                      <FormAddMoreButton
                        onClick={() =>
                          push(
                            values.offsets.length == 0
                              ? 1
                              : values.offsets[values.offsets.length - 1]! + 1,
                          )
                        }
                      >
                        Weitere notwendige Impfung hinzufügen
                      </FormAddMoreButton>
                    </>
                  )}
                </FieldArray>
              </Stack>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitButtonLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
