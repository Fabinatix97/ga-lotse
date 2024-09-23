/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, DeleteOutlined, DeveloperModeRounded } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { CSSProperties, useId, useState } from "react";

import { ToggleButton } from "@/lib/shared/components/buttons/ToggleButton";

export function InputWithDeleteButton({
  title,
  placeholder,
  defaultValue,
  onChange,
  onBlur,
  onDelete,
  onAddItem,
  addButtonTitle,
  showTextModule = false,
  hideAddButton = false,
  hideDeleteButton = false,
  toggleTextModuleActive = false,
  onToggleTextModule,
  style,
  multiline = false,
  disabled = false,
}: Readonly<{
  title: string;
  placeholder: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onDelete: () => void;
  onAddItem?: () => void;
  addButtonTitle?: string;
  showTextModule?: boolean;
  hideAddButton?: boolean;
  hideDeleteButton?: boolean;
  toggleTextModuleActive?: boolean;
  onToggleTextModule?: (show: boolean) => void;
  style?: CSSProperties;
  multiline?: boolean;
  disabled?: boolean;
}>) {
  const [showInput, setShowInput] = useState(!!defaultValue);
  const id = useId();

  return (
    <Stack spacing={1} style={style}>
      {showInput || hideAddButton ? (
        <Grid container columnSpacing={2} alignItems={"center"}>
          <Grid xs={2}>
            <Typography component="label" htmlFor={id}>
              {title + ": "}
            </Typography>
          </Grid>
          <Grid xs={8.7}>
            {multiline ? (
              <Textarea
                id={id}
                aria-label={title}
                disabled={disabled}
                minRows={2}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={(event) => onChange && onChange(event.target.value)}
                onBlur={(event) => onBlur && onBlur(event.target.value)}
                style={{ display: "flex", flex: 1 }}
              />
            ) : (
              <Input
                id={id}
                aria-label={title}
                disabled={disabled}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={(event) => onChange && onChange(event.target.value)}
                onBlur={(event) => onBlur && onBlur(event.target.value)}
                style={{ display: "flex", flex: 1 }}
              />
            )}
          </Grid>
          <Grid xs={1}>
            <Stack direction="row" spacing={2}>
              {!disabled && !hideDeleteButton && (
                <IconButton
                  title="Löschen"
                  aria-label="Löschen"
                  color="danger"
                  onClick={() => {
                    setShowInput(false);
                    onDelete();
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              )}
              {!disabled && showTextModule && (
                <ToggleButton
                  asIcon={true}
                  title="Textbausteine"
                  aria-label="Textbausteine"
                  aria-pressed={toggleTextModuleActive}
                  onToggle={(pressed) => {
                    onToggleTextModule?.(pressed);
                  }}
                >
                  <DeveloperModeRounded />
                </ToggleButton>
              )}
            </Stack>
          </Grid>
        </Grid>
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
