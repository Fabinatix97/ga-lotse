/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Stack } from "@mui/joy";
import { FormikProps } from "formik";
import { PropsWithChildren } from "react";

import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";

export function DefaultFacilitySearchForm<
  TValues extends FacilitySearchFormValues,
>(props: PropsWithChildren<FormikProps<TValues>>) {
  return (
    <Stack gap={2}>
      <InputField
        name={"name"}
        label={"Name der Einrichtung"}
        required={"Bitte den Namen der Einrichtung angeben"}
        validate={validateLength(1, 300)}
      />
      {props.children}
    </Stack>
  );
}
