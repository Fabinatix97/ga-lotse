/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Divider, Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { groupBy } from "remeda";

import {
  SearchableGroup,
  SearchableGroupItem,
  SearchableGroups,
} from "@eshg/lib-employee-portal";
import { CheckboxFieldProps } from "@eshg/lib-portal";
import { ApiDataPrivacyCategory } from "@eshg/statistics-api";

import { AnonymizedFieldValue } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { ChooseAttributeStepOrConfigureDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { SlimInfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

type SearchableCheckboxGroupItem = SearchableGroupItem & {
  checkboxFieldProps: CheckboxFieldProps;
  dataPrivacyCategory?: ApiDataPrivacyCategory;
  maxQuasiIdentifierReached: boolean;
};

export interface CategorizedFlatAttribute {
  category: string;
  baseCode?: string;
  code: string;
  name: string;
  key: string;
  dataPrivacyCategory?: ApiDataPrivacyCategory;
}

interface ChooseAttributesStepProps
  extends SidebarStepContentProps<ChooseAttributeStepOrConfigureDataSourceStepFormModel> {
  attributes: CategorizedFlatAttribute[];
  dataSourceName: string;
  anonymized: AnonymizedFieldValue;
}

const MAX_AMOUNT_QUASI_IDENTIFYING = 5;

export function ChooseAttributesStep({
  fieldName,
  dataSourceName,
  attributes,
  anonymized,
}: ChooseAttributesStepProps) {
  const selectedAttributeKeysFieldName = fieldName("selectedAttributeKeys");
  const [input, , helper] = useField<string[]>(selectedAttributeKeysFieldName);

  const [
    amountSelectedQuasiIdentifyingAttributes,
    setAmountSelectedQuasiIdentifyingAttributes,
  ] = useState<number>(
    calculateAmountSelectedQuasiIdentifyingAttributes(attributes, input.value),
  );

  const onChange = useCallback(
    (value: string, checked: boolean) => {
      // Avoid triggering validation of all checkboxes
      // And avoid rerendering by changing it inline
      if (checked) {
        input.value.push(value);
      } else {
        input.value.splice(
          input.value.findIndex((it) => it === value),
          1,
        );
      }

      input.value.sort(sortByAttributeNumbering);
      void helper.setValue(input.value, true);

      if (anonymized === "yes") {
        setAmountSelectedQuasiIdentifyingAttributes(
          calculateAmountSelectedQuasiIdentifyingAttributes(
            attributes,
            input.value,
          ),
        );
      }
    },
    [
      input.value,
      helper,
      attributes,
      anonymized,
      setAmountSelectedQuasiIdentifyingAttributes,
    ],
  );

  // Make sure, that this expensive component is not re-rendered on value changed
  return useMemo(() => {
    const searchableCheckboxGroups = mapToSearchableCheckboxGroups(
      attributes,
      selectedAttributeKeysFieldName,
      amountSelectedQuasiIdentifyingAttributes,
    );
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
              isChecked={(key: string) => input.value.includes(key)}
              onChange={onChange}
            />
          )}
          renderGroup={(group, renderItems) => (
            <RenderGroup
              group={group}
              renderItems={renderItems}
              anonymized={anonymized}
              amountSelectedQuasiIdentifyingAttributes={
                amountSelectedQuasiIdentifyingAttributes
              }
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
    onChange,
    amountSelectedQuasiIdentifyingAttributes,
    anonymized,
  ]);
}

function RenderGroup({
  group,
  renderItems,
  anonymized,
  amountSelectedQuasiIdentifyingAttributes,
}: {
  group: SearchableGroup<SearchableCheckboxGroupItem>;
  renderItems: (items: SearchableCheckboxGroupItem[]) => ReactNode;
  anonymized: AnonymizedFieldValue;
  amountSelectedQuasiIdentifyingAttributes: number;
}) {
  if (anonymized === "no") {
    return renderItems(group.items);
  }

  const subGroups = Object.entries(
    groupBy(group.items, (it) => it.dataPrivacyCategory),
  ).map(([dataPrivacyCategory, items]) => ({
    label: mapDataPrivacyCategoryToLabel(
      dataPrivacyCategory as ApiDataPrivacyCategory,
      amountSelectedQuasiIdentifyingAttributes,
    ),
    items,
  }));

  if (subGroups.length === 0) {
    return renderItems(group.items);
  }

  return (
    <Stack gap={3} marginTop={1}>
      {subGroups.map((subGroup, index) => (
        <Stack key={subGroup.label.label}>
          <Stack flexDirection="row" gap={1} alignItems="center">
            <Typography level="title-md">{subGroup.label.label}</Typography>
            <SlimInfoIconTooltipButton
              infoText={subGroup.label.info}
              title="Hinweis"
            />
          </Stack>
          {renderItems(subGroup.items)}
          {index + 1 < subGroups.length && <Divider sx={{ marginTop: 1 }} />}
        </Stack>
      ))}
    </Stack>
  );
}

function mapToCheckboxGroupItem(
  attribute: CategorizedFlatAttribute,
  fieldName: string,
  maxQuasiIdentifierReached: boolean,
  keySortPrefix: string,
): SearchableCheckboxGroupItem | SearchableCheckboxGroupItem[] {
  return {
    key: attribute.key,
    searchableValue: attribute.name,
    checkboxFieldProps: {
      name: fieldName,
      representingValue: `${keySortPrefix}_${attribute.key}`,
      label: attribute.name,
    },
    dataPrivacyCategory: attribute.dataPrivacyCategory,
    maxQuasiIdentifierReached,
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
      disabled={
        item.maxQuasiIdentifierReached &&
        !checked &&
        item.dataPrivacyCategory === ApiDataPrivacyCategory.QuasiIdentifying
      }
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

function sortDataPrivacyCategory(
  left: ApiDataPrivacyCategory | undefined,
  right: ApiDataPrivacyCategory | undefined,
) {
  const dataPrivacyCategoryOrder = new Map([
    [ApiDataPrivacyCategory.QuasiIdentifying, 1],
    [ApiDataPrivacyCategory.Sensitive, 2],
    [ApiDataPrivacyCategory.Insensitive, 3],
    [undefined, 4],
  ]);
  return (
    dataPrivacyCategoryOrder.get(left)! - dataPrivacyCategoryOrder.get(right)!
  );
}

function mapDataPrivacyCategoryToLabel(
  category: ApiDataPrivacyCategory,
  amountSelectedQuasiIdentifyingAttributes: number,
) {
  switch (category) {
    case "QUASI_IDENTIFYING":
      return {
        label: `Quasi-Identifier (${MAX_AMOUNT_QUASI_IDENTIFYING - amountSelectedQuasiIdentifyingAttributes > 0 ? `noch ${MAX_AMOUNT_QUASI_IDENTIFYING - amountSelectedQuasiIdentifyingAttributes} wählbar` : "max. Anzahl erreicht"})`,
        info: "Allgemein bekannte Informationen, die in Kombination dazu geeignet sind, einen Datenpunkt zu reidentifizieren.",
      };
    case "SENSITIVE":
      return {
        label: "Sensible Attribute",
        info: "Geheime Information, die durch die Anonymisierung vor Reidentifikation geschützt werden soll.",
      };
    case "INSENSITIVE":
      return {
        label: "Nicht-sensible Attribute",
        info: "Attribute, die weder reidentifizierend wirken, noch sensibel sind. Sie beeinflussen den Anonymisierungsprozess nicht und sind daher nicht die Ursache dafür, dass diese Anonymisierung fehlgeschlagen ist.",
      };
  }
}

function sortByAttributeNumbering(left: string, right: string) {
  function extractWeight(name: string) {
    const pattern = /^(\d+)_(\d+)_(.+)/;
    return (
      Number(pattern.exec(name)![1]!) * 1000 + Number(pattern.exec(name)![2]!)
    );
  }

  return extractWeight(left) - extractWeight(right);
}

export function extractAttributeKey(attributeKeyWithPrefix: string) {
  return /^\d+_\d+_(.+)$/.exec(attributeKeyWithPrefix)![1]!;
}

function calculateAmountSelectedQuasiIdentifyingAttributes(
  attributes: CategorizedFlatAttribute[],
  attributeKeys: string[],
) {
  const attributeKeyToAttribute = new Map<string, CategorizedFlatAttribute>(
    attributes.map((it) => [it.key, it]),
  );
  return attributeKeys
    .map((it) => attributeKeyToAttribute.get(extractAttributeKey(it)))
    .filter(
      (it) =>
        it?.dataPrivacyCategory === ApiDataPrivacyCategory.QuasiIdentifying,
    ).length;
}

function mapToSearchableCheckboxGroups(
  attributes: CategorizedFlatAttribute[],
  selectedAttributeKeysFieldName: string,
  amountSelectedQuasiIdentifyingAttributes: number,
) {
  const groupedAttributesWithoutReference = groupBy(
    attributes.filter((attribute) => attribute.code !== "PROCEDURE_REFERENCE"),
    (attribute) => attribute.category,
  );

  return Object.entries(groupedAttributesWithoutReference).map(
    ([category, attributes], categoryIndex) => ({
      name: category,
      inAccordion: true,
      items: attributes
        .sort((l, r) =>
          sortDataPrivacyCategory(l.dataPrivacyCategory, r.dataPrivacyCategory),
        )
        .flatMap((attribute, attributeIndex) =>
          mapToCheckboxGroupItem(
            attribute,
            selectedAttributeKeysFieldName,
            amountSelectedQuasiIdentifyingAttributes >=
              MAX_AMOUNT_QUASI_IDENTIFYING,
            `${categoryIndex}_${attributeIndex}`,
          ),
        ),
    }),
  );
}
