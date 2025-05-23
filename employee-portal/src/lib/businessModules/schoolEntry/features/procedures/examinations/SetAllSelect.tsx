/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Option, Select } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import {
  FieldComponentProps,
  NO_SELECTION_LABEL,
  RequiresChildren,
  SelectOptions,
  useIsFormDisabled,
} from "@eshg/lib-portal";
import {
  FieldOrientation,
  resolveFieldComponent,
} from "@eshg/lib-portal/components/form/fieldVariants";

import {
  BOOLEAN_WITH_UNKNOWN_OPTIONS,
  EXAMINATION_RESULT_OPTIONS,
} from "@/lib/businessModules/schoolEntry/features/procedures/options";

type SupportedTypes = string | boolean;

interface SetAllProps<TValue> extends FieldComponentProps, RequiresChildren {
  label: string | ReactNode;
  sx?: SxProps;
  orientation?: FieldOrientation;
  onChange: (selectedValue: TValue) => void;
}

export function SetAllExaminationResultsSelect(
  props: Omit<SetAllProps<string>, "children">,
) {
  return (
    <SetAllSelect<string>
      label={props.label}
      sx={props.sx}
      orientation={props.orientation}
      onChange={props.onChange}
    >
      <SelectOptions options={EXAMINATION_RESULT_OPTIONS} />
    </SetAllSelect>
  );
}

export function SetAllBooleanSelect(
  props: Omit<SetAllProps<boolean>, "children">,
) {
  return (
    <SetAllSelect<boolean>
      label={props.label}
      sx={props.sx}
      orientation={props.orientation}
      onChange={props.onChange}
    >
      <Option value>Ja</Option>
      <Option value={false}>Nein</Option>
      <Option value="">{NO_SELECTION_LABEL}</Option>
    </SetAllSelect>
  );
}

export function SetAllBooleanWithUnknownSelect(
  props: Omit<SetAllProps<string>, "children">,
) {
  return (
    <SetAllSelect<string>
      label={props.label}
      sx={props.sx}
      orientation={props.orientation}
      onChange={props.onChange}
    >
      <SelectOptions options={BOOLEAN_WITH_UNKNOWN_OPTIONS} />
    </SetAllSelect>
  );
}

function SetAllSelect<TValue extends SupportedTypes>(
  props: SetAllProps<TValue>,
) {
  const FieldComponent = resolveFieldComponent(props.orientation);
  const disabled = useIsFormDisabled();

  return (
    <FieldComponent label={props.label} sx={props.sx}>
      <Select
        value={null}
        disabled={disabled}
        onChange={(_, newValue: TValue | null) => {
          if (newValue === null) {
            return;
          }
          props.onChange(newValue);
        }}
      >
        {props.children}
      </Select>
    </FieldComponent>
  );
}
