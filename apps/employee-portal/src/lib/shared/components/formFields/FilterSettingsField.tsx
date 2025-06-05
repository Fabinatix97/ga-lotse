/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useField } from "formik";

import {
  FilterDefinition,
  FilterSettings,
  FilterValue,
  UseFilterSettings,
  useFilterSettings,
} from "@eshg/lib-employee-portal";

import {
  UseFilterTemplateProps,
  useFilterTemplate,
} from "@/lib/shared/components/filterSettings/useFilterTemplate";

interface FilterSettingsFieldProps {
  name: string;
  definitions: FilterDefinition[];
  getUseFilterTemplateProps: (
    filterSettings: UseFilterSettings,
  ) => UseFilterTemplateProps;
}

export function FilterSettingsField(props: FilterSettingsFieldProps) {
  const [_field, meta, helpers] = useField<FilterValue[]>(props.name);

  const filterSettings = useFilterSettings({
    definitions: props.definitions,
    initialValues: meta.value,
    autoApply: true,
    onValuesSubmit: (values) => {
      void helpers.setValue(values);
    },
  });

  const filterTemplateProps = useFilterTemplate(
    props.getUseFilterTemplateProps(filterSettings),
  );

  return (
    <FilterSettings
      {...filterSettings.filterSettingsProps}
      filterTemplatesProps={filterTemplateProps}
    />
  );
}
