/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Validator } from "@eshg/lib-portal/types/form";
import { Add, Delete, DeveloperModeRounded } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/joy";
import { useState } from "react";

import { ToggleButton } from "@/lib/shared/components/buttons/ToggleButton";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export function InputWithDeleteButton({
  label,
  placeholder,
  defaultValue,
  onDelete,
  onAddItem,
  addButtonTitle,
  showTextModule = false,
  hideAddButton = false,
  hideDeleteButton = false,
  toggleTextModuleActive = false,
  onToggleTextModule,
  name,
  validate,
  required,
  multiline = false,
  disabled = false,
}: Readonly<{
  label: string;
  placeholder: string;
  defaultValue?: string;
  onDelete: () => void;
  onAddItem?: () => void;
  addButtonTitle?: string;
  showTextModule?: boolean;
  hideAddButton?: boolean;
  hideDeleteButton?: boolean;
  toggleTextModuleActive?: boolean;
  onToggleTextModule?: (show: boolean) => void;
  name: string;
  validate?: Validator<string>;
  required?: string;
  multiline?: boolean;
  disabled?: boolean;
}>) {
  const [showInput, setShowInput] = useState(!!defaultValue);

  return (
    <Stack spacing={1} style={{ flex: 1 }}>
      {showInput || hideAddButton ? (
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {multiline ? (
            <TextareaField
              name={name}
              label={label}
              aria-label={label}
              disabled={disabled}
              minRows={2}
              placeholder={placeholder}
              validate={validate}
              required={required}
              sx={{ flex: 1 }}
            />
          ) : (
            <InputField
              name={name}
              label={label}
              aria-label={label}
              disabled={disabled}
              placeholder={placeholder}
              validate={validate}
              required={required}
              sx={{ flex: 1 }}
            />
          )}
          {!disabled && showTextModule && (
            <ToggleButton
              title="Textbausteine"
              aria-label="Textbausteine"
              asIcon={true}
              sx={{ mt: "1.7rem" }}
              aria-pressed={toggleTextModuleActive}
              defaultChecked={toggleTextModuleActive}
              onToggle={(pressed) => {
                onToggleTextModule?.(pressed);
              }}
            >
              <DeveloperModeRounded />
            </ToggleButton>
          )}
          {!disabled && !hideDeleteButton && (
            <IconButton
              title="Löschen"
              aria-label="Löschen"
              variant="outlined"
              color="danger"
              sx={{ mt: "1.7rem" }}
              onClick={() => {
                setShowInput(false);
                onDelete();
              }}
            >
              <Delete />
            </IconButton>
          )}
        </Stack>
      ) : (
        <Button
          disabled={disabled}
          startDecorator={<Add />}
          style={{ alignSelf: "flex-start" }}
          variant="plain"
          onClick={() => {
            onAddItem?.();
            setShowInput(true);
          }}
        >
          {addButtonTitle}
        </Button>
      )}
    </Stack>
  );
}
