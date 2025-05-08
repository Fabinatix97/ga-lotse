/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useFormikContext } from "formik";
import { useEffect } from "react";

import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";

import { useGetPostCodeAndCityForStreet } from "../../api/queries/streets";

interface StreetListeningFieldProps
  extends Omit<InputFieldProps, "options" | "loading" | "freeSolo"> {
  property: "postCode" | "city";
  street?: string;
}

export function StreetListeningField(props: StreetListeningFieldProps) {
  const { setFieldValue } = useFormikContext();

  const query = useGetPostCodeAndCityForStreet(
    { street: props.street },
    { enabled: true },
  );

  const postCodeFromStreet = query.isSuccess
    ? query.data[props.property]
    : null;

  useEffect(() => {
    if (postCodeFromStreet) {
      void setFieldValue(props.name, postCodeFromStreet);
    }
  }, [postCodeFromStreet, props.name, setFieldValue]);

  return (
    <InputField
      name={props.name}
      label={props.label}
      required={props.required}
      validate={props.validate}
    />
  );
}
