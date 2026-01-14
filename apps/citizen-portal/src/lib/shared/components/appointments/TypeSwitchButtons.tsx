/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Sheet, ToggleButtonGroup } from "@mui/joy";

export interface TypeSwitchButtonConfig<T> {
  onClick: (selected: T) => unknown;
  switchType: T;
  label: string;
}

export function TypeSwitchButtons<T>({
  selected,
  configs = [],
}: Readonly<{
  selected: T;
  configs: TypeSwitchButtonConfig<T>[];
}>) {
  function handleClick(selectedConfig: TypeSwitchButtonConfig<T>) {
    selectedConfig.onClick(selectedConfig.switchType);
  }

  return (
    <Sheet
      sx={{
        padding: 0,
      }}
    >
      <ToggleButtonGroup aria-label="type-switch-buttons" color="neutral">
        {configs.map((config) => {
          const { label, switchType } = config;

          return (
            <Button
              key={label}
              variant={selected === switchType ? "solid" : "plain"}
              color="primary"
              sx={(theme) => ({
                flex: 1,
                height: "40px",
                "--variant-softColor": theme.palette.primary.solidBg,
                fontSize: "1rem",
              })}
              onClick={() => handleClick(config)}
            >
              {label}
            </Button>
          );
        })}
      </ToggleButtonGroup>
    </Sheet>
  );
}
