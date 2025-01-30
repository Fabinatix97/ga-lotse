/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOralHygieneStatus } from "@eshg/dental-api";
import { Alert } from "@eshg/lib-portal/components/Alert";
import {
  BooleanSelectField,
  BooleanSelectFieldProps,
} from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import {
  SelectField,
  SelectFieldProps,
} from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { ReactNode } from "react";

import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

import { ORAL_HYGIENE_STATUS } from "./translations";

const DEFAULT_COMPONENTS: AdditionalInformationFormComponents = {
  SelectField,
  BooleanSelectField,
};

export const ORAL_HYGIENE_STATUS_OPTIONS =
  buildEnumOptions<ApiOralHygieneStatus>(ORAL_HYGIENE_STATUS, true);

export interface AdditionalInformationFormValues {
  oralHygieneStatus?: OptionalFieldValue<ApiOralHygieneStatus>;
  fluorideVarnishApplied: OptionalFieldValue<boolean>;
}

export interface AdditionalInformationFormComponents {
  SelectField: <
    TMultiple extends boolean = false,
    TOptionLabel extends string | ReactNode = string,
  >(
    props: SelectFieldProps<TMultiple, TOptionLabel>,
  ) => ReactNode;
  BooleanSelectField: (props: BooleanSelectFieldProps) => ReactNode;
}

interface AdditionalInformationFormSectionProps {
  screening: boolean;
  fluoridation: boolean;
  fluoridationConsentGiven?: boolean;
  components?: AdditionalInformationFormComponents;
}

export function AdditionalInformationFormSection(
  props: AdditionalInformationFormSectionProps,
) {
  const { screening, fluoridation, fluoridationConsentGiven, components } =
    props;

  const { SelectField, BooleanSelectField } = components ?? DEFAULT_COMPONENTS;

  return (
    <InformationSheet>
      <DetailsSection title="Zusatzinfos">
        {screening && (
          <SelectField
            name="oralHygieneStatus"
            label="Mundhygienestatus"
            options={ORAL_HYGIENE_STATUS_OPTIONS}
          />
        )}
        {fluoridation && (
          <FluoridationField
            component={BooleanSelectField}
            fluoridationConsentGiven={fluoridationConsentGiven}
          />
        )}
      </DetailsSection>
    </InformationSheet>
  );
}

interface FluoridationFieldProps {
  component: AdditionalInformationFormComponents["BooleanSelectField"];
  fluoridationConsentGiven?: boolean;
}

function FluoridationField(props: FluoridationFieldProps) {
  if (!props.fluoridationConsentGiven) {
    return (
      <Alert
        color="warning"
        message="Keine Einverständniserklärung für die Fluoridierung."
      />
    );
  }

  const FieldComponent = props.component;

  return (
    <FieldComponent
      name="fluorideVarnishApplied"
      label="Fluoridierung"
      required="Bitte angeben, ob fluoridiert wurde."
    />
  );
}
