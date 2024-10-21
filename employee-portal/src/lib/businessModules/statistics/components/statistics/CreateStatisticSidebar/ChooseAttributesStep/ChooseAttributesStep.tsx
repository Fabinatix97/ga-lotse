/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ChangeEvent } from "react";
import { groupBy } from "remeda";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { CreateStatisticFromScratchFormModel } from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/createStatisticFromScratchFormModel";
import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@/lib/shared/components/SearchableGroups";
import {
  CheckboxField,
  CheckboxFieldProps,
} from "@/lib/shared/components/formFields/CheckboxField";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

type SearchableCheckboxGroupItem = SearchableGroupItem & {
  checkboxFieldProps: CheckboxFieldProps;
};

export interface CategorizedFlatAttribute {
  category: string;
  baseCode?: string;
  code: string;
  name: string;
}

export function ChooseAttributesStep(props: {
  attributes: CategorizedFlatAttribute[];
}) {
  const { values, setFieldValue } = useFormikContext<
    CreateStatisticFromScratchFormModel & {
      _selectedAttributeKeys: string[];
    }
  >();
  const groupedAttributes = groupBy(
    props.attributes,
    (attribute) => attribute.category,
  );

  const searchableCheckboxGroups: SearchableGroup<SearchableCheckboxGroupItem>[] =
    Object.entries(groupedAttributes).map(([category, attributes]) => ({
      name: category,
      inAccordion: true,
      items: attributes.flatMap(mapToCheckboxGroupItem),
    }));

  function setSelectedAttributes(event: ChangeEvent<HTMLInputElement>) {
    const attributeMap = new Map(
      props.attributes.map((it) => [mapAttributeToKey(it), it]),
    );
    const value = attributeMap.get(event.target.value)!;
    const checked = event.target.checked;

    let attributes = [];
    if (checked) {
      if (!values.selectedAttributes) {
        attributes = [value];
      } else {
        attributes = [...values.selectedAttributes, value];
      }
    } else {
      attributes = values.selectedAttributes!.filter(
        (it) => mapAttributeToKey(it) !== mapAttributeToKey(value),
      );
    }
    void setFieldValue("selectedAttributes", attributes, false);
  }

  return (
    <Stack>
      <SearchableGroups
        groups={searchableCheckboxGroups}
        label={
          businessModuleNames[
            mapToApiBusinessModule(values.dataSource!.businessModule)
          ]
        }
        placeholder="Attribut suchen"
        renderItem={(item) => (
          <CheckboxField
            {...item.checkboxFieldProps}
            onChange={setSelectedAttributes}
          />
        )}
      />
    </Stack>
  );
}

function mapAttributeToKey(attribute: CategorizedFlatAttribute) {
  return `${attribute.code}_${attribute.baseCode}`;
}

function mapToCheckboxGroupItem(
  attribute: CategorizedFlatAttribute,
): SearchableCheckboxGroupItem | SearchableCheckboxGroupItem[] {
  const key = mapAttributeToKey(attribute);
  return {
    key: key,
    searchableValue: attribute.name,
    checkboxFieldProps: {
      name: "_selectedAttributeKeys",
      representingValue: key,
      label: attribute.name,
    },
  };
}
