/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useFormikContext } from "formik";
import { useDebounce } from "use-debounce";

import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
} from "@eshg/lib-portal";

import { useAutocompleteStreetQuery } from "../../api/queries/streets";

type StreetFieldProps = Omit<
  SingleAutocompleteFieldProps,
  "options" | "loading" | "freeSolo"
>;

export function StreetField(props: StreetFieldProps) {
  const { getFieldProps } = useFormikContext();
  const { value } = getFieldProps<string>(props.name);
  const [streetQuery] = useDebounce(value, 100);

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
      loading={query.isLoading}
      fetching={query.isFetching}
      options={options}
      {...props}
    />
  );
}
