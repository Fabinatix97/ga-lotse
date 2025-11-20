/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Stack } from "@mui/joy";
import { Formik, FormikValues, useFormikContext } from "formik";
import { ChangeEvent, ReactNode } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { CheckboxField, SelectField } from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import {
  CONSULTATION_TYPE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../shared/constants";

import { AddNewProcedureForm, FieldProps } from "./useAddNewProcedureSidebar";

export function ConsultationDetailsStep({
  currentState,
  ...props
}: FieldProps) {
  return (
    <Layout initialValues={currentState} {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  const { values, setFieldValue } = useFormikContext<AddNewProcedureForm>();

  async function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const isChecked = e.target.checked;
    const currentLanguages = values?.languages;
    const german = ApiPersonLanguage.German;
    if (!currentLanguages) {
      await setFieldValue("languages", [german]);
      return;
    }
    if (isChecked) {
      await setFieldValue(
        "languages",
        currentLanguages.includes(german)
          ? currentLanguages
          : [...currentLanguages, german],
      );
      await setFieldValue("hasSufficientGermanLanguageSkills", true);
    } else {
      await setFieldValue(
        "languages",
        currentLanguages.filter((lang) => lang !== german),
      );
      await setFieldValue("hasSufficientGermanLanguageSkills", false);
    }
  }

  async function handleSelectChange(value: string[]) {
    const hasSufficientGermanLanguageSkills =
      values.hasSufficientGermanLanguageSkills;
    const selectedGerman = value.includes("GERMAN");
    if (hasSufficientGermanLanguageSkills && !selectedGerman) {
      await setFieldValue("hasSufficientGermanLanguageSkills", false);
    }
    if (!hasSufficientGermanLanguageSkills && selectedGerman) {
      await setFieldValue("hasSufficientGermanLanguageSkills", true);
    }
  }

  return (
    <Stack gap={2}>
      <CheckboxField
        name="hasSufficientGermanLanguageSkills"
        label="Ausreichende Deutschkenntnisse"
        onChange={handleCheckboxChange}
      />
      <SelectField
        name="languages"
        label="Gesprochene Sprachen"
        options={LANGUAGE_OPTIONS}
        renderValue={(modules) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {modules.map((option) => (
              <Chip key={option.value} color="primary">
                {option.label}
              </Chip>
            ))}
          </Stack>
        )}
        multiple
        onChange={handleSelectChange}
      />
      <SelectField
        name="consultationType"
        label="Art der Konsultation"
        options={CONSULTATION_TYPE_OPTIONS}
      />
    </Stack>
  );
}

interface LayoutProps<T> {
  children: ReactNode;
  handleNext: (newValues: T) => Promise<unknown> | void;
  handlePrev: () => void;
  initialValues: T & FormikValues;
  isOnLastStep: boolean;
  isOnFirstStep: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  isPending: boolean;
}
function Layout<T>({
  children,
  handleNext,
  handlePrev,
  initialValues,
  isOnLastStep,
  isOnFirstStep,
  onClose,
  title,
  subTitle,
  isPending,
}: LayoutProps<T>) {
  return (
    <Formik initialValues={initialValues} onSubmit={handleNext}>
      <SidebarForm>
        <SidebarContent title={title} subtitle={subTitle}>
          {children}
        </SidebarContent>
        <SidebarActions>
          <MultiFormButtonBar
            submitting={isPending}
            submitLabel={isOnLastStep ? "Erstellen" : "Weiter"}
            onCancel={onClose}
            onBack={isOnFirstStep ? undefined : handlePrev}
          />
        </SidebarActions>
      </SidebarForm>
    </Formik>
  );
}
