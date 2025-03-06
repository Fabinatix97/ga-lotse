/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  ApiLaboratoryTestExamination,
  ApiTextTemplateContext,
} from "@eshg/sti-protection-api";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  useUpsertLaboratoryTest,
  useUpsertLaboratoryTestOptions,
} from "@/lib/businessModules/stiProtection/api/mutations/examination";
import { TextareaFieldWithTextTemplates } from "@/lib/businessModules/stiProtection/components/textTemplates/TextareaFieldWithTextTemplates";
import {
  SidecarContainer,
  SidecarFormLayout,
} from "@/lib/businessModules/stiProtection/features/procedures/SidecarFormLayout";
import { TabStickyBottomButtonBar } from "@/lib/businessModules/stiProtection/features/procedures/TabStickyBottomButtonBar";
import { ExaminationTabNavPanel } from "@/lib/businessModules/stiProtection/features/procedures/examination/ExaminationTabNavPanel";
import { SectionGrid } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import { ConfirmLeaveDirtyFormEffect } from "@/lib/shared/components/form/ConfirmLeaveDirtyFormEffect";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

import {
  HepatitisLaboratoryTest,
  LaboratoryTestSamples,
  LaboratoryTestWithBooleanResult,
} from "./LaboratoryTestTemplates";
import {
  LaboratoryTestExaminationData,
  defaultLaboratoryTestExaminationFormValues,
  mapFormValuesToApi,
  mapToFormValues,
} from "./helpers";

interface LaboratoryTestExaminationProps {
  procedureId: string;
  laboratoryTestExamination: ApiLaboratoryTestExamination;
}

export function LaboratoryTestExamination(
  props: LaboratoryTestExaminationProps,
) {
  const { procedureId, laboratoryTestExamination: laboratoryTests } = props;
  const upsertLaboratoryTestOptions = useUpsertLaboratoryTestOptions({
    procedureId,
  });
  const upsertLaboratoryTests = useUpsertLaboratoryTest({ procedureId });

  function onSubmit(values: LaboratoryTestExaminationData) {
    return upsertLaboratoryTests.mutateAsync({
      laboratoryTests: mapFormValuesToApi(values),
    });
  }

  return (
    <Formik
      initialValues={
        laboratoryTests
          ? mapToFormValues(laboratoryTests)
          : defaultLaboratoryTestExaminationFormValues()
      }
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values }) => (
        <FormPlus sx={{ height: "100%" }}>
          <ConfirmLeaveDirtyFormEffect
            onSaveMutation={{
              mutationOptions: upsertLaboratoryTestOptions,
              variableSupplier: () => ({
                procedureId,
                laboratoryTests: mapFormValuesToApi(values),
              }),
            }}
          />
          <SidecarFormLayout>
            <Sheet sx={{ padding: 3 }}>
              <Stack gap={3}>
                <Typography level="h2">Labortests</Typography>
                <SectionGrid sx={{ gridTemplateColumns: "4fr 5f" }}>
                  <InputField name="sampleBarcode" label="Proben-Barcode" />
                </SectionGrid>
                <Divider />
                <Typography level="h3">Verordnete Tests</Typography>
                <LaboratoryTestWithBooleanResult
                  testRequestedPath="hivTestRequested"
                  label="HIV (Labortest)"
                  dataPath="hivTestData"
                />
                <Divider />
                <LaboratoryTestWithBooleanResult
                  testRequestedPath="syphilisTestRequested"
                  label="Syphilis (Labortest)"
                  dataPath="syphilisTestData"
                  bottomField={
                    <CheckboxField name="hadSyphilis" label="Hatte Syphilis" />
                  }
                />
                <Divider />
                <HepatitisLaboratoryTest
                  dataPath="hepATestData"
                  testRequestedPath="hepATestRequested"
                  label="Hepatitis A"
                  bottomField={<HepatitisInfo variant="A" />}
                />
                <Divider />
                <HepatitisLaboratoryTest
                  dataPath="hepBTestData"
                  testRequestedPath="hepBTestRequested"
                  label="Hepatitis B"
                  bottomField={<HepatitisInfo variant="B" />}
                />
                <Divider />
                <LaboratoryTestWithBooleanResult
                  dataPath="hepCTestData"
                  testRequestedPath="hepCTestRequested"
                  label="Hepatitis C"
                  bottomField={<HepatitisInfo variant="C" />}
                />
                <Divider />
                <LaboratoryTestSamples
                  dataPath="chlamydiaTestData"
                  testRequestedPath="chlamydiaTestRequested"
                  label="Chlamydia"
                />
                <Divider />
                <LaboratoryTestSamples
                  dataPath="gonorrheaTestData"
                  testRequestedPath="gonorrheaTestRequested"
                  label="Gonorrhoe"
                />
                <Divider />
                <LaboratoryTestSamples
                  dataPath="mycoplasmaTestData"
                  testRequestedPath="mycoplasmaTestRequested"
                  label="Mykoplasmen"
                />
                <Divider />
                <LaboratoryTestWithBooleanResult
                  testRequestedPath="cancerScreeningTestRequested"
                  label="Krebsvorsorge"
                  dataPath="cancerScreeningTestData"
                />
                <Divider />
                <LaboratoryTestWithBooleanResult
                  testRequestedPath="hpvTestRequested"
                  label="HPV-Abstrich"
                  dataPath="hpvTestData"
                />
                <Divider />
                <LaboratoryTestWithBooleanResult
                  testRequestedPath="mpoxTestRequested"
                  label="Mpox"
                  dataPath="mpoxTestData"
                />
                <Divider />
                <LaboratoryTestWithBooleanResult
                  testRequestedPath="otherTestRequested"
                  label="Sonstige Tests"
                  dataPath="otherTestData"
                  topField={<InputField name="otherTestName" label="Name" />}
                />
              </Stack>
            </Sheet>
            <SidecarContainer>
              <ExaminationTabNavPanel id={procedureId} />
              <ExaminationTabInfo />
            </SidecarContainer>
          </SidecarFormLayout>
          <TabStickyBottomButtonBar />
        </FormPlus>
      )}
    </Formik>
  );
}

function ExaminationTabInfo() {
  return (
    <Sheet>
      <Typography level={"h3"} mb={3}>
        Labortests
      </Typography>
      <Stack
        component="section"
        gap={3}
        aria-label={"Weitere Angaben zu den Labortests"}
      >
        <TextareaFieldWithTextTemplates
          name="generalRemarks"
          label="Allgemeine Bemerkungen"
          minRows={5}
          context={ApiTextTemplateContext.LaboratoryTestsRemark}
        />
        <CheckboxField name="testsConducted" label="Tests durchgeführt" />
        <CheckboxField name="testsPayed" label="Tests bezahlt" />
      </Stack>
    </Sheet>
  );
}

function HepatitisInfo({ variant }: { variant: "A" | "B" | "C" }) {
  return (
    <Alert
      color={"primary"}
      message={`Bei der Durchführung des Hepatits-${variant}-Tests muss eine Bescheinigung zur Meldepflicht ausgedruckt und von dem/der Bürger:in unterschrieben werden.`}
    />
  );
}
