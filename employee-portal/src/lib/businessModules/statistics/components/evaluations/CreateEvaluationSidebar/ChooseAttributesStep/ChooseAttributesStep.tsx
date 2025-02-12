/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Stack } from "@mui/joy";
import { useField } from "formik";
import { useMemo, useState } from "react";
import { groupBy } from "remeda";

import { ChooseAttributesStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/chooseAttributesStepFormModel";
import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@/lib/shared/components/SearchableGroups";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { CheckboxFieldProps } from "@/lib/shared/components/formFields/CheckboxField";

type SearchableCheckboxGroupItem = SearchableGroupItem & {
  checkboxFieldProps: CheckboxFieldProps;
};

export interface CategorizedFlatAttribute {
  category: string;
  baseCode?: string;
  code: string;
  name: string;
  key: string;
}

export interface ChooseAttributesStepProps
  extends SidebarStepContentProps<ChooseAttributesStepFormModel> {
  attributes: CategorizedFlatAttribute[];
  dataSourceName: string;
}

export function ChooseAttributesStep({
  fieldName,
  dataSourceName,
  attributes,
}: ChooseAttributesStepProps) {
  const selectedAttributeKeysFieldName = fieldName("selectedAttributeKeys");
  const [input, , helper] = useField<Set<string>>(
    selectedAttributeKeysFieldName,
  );

  // Make sure, that this expensive component is not re-rendered on value changed
  return useMemo(() => {
    const groupedAttributesWithoutReference = groupBy(
      attributes.filter(
        (attribute) => attribute.code !== "PROCEDURE_REFERENCE",
      ),
      (attribute) => attribute.category,
    );

    const searchableCheckboxGroups: SearchableGroup<SearchableCheckboxGroupItem>[] =
      Object.entries(groupedAttributesWithoutReference).map(
        ([category, attributes]) => ({
          name: category,
          inAccordion: true,
          items: attributes.flatMap((attribute) =>
            mapToCheckboxGroupItem(attribute, selectedAttributeKeysFieldName),
          ),
        }),
      );

    function onChange(value: string, checked: boolean) {
      // Avoid triggering validation of all checkboxes
      // And avoid rerendering by changing it inline
      if (checked) {
        input.value.add(value);
      } else {
        input.value.delete(value);
      }
      void helper.setValue(input.value, true);
    }

    return (
      <Stack>
        <SearchableGroups
          groups={searchableCheckboxGroups}
          label={dataSourceName}
          placeholder="Attribut suchen"
          startExpanded={searchableCheckboxGroups.length === 1}
          renderItem={(item) => (
            <CheckboxItem
              item={item}
              onChange={onChange}
              isChecked={(key: string) => input.value.has(key)}
            />
          )}
        />
      </Stack>
    );
  }, [
    dataSourceName,
    attributes,
    selectedAttributeKeysFieldName,
    input.value,
    helper,
  ]);
}

function mapToCheckboxGroupItem(
  attribute: CategorizedFlatAttribute,
  fieldName: string,
): SearchableCheckboxGroupItem | SearchableCheckboxGroupItem[] {
  return {
    key: attribute.key,
    searchableValue: attribute.name,
    checkboxFieldProps: {
      name: fieldName,
      representingValue: attribute.key,
      label: attribute.name,
    },
  };
}

function CheckboxItem({
  item,
  onChange,
  isChecked,
}: {
  item: SearchableCheckboxGroupItem;
  onChange: (value: string, checked: boolean) => void;
  isChecked: (key: string) => boolean;
}) {
  const [checked, setChecked] = useState(
    isChecked(item.checkboxFieldProps.representingValue!),
  );
  return (
    <Checkbox
      label={item.checkboxFieldProps.label}
      value={item.checkboxFieldProps.representingValue}
      checked={checked}
      onChange={(changeEvent) => {
        setChecked(changeEvent.currentTarget.checked);
        onChange(
          item.checkboxFieldProps.representingValue!,
          changeEvent.currentTarget.checked,
        );
      }}
    />
  );
}
