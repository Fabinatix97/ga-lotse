/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { AlertProps } from "@eshg/lib-portal/components/Alert";
import { Formik, FormikErrors } from "formik";
import { ReactNode } from "react";
import { isNonNullish } from "remeda";

import { PersonCardContent } from "@/lib/baseModule/components/person/PersonCardContent";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface LegacyPersonSearchResultsProps {
  persons: ApiGetReferencePersonResponse[];
  title: string;
  header?: ReactNode;
  footer?: ReactNode;
  onSelectPerson: (person: ApiGetReferencePersonResponse) => Promise<void>;
  onCreatePerson?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
}

export function LegacyPersonSearchResults({
  persons,
  header,
  footer,
  onSelectPerson,
  onCreatePerson,
  onCancel,
  onBack,
  title,
}: LegacyPersonSearchResultsProps) {
  async function handleSubmit({ selected }: { selected: string | null }) {
    if (selected === null) return;
    const idx = Number(selected);
    if (idx >= 0 && idx < persons.length) {
      await onSelectPerson(persons[idx]!);
    }
  }

  function validate(values: { selected: string | null }) {
    const errors: Record<string, string> = {};
    if (values.selected === null) {
      if (isNonNullish(onCreatePerson)) {
        errors.selected = "Bitte Person auswählen oder neue Person anlegen.";
      } else {
        errors.selected = "Bitte Person auswählen.";
      }
    }
    return errors;
  }

  function getAlert(
    errors: FormikErrors<{ selected: null }>,
  ): AlertProps | undefined {
    if (errors.selected) {
      return {
        title: errors.selected,
        color: "danger",
      };
    }

    return undefined;
  }

  return (
    <Formik
      initialValues={{ selected: null }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      {({ isSubmitting, errors }) => (
        <SidebarForm>
          <SidebarContent
            title={title}
            header={header}
            footer={persons.length > 0 && footer}
            alert={getAlert(errors)}
          >
            {persons.length === 0 ? (
              <NoSearchResults
                info={"Keine Treffer"}
                buttonLabel={"Person neu anlegen"}
                onClick={onCreatePerson}
              />
            ) : (
              <RadioGroupField name="selected">
                {persons.map((person, idx) => (
                  <SelectableCard
                    key={person.firstName + person.lastName + idx}
                    value={idx}
                    sx={{ mb: 2 }}
                  >
                    <PersonCardContent person={person} />
                  </SelectableCard>
                ))}
              </RadioGroupField>
            )}
          </SidebarContent>

          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={"Weiter"}
              submitting={isSubmitting}
              onCancel={onCancel}
              onBack={onBack}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
