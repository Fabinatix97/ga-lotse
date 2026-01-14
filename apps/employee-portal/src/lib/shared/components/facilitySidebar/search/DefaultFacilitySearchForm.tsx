/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { FormikProps } from "formik";
import { PropsWithChildren } from "react";

import { InputField, useValidateLength } from "@eshg/lib-portal";

import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";

export function DefaultFacilitySearchForm<
  TValues extends FacilitySearchFormValues,
>(props: PropsWithChildren<FormikProps<TValues>>) {
  const validateLength = useValidateLength();
  return (
    <Stack gap={2}>
      <InputField
        autoFocus
        name="name"
        label="Name der Einrichtung"
        required="Bitte den Namen der Einrichtung angeben"
        validate={validateLength(1, 300)}
      />
      {props.children}
    </Stack>
  );
}
