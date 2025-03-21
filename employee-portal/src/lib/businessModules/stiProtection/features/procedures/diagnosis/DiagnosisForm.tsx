/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Row } from "@eshg/lib-portal/components/Row";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  ApiDiagnosis,
  ApiStiProtectionProcedure,
  ApiTestType,
  ApiTextTemplateContext,
} from "@eshg/sti-protection-api";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import {
  FieldArray,
  FieldArrayRenderProps,
  Formik,
  useFormikContext,
} from "formik";
import { PropsWithChildren } from "react";

import {
  useUpsertDiagnosis,
  useUpsertDiagnosisOptions,
} from "@/lib/businessModules/stiProtection/api/mutations/diagnosis";
import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { TextareaFieldWithTextTemplates } from "@/lib/businessModules/stiProtection/components/textTemplates/TextareaFieldWithTextTemplates";
import {
  SidecarContainer,
  SidecarFormLayout,
} from "@/lib/businessModules/stiProtection/features/procedures/SidecarFormLayout";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { CheckboxGroupField } from "@/lib/shared/components/formFields/CheckboxGroupField";

import { useIcd10Sidebar } from "./Icd10Sidebar";
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
  const { id: procedureId } = procedure;
  const upsertDiagnosisOptions = useUpsertDiagnosisOptions({
    procedureId,
  });
  const upsertDiagnosis = useUpsertDiagnosis({ procedureId });

  function onSubmit(values: DiagnosisFormData) {
    const diagnosis = mapFormToApi(values);
    return upsertDiagnosis.mutateAsync({
      diagnosis,
    });
  }

  return (
    <Formik
      initialValues={mapApiToForm(diagnosis)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values }) => (
        <FormPlus sx={{ height: "100%" }}>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertDiagnosisOptions,
              variableSupplier: () => ({
                procedureId,
                diagnosis: mapFormToApi(values),
              }),
            }}
          />
          <SidecarFormLayout>
            <Sheet>
              <Stack gap={5}>
                <Typography level="h2">Diagnose</Typography>
                <SectionGrid defaultColumn={1}>
                  <TextareaFieldWithTextTemplates
                    name="results"
                    label="Ergebnisse"
                    context={ApiTextTemplateContext.DiagnosisResult}
                  />
                </SectionGrid>
                <FieldArray name="medications" render={MedicationsSection} />
                <FindingsSection />
                <TypesOfTestsSection />
              </Stack>
            </Sheet>
            <SidecarContainer>
              <AdditionalInfosSidecar />
              <ResultsCommunicatedSidecar />
            </SidecarContainer>
          </SidecarFormLayout>
          <TabStickyBottomButtonBar />
        </FormPlus>
      )}
    </Formik>
  );
}

function FindingsSection() {
  const {
    values: { findings },
    setFieldValue,
  } = useFormikContext<DiagnosisFormData>();
  const icd10Sidebar = useIcd10Sidebar();
  const hasFindings = (findings?.length ?? 0) > 0;

  function handleClickIcd10Code() {
    icd10Sidebar.open({
      initiallySelectedCodes: findings ?? [],
      onSubmit: async (selectedCodes) => {
        await setFieldValue("findings", selectedCodes);
      },
    });
  }

  return (
    <SectionGrid
      defaultColumn={1}
      sx={{ rowGap: 2 }}
      breakpoint="xxl"
      id="findings-section-id"
    >
      <Typography level="title-md" aria-describedby="findings-section-id">
        Befunde
      </Typography>
      <Stack
        aria-label="findings-section-icd-10-codes"
        direction="column"
        rowGap={1}
      >
        {findings?.map(({ code, title }) => (
          <Stack key={code} direction="row" aria-label="icd-10-code">
            <Typography
              aria-label="icd-10-code-id"
              mr={1}
            >{`${code}: `}</Typography>
            <Typography aria-label="icd-10-code-title">{title}</Typography>
          </Stack>
        ))}
      </Stack>
      <HiddenIfDisabled>
        <Button
          sx={{ width: "fit-content" }}
          startDecorator={hasFindings ? <Edit /> : <Add />}
          variant="plain"
          onClick={handleClickIcd10Code}
        >
          {hasFindings ? "Befund bearbeiten" : "Befund hinzufügen"}
        </Button>
      </HiddenIfDisabled>
    </SectionGrid>
  );
}

function ResultsCommunicatedSidecar() {
  return (
    <Sheet>
      <Typography level="h3" mb={3}>
        Ergebnis mitgeteilt
      </Typography>
      <Stack rowGap={3}>
        <Alert
          color="primary"
          message="Ändert den Laborstatus auf “Ergebnis mitgeteilt”"
        />
        <CheckboxField
          name="resultsShared"
          label="Ich habe dem Bürger/der Bürgerin alle Testergebnisse mitgeteilt."
        />
      </Stack>
    </Sheet>
  );
}

function AdditionalInfosSidecar() {
  return (
    <Sheet>
      <Typography level="h3" mb={3}>
        Zusatzinfos
      </Typography>
      <Stack rowGap={5}>
        <TextareaFieldWithTextTemplates
          name="notes"
          label="Allgemeine Bemerkungen"
          minRows={5}
          context={ApiTextTemplateContext.DiagnosisRemark}
        />
      </Stack>
    </Sheet>
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

function TypesOfTestsSection() {
  const { values } = useFormikContext<DiagnosisFormData>();
  const hasOtherTypeOfTest = values.typesOfTests.includes(ApiTestType.Other);
  return (
    <SectionGrid defaultColumn={1}>
      <CheckboxGroupField
        name="typesOfTests"
        label="Art der Tests"
        labelLevel="title-md"
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

function HiddenIfDisabled({ children }: PropsWithChildren) {
  const disabled = useIsFormDisabled();
  if (disabled) {
    return null;
  }
  return children;
}
