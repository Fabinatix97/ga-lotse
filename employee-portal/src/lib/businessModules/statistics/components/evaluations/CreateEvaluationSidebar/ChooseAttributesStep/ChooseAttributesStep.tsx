/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { groupBy } from "remeda";

import { ChooseAttributeStepOrChooseEvaluationStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@/lib/shared/components/SearchableGroups";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import {
  CheckboxField,
  CheckboxFieldProps,
} from "@/lib/shared/components/formFields/CheckboxField";

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
  extends SidebarStepContentProps<ChooseAttributeStepOrChooseEvaluationStepFormModel> {
  attributes: CategorizedFlatAttribute[];
  dataSourceName: string;
}

export function ChooseAttributesStep(props: ChooseAttributesStepProps) {
  const groupedAttributesWithoutReference = groupBy(
    props.attributes.filter(
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
          mapToCheckboxGroupItem(
            attribute,
            props.fieldName("selectedAttributeKeys"),
          ),
        ),
      }),
    );

  return (
    <Stack>
      <SearchableGroups
        groups={searchableCheckboxGroups}
        label={props.dataSourceName}
        placeholder="Attribut suchen"
        startExpanded={searchableCheckboxGroups.length === 1}
        renderItem={(item) => <CheckboxField {...item.checkboxFieldProps} />}
      />
    </Stack>
  );
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
