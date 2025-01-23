/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDiagnosis,
  ApiStiProtectionProcedure,
  ApiTestType,
} from "@eshg/employee-portal-api/stiProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import {
  FieldArray,
  FieldArrayRenderProps,
  Formik,
  useFormikContext,
} from "formik";
import { PropsWithChildren } from "react";

import { useUpsertDiagnosis } from "@/lib/businessModules/stiProtection/api/mutations/diagnosis";
import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import {
  SidecarFormLayout,
  SidecarSheet,
} from "@/lib/businessModules/stiProtection/features/procedures/SidecarFormLayout";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { CheckboxGroupField } from "@/lib/shared/components/formFields/CheckboxGroupField";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

import {
  API_DIAGNOSIS_TEST_OPTIONS,
  DiagnosisFormData,
  MedicationFormData,
  mapApiToForm,
  mapFormToApi,
} from "./helpers";

const verticallyAlignWithRowInputFieldMargin = "27px";

export function DiagnosisForm({
  procedure,
  diagnosis,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
  diagnosis: ApiDiagnosis;
}>) {
  const snackbar = useSnackbar();
  const upsertDiagnosis = useUpsertDiagnosis(procedure.id, {
    onSuccess: () => {
      snackbar.confirmation("Die Diagnose wurde erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Diagnose konnte nicht gespeichert werden.");
    },
  });

  function onSubmit(values: DiagnosisFormData) {
    const diagnosis = mapFormToApi(values);
    return upsertDiagnosis.mutateAsync(diagnosis);
  }

  return (
    <Formik initialValues={mapApiToForm(diagnosis)} onSubmit={onSubmit}>
      <FormPlus style={{ height: "100%" }}>
        <SidecarFormLayout>
          <Sheet>
            <Stack gap={5}>
              <Typography level="h2">Diagnose</Typography>

              <SectionGrid defaultColumn={1}>
                <TextareaField name="results" label="Ergebnisse" />
              </SectionGrid>
              <FieldArray name="medications" render={MedicationsSection} />
              <TypesOfTestsSection />
            </Stack>
          </Sheet>

          <SidecarSheet>
            <Typography level="h3" mb={3}>
              Zusatzinfos
            </Typography>
            <Stack rowGap={5}>
              <TextareaField name="notes" label="Allgemeine Bemerkungen" />
              <CheckboxField name="resultsShared" label="Ergebnis mitgeteilt" />
            </Stack>
          </SidecarSheet>
        </SidecarFormLayout>
        <TabStickyBottomButtonBar procedure={procedure} />
      </FormPlus>
    </Formik>
  );
}

function TypesOfTestsSection() {
  const { values } = useFormikContext<DiagnosisFormData>();
  const hasOtherTypeOfTest = values.typesOfTests.includes(ApiTestType.Other);
  return (
    <SectionGrid defaultColumn={1}>
      <CheckboxGroupField
        name="typesOfTests"
        label="Art des Tests"
        options={API_DIAGNOSIS_TEST_OPTIONS}
        orientation="vertical"
      >
        {hasOtherTypeOfTest ? (
          <InputField
            name="otherTests"
            label="Bezeichnung des Tests"
            required="Bitte die Bezeichnung des Tests angeben."
          />
        ) : null}
      </CheckboxGroupField>
    </SectionGrid>
  );
}

const initialMedication: MedicationFormData = { name: "", dose: "", date: "" };
function MedicationsSection({ remove, push, form }: FieldArrayRenderProps) {
  const values = form.values as DiagnosisFormData;

  return (
    <SectionGrid
      defaultColumn={1}
      sx={{ rowGap: 3 }}
      breakpoint="xxl"
      id="medications-section-id"
    >
      <Typography level="title-md" aria-describedby="medications-section-id">
        Medikamente
      </Typography>
      {values.medications.map((_medication, index) => (
        <Row key={index} aria-label={`Medikament ${index + 1}`}>
          <InputField
            name={`medications.${index}.name`}
            label={`Name von Medikament ${index + 1}`}
            required="Bitte den Namen des Medikaments angeben."
            sx={{ minWidth: 200, flex: 1 }}
          />
          <InputField
            name={`medications.${index}.dose`}
            label="Dosis"
            required="Bitte die Medikamentendosis angeben."
            sx={{ minWidth: 150, flex: 1 }}
          />
          <DateField
            name={`medications.${index}.date`}
            label="Datum"
            required="Bitte das Verschreibungsdatum angeben."
            sx={{ width: 200 }}
          />
          <HiddenIfDisabled>
            <IconButton
              title={`Medikament ${index + 1} löschen`}
              color="danger"
              onClick={() => remove(index)}
              sx={{
                alignSelf: "start",
                marginTop: verticallyAlignWithRowInputFieldMargin,
              }}
            >
              <Delete />
            </IconButton>
          </HiddenIfDisabled>
        </Row>
      ))}
      <HiddenIfDisabled>
        <Button
          sx={{ width: "fit-content" }}
          startDecorator={<Add />}
          variant="plain"
          onClick={() => push(initialMedication)}
        >
          Medikament hinzufügen
        </Button>
      </HiddenIfDisabled>
    </SectionGrid>
  );
}

function HiddenIfDisabled({ children }: PropsWithChildren) {
  const disabled = useIsFormDisabled();
  if (disabled) {
    return null;
  }
  return children;
}
