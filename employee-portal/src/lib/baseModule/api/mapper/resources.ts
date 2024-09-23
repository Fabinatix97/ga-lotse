/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddResourceRequest,
  ApiUpdateResourceRequest,
} from "@eshg/employee-portal-api/base";
import {
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal/helpers/form";

import { ResourceFormValues } from "@/lib/baseModule/components/resources/forms/ResourceForm";

export function mapAddResourceRequest(
  values: ResourceFormValues,
): ApiAddResourceRequest {
  return {
    type: mapRequiredValue(values.type),
    name: values.name.trim(),
    labelNames: values.labelNames,
    description: mapOptionalValue(values.description.trim()),
    articleNumber: mapOptionalValue(values.articleNumber.trim()),
  };
}

export function mapUpdateResourceRequest(
  values: ResourceFormValues,
): ApiUpdateResourceRequest {
  return {
    name: values.name.trim(),
    labelNames: values.labelNames.map((label) => label.trim()),
    articleNumber: mapOptionalValue(values.articleNumber.trim()),
    description: mapOptionalValue(values.description.trim()),
  };
}
