/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { List, ListItem, Option, Select, Typography } from "@mui/joy";
import { SyntheticEvent } from "react";

import {
  EnumSingleFilterDefinition,
  EnumSingleFilterValue,
} from "../../types/EnumSingleFilter";

interface EnumSingleFilterProps {
  definition: EnumSingleFilterDefinition;
  value: EnumSingleFilterValue | null;
  onChange: (value: EnumSingleFilterValue | null) => void;
}

export function EnumSingleFilter(props: EnumSingleFilterProps) {
  function handleChange(
    event: SyntheticEvent | null,
    optionValue: string | null,
  ) {
    // I'm not certain why this handler sometimes fires with a null event
    if (event === null) {
      return;
    }
    props.onChange(
      optionValue
        ? {
            type: "EnumSingle",
            key: props.definition.key,
            selectedValue: optionValue,
          }
        : null,
    );
  }
  return (
    <Select
      placeholder={props.definition.placeholder}
      value={props.value?.selectedValue ?? null}
      sx={{ width: "100%" }}
      aria-label={props.definition.name}
      onChange={handleChange}
    >
      {props.definition.groupedOptions
        ? Object.entries(props.definition.groupedOptions).map(
            ([groupName, items]) => (
              <List key={groupName} aria-labelledby={groupName}>
                <ListItem
                  id={groupName}
                  sticky
                  sx={{
                    backgroundColor: (theme) => theme.palette.background.level1,
                  }}
                >
                  <Typography level="body-md">{groupName}</Typography>
                </ListItem>
                {items.map((item) => (
                  <Option key={item.id} value={item.id} sx={{ paddingLeft: 4 }}>
                    {item.name}
                  </Option>
                ))}
              </List>
            ),
          )
        : null}
      {props.definition.options?.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}
