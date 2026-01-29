/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CircularProgress } from "@mui/joy";
import { UseQueryResult } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { isDeepEqual } from "remeda";
import { useDebounce } from "use-debounce";

import {
  ApiPostalCodeAndCityResponse,
  PublicStreetApi,
  StreetApi,
} from "@eshg/base-api";

import {
  AnyStreetApi,
  useGetPostalCodeAndCityForStreet,
} from "../../api/queries/streets";
import { InputField, InputFieldProps } from "../formFields/InputField";

export interface MinimalAutocompleteAddressInputs {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

export interface AddressAutoFillFieldProps extends Omit<
  InputFieldProps,
  "options" | "loading" | "freeSolo" | "name"
> {
  name: "postalCode" | "city";
  fieldName: (key: keyof MinimalAutocompleteAddressInputs) => string;
  api: AnyStreetApi;
}

export function AddressAutoFillField(props: AddressAutoFillFieldProps) {
  const { setFieldValue, setFieldTouched } =
    useFormikContext<MinimalAutocompleteAddressInputs>();

  const query = useSuggestedPostalCodeAndCity(props.api, props.fieldName);

  const autofillValue = query.isSuccess ? query.data[props.name] : null;

  const formFieldName = props.fieldName(props.name);

  useEffect(() => {
    if (autofillValue) {
      void Promise.all([
        // It appears that using setFieldValue with two different fields simultaneously
        //  like we are doing here because the useEffect hook triggers at the same time
        //  in both instances of this component cause the form to validate with
        //  outdated values.
        //  Triggering the validation after using setFieldTouched seems to resolve
        //  this issue.
        setFieldValue(formFieldName, autofillValue, false),
        setFieldTouched(formFieldName, false, true),
      ]);
    }
  }, [autofillValue, formFieldName, setFieldTouched, setFieldValue]);

  return (
    <InputField
      name={formFieldName}
      label={props.label}
      endDecorator={query.isFetching && <CircularProgress size="sm" />}
      required={props.required}
      validate={props.validate}
    />
  );
}

function useSuggestedPostalCodeAndCity(
  api: PublicStreetApi | StreetApi,
  fieldName: (key: keyof MinimalAutocompleteAddressInputs) => string,
): UseQueryResult<
  ApiPostalCodeAndCityResponse | { city: null; postalCode: null }
> {
  const { getFieldMeta } = useFormikContext<MinimalAutocompleteAddressInputs>();

  const streetProps = getFieldMeta<MinimalAutocompleteAddressInputs["street"]>(
    fieldName("street"),
  );
  const houseNumberProps = getFieldMeta<
    MinimalAutocompleteAddressInputs["houseNumber"]
  >(fieldName("houseNumber"));
  const queryInputs = {
    street: streetProps.value,
    houseNumber: houseNumberProps.value,
  };

  // only query if inputs changed so we don't override outputs on form-load
  const initialInputs = useRef<
    { street: string; houseNumber: string } | undefined
  >(queryInputs);
  const hasChanged = !isDeepEqual(queryInputs, initialInputs.current);
  if (hasChanged) {
    initialInputs.current = undefined;
  }

  // don't query with invalid inputs
  const isValid = !streetProps.error && !houseNumberProps.error;

  // don't query on every keystroke
  const [street] = useDebounce(streetProps.value, 1000);
  const [houseNumber] = useDebounce(houseNumberProps.value, 1000);

  return useGetPostalCodeAndCityForStreet(
    api,
    { street, houseNumber },
    { enabled: hasChanged && isValid },
  );
}
