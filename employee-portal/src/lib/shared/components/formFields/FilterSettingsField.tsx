/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useField } from "formik";

import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  UseFilterSettings,
  useFilterSettings,
} from "@/lib/shared/components/filterSettings/useFilterSettings";
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
