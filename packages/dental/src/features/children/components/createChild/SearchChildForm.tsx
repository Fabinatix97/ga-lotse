/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddContact200Response } from "@eshg/base-api";
import {
  DefaultSearchPersonForm,
  DefaultSearchPersonFormFields,
  SchoolYearField,
  SearchPersonFormProps,
  SearchPersonFormValues,
  SelectContactField,
  formatInstitutionNameWithCategoryShort,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { SearchGroupField } from "@/components/group/SearchGroupField";
import { SCHOOL_OR_DAYCARE_CONTACT } from "@/config/contacts";

export interface SearchChildFormValues extends SearchPersonFormValues {
  schoolYear: OptionalFieldValue<number>;
  institution: ApiAddContact200Response | null;
  groupName: OptionalFieldValue<string>;
}

export function SearchChildForm(
  props: SearchPersonFormProps<SearchChildFormValues>,
) {
  return (
    <DefaultSearchPersonForm {...props}>
      <SchoolYearField
        name="schoolYear"
        label="Wählen Sie ein Schuljahr aus"
        required="Bitte ein Schuljahr angeben."
        range={{
          numberOfYearsInPast: 1,
          numberOfYearsInFuture: 1,
        }}
      />
      <SelectContactField
        name="institution"
        label="Einrichtung"
        categories={SCHOOL_OR_DAYCARE_CONTACT}
        required="Bitte eine Schule/Kita angeben."
        placeholder="Schule/Kita suchen"
        getOptionLabel={formatInstitutionNameWithCategoryShort}
      />
      <SearchGroupField
        name="groupName"
        label="Wählen Sie eine Gruppe aus"
        institutionId={props.values.institution?.id ?? ""}
        freeSolo
      />
      <DefaultSearchPersonFormFields />
    </DefaultSearchPersonForm>
  );
}
