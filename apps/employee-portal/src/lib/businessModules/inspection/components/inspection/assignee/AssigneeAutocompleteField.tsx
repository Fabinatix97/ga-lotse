/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal";

import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";

interface AssigneeAutocompleteFieldProps {
  name: string;
  options: AutocompleteSelectOption[];
}

export function AssigneeAutocompleteField(
  props: Readonly<AssigneeAutocompleteFieldProps>,
) {
  return (
    <SingleAutocompleteField
      name={props.name}
      label="Bearbeiter:in zuweisen"
      placeholder="auswählen"
      options={props.options}
      required="Bitte einen Bearbeiter auswählen"
    />
  );
}
