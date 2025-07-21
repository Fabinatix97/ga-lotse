/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { endOfDay, isPast } from "date-fns";
import { Formik, useFormikContext } from "formik";
import { Ref } from "react";

import {
  DetailsColumn,
  DetailsItem,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  DateField,
  DetailsList,
  SelectField,
  SelectOption,
  SingleAutocompleteField,
  isNonEmptyString,
} from "@eshg/lib-portal";
import {
  ApiGetConcernsResponse,
  ApiProcedureStatus,
  ApiUser,
} from "@eshg/official-medical-service-api";

import { createPhysicianOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { SwitchField } from "@/lib/shared/components/formFields/SwitchField";

export const ALL_CATEGORIES_KEY = "ALL_CATEGORIES";

export interface AdditionalInfoFormValues {
  category?: string;
  concern?: string;
  physician?: string;
  cutOffDate?: string;
  sendEmailNotifications?: boolean;
}

interface AdditionalInfoFormProps {
  initialValues: AdditionalInfoFormValues;
  formRef: Ref<SidebarFormHandle>;
  procedureStatus: ApiProcedureStatus;
  allPhysicians: ApiUser[];
  allConcerns: ApiGetConcernsResponse;
  emailAddressesNumber: number;
  onCancel: () => void;
  onSubmit: (values: AdditionalInfoFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function AdditionalInfoForm(props: Readonly<AdditionalInfoFormProps>) {
  const categoryOptions = categoryOptionsFromConcernsResponse(
    props.allConcerns,
  );

  function validateCutOffDate(value: string) {
    if (isNonEmptyString(value) && isPast(endOfDay(value))) {
      return "Der Stichtag darf nicht in der Vergangenheit liegen.";
    }

    return undefined;
  }

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <DetailsList>
              <DetailsColumn gap={3}>
                <CategoryField
                  options={categoryOptions}
                  procedureStatus={props.procedureStatus}
                  category={props.initialValues.category}
                />
                <ConcernField
                  allConcernsResponse={props.allConcerns}
                  procedureStatus={props.procedureStatus}
                  concern={props.initialValues.concern}
                />
                <SingleAutocompleteField
                  label="Arzt/Ärztin"
                  name="physician"
                  options={createPhysicianOptions(props.allPhysicians)}
                />
                <DateField
                  label="Stichtag für Gutachten"
                  name="cutOffDate"
                  validate={validateCutOffDate}
                />
                {props.emailAddressesNumber > 0 && (
                  <SwitchField
                    label="E-Mail-Benachrichtigungen an Bürger:in"
                    name="sendEmailNotifications"
                  />
                )}
              </DetailsColumn>
            </DetailsList>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function CategoryField({
  options,
  procedureStatus,
  category,
}: Readonly<{
  options: SelectOption<string>[];
  procedureStatus: ApiProcedureStatus;
  category?: string;
}>) {
  return procedureStatus === ApiProcedureStatus.Draft ? (
    <SelectField
      name="category"
      label="Kategorie"
      options={options}
      required="Bitte eine Kategorie auswählen."
    />
  ) : (
    <DetailsItem label="Kategorie" value={category} />
  );
}

function ConcernField({
  allConcernsResponse,
  procedureStatus,
  concern,
}: Readonly<{
  allConcernsResponse: ApiGetConcernsResponse;
  procedureStatus: ApiProcedureStatus;
  concern?: string;
}>) {
  const {
    values: { category },
  } = useFormikContext<AdditionalInfoFormValues>();

  const options = category
    ? optionsFromConcernsResponse(allConcernsResponse, category)
    : [];

  return procedureStatus === ApiProcedureStatus.Draft ? (
    <SelectField
      name="concern"
      label="Anliegen"
      options={options}
      required="Bitte ein Anliegen auswählen."
    />
  ) : (
    <DetailsItem label="Anliegen" value={concern} />
  );
}

function optionsFromConcernsResponse(
  concernsResponse: ApiGetConcernsResponse,
  categoryKey: string,
): SelectOption<string>[] {
  return concernsResponse.categories
    .filter(
      (category) =>
        categoryKey === ALL_CATEGORIES_KEY || categoryKey === category.nameDe,
    )
    .flatMap((category) =>
      category.concerns.map((concern) => ({
        value: concern.nameDe,
        label: concern.nameDe,
      })),
    )
    .sort((c1, c2) => {
      if (c1.label > c2.label) {
        return 1;
      }
      if (c1.label < c2.label) {
        return -1;
      }
      return 0;
    });
}

function categoryOptionsFromConcernsResponse(
  concernsResponse: ApiGetConcernsResponse,
) {
  return [
    {
      value: ALL_CATEGORIES_KEY,
      label: "Alle Kategorien",
    },
    ...concernsResponse.categories.map((category) => ({
      value: category.nameDe,
      label: category.nameDe,
    })),
  ];
}
