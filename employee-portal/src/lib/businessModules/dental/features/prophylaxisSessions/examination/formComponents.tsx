/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SoftRequiredBooleanSelectField,
  SoftRequiredSelectField,
} from "@eshg/lib-portal/components/form/fieldVariants";
import { SelectFieldProps } from "@eshg/lib-portal/components/formFields/SelectField";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { AdditionalInformationFormComponents } from "@/lib/businessModules/dental/features/examinations/AdditionalInformationFormSection";

export const ADDITIONAL_INFO_FORM_COMPONENTS: AdditionalInformationFormComponents =
  {
    SelectField: <
      TMultiple extends boolean,
      TOptionLabel extends string | ReactNode = string,
    >(
      props: SelectFieldProps<TMultiple, TOptionLabel>,
    ) => (
      <SoftRequiredSelectField<TMultiple, TOptionLabel>
        {...toSoftRequiredProps(props)}
      />
    ),
    BooleanSelectField: (props) => (
      <SoftRequiredBooleanSelectField {...toSoftRequiredProps(props)} />
    ),
  };

function toSoftRequiredProps<TProps extends { required?: string }>({
  required,
  ...props
}: TProps) {
  return {
    ...props,
    softRequired: isDefined(required),
    orientation: "vertical",
  } as const;
}
