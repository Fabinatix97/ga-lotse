/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { FieldProps, SelectField } from "@eshg/lib-portal";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

interface MergeStringFieldProps extends FieldProps<string> {
  target: string | undefined;
  source: string | undefined;
  getOptionLabel?: (value: string) => string | undefined;
  emptyValue?: string;
  targetValueLabel: string;
  sourceValueLabel: string;
}

export function MergeStringField({
  target,
  source,
  getOptionLabel,
  emptyValue,
  targetValueLabel,
  sourceValueLabel,
  ...fieldProps
}: MergeStringFieldProps) {
  function getLabel(value: string) {
    const label = getOptionLabel?.(value) ?? value;
    return label.trim() === "" ? "Keine Angabe" : label;
  }

  function normalizeValue(value: string | undefined) {
    return value === undefined || value === "" ? (emptyValue ?? " ") : value;
  }

  const normalizedTarget = normalizeValue(target);
  const normalizedSource = normalizeValue(source);

  if (normalizedTarget === normalizedSource || normalizedSource === " ") {
    const value = getLabel(normalizedTarget);

    return (
      <DetailsCell
        name={fieldProps.name}
        label={fieldProps.label as string}
        value={value}
        showIfEmpty
      />
    );
  }

  const selectOptions = [
    {
      value: normalizedTarget,
      label: (
        <AnnotatedSelectOption
          label={getLabel(normalizedTarget)}
          title={targetValueLabel ?? "Aktuell"}
        />
      ),
    },
    {
      value: normalizedSource,
      label: (
        <AnnotatedSelectOption
          label={getLabel(normalizedSource)}
          title={sourceValueLabel ?? "Importiert"}
        />
      ),
    },
  ];

  return (
    <SelectField
      placeholder="Auswählen..."
      options={selectOptions}
      sx={{ flex: 1 }}
      {...fieldProps}
      required="Bitte auswählen"
      renderValue={(option) => getLabel(normalizeValue(option?.value))}
    />
  );
}

function AnnotatedSelectOption(props: { label: string; title: string }) {
  return (
    <Stack>
      <Typography fontSize="xs" fontWeight="lg" textColor="text.secondary">
        {props.title}
      </Typography>
      <Typography level="body-md">{props.label}</Typography>
    </Stack>
  );
}
