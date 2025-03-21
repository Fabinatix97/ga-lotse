/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultPersonFormValues } from "@eshg/lib-employee-portal";
import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";
import { useFormikContext } from "formik";
import { useEffect } from "react";

import { useGetPostCodeAndCityForStreet } from "@/lib/baseModule/api/queries/streets";

type PostcodeFieldProps = Omit<
  InputFieldProps,
  "options" | "loading" | "freeSolo"
> & { property: "postCode" | "city" };

export function StreetListeningField(props: PostcodeFieldProps) {
  const { values, setFieldValue } = useFormikContext<DefaultPersonFormValues>();

  const query = useGetPostCodeAndCityForStreet(
    { street: values.contactAddress?.street },
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
