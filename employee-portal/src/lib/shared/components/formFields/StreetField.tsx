/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
} from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { useFormikContext } from "formik";
import { useDebounce } from "use-debounce";

import { useAutocompleteStreetQuery } from "@/lib/baseModule/api/queries/streets";

type StreetFieldProps = Omit<
  SingleAutocompleteFieldProps,
  "options" | "loading" | "freeSolo"
>;

export function StreetField(props: StreetFieldProps) {
  const { getFieldMeta, getFieldProps } = useFormikContext();
  const { value } = getFieldProps<string>(props.name);
  const { touched } = getFieldMeta<string>(props.name);
  const [streetQuery] = useDebounce(value, 100);

  const showLoading = touched || value.length > 0;

  const query = useAutocompleteStreetQuery(
    { street: streetQuery },
    { enabled: true },
  );

  const options = query.isSuccess
    ? query.data.elements.map((element) => ({
        value: element,
        label: element,
      }))
    : [];

  return (
    <SingleAutocompleteField
      freeSolo
      loading={query.isLoading && showLoading}
      options={options}
      {...props}
    />
  );
}
