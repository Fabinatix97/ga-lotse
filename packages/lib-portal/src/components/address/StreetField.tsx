/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useFormikContext } from "formik";
import { useDebounce } from "use-debounce";

import {
  AnyStreetApi,
  useAutocompleteStreetQuery,
} from "../../api/queries/streets";
import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
} from "../formFields/autocomplete/SingleAutocompleteField";

export type StreetFieldProps = Omit<
  SingleAutocompleteFieldProps,
  "options" | "loading" | "freeSolo"
> & {
  api: AnyStreetApi;
};

export function StreetField(props: StreetFieldProps) {
  const { getFieldProps } = useFormikContext();
  const { value } = getFieldProps<string>(props.name);
  const [streetQuery] = useDebounce(value, 100);

  const query = useAutocompleteStreetQuery(
    props.api,
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
      loading={query.isLoading}
      fetching={query.isFetching}
      options={options}
      {...props}
    />
  );
}
