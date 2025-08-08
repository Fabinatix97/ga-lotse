/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CircularProgress } from "@mui/joy";
import { UseQueryResult } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { isDeepEqual } from "remeda";
import { useDebounce } from "use-debounce";

import { ApiPostalCodeAndCityResponse } from "@eshg/base-api";
import { InputField, InputFieldProps } from "@eshg/lib-portal";

import { useGetPostalCodeAndCityForStreet } from "../../api/queries/streets";

import { BaseAddressFormInputs } from "./addressForms";

interface AddressAutoFillFieldProps
  extends Omit<InputFieldProps, "options" | "loading" | "freeSolo" | "name"> {
  name: "postalCode" | "city";
  fieldName: (key: keyof BaseAddressFormInputs) => string;
}

export function AddressAutoFillField(props: AddressAutoFillFieldProps) {
  const { setFieldValue } = useFormikContext<BaseAddressFormInputs>();

  const query = useSuggestedPostalCodeAndCity(props.fieldName);

  const autofillValue = query.isSuccess ? query.data[props.name] : null;

  const formFieldName = props.fieldName(props.name);

  useEffect(() => {
    if (autofillValue) {
      void setFieldValue(formFieldName, autofillValue);
    }
  }, [autofillValue, formFieldName, setFieldValue]);

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
  fieldName: (key: keyof BaseAddressFormInputs) => string,
): UseQueryResult<
  ApiPostalCodeAndCityResponse | { city: null; postalCode: null }
> {
  const { getFieldMeta } = useFormikContext<BaseAddressFormInputs>();

  const streetProps = getFieldMeta<BaseAddressFormInputs["street"]>(
    fieldName("street"),
  );
  const houseNumberProps = getFieldMeta<BaseAddressFormInputs["houseNumber"]>(
    fieldName("houseNumber"),
  );
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
    { street, houseNumber },
    { enabled: hasChanged && isValid },
  );
}
