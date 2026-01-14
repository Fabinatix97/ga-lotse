/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { DeleteOutlined, DragIndicatorOutlined } from "@mui/icons-material";
import { Box, IconButton, Input, Stack } from "@mui/joy";
import { doNothing } from "remeda";

import { ApiPacklistDefinitionElement } from "@eshg/inspection-api";

interface PacklistDefinitionElementProps {
  element: ApiPacklistDefinitionElement;
  setElement?: (element: ApiPacklistDefinitionElement) => void;
  deleteElement?: () => void;
  elementIndex: number;
  readOnlyMode?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  ref?: (el: HTMLInputElement) => void;
}

export function PacklistDefinitionElement({
  element,
  setElement = doNothing,
  deleteElement = doNothing,
  elementIndex,
  readOnlyMode,
  dragHandleProps,
  ref,
}: Readonly<PacklistDefinitionElementProps>) {
  function updateElement(update: Partial<ApiPacklistDefinitionElement>) {
    setElement({ ...element, ...update });
  }

  function setTitle(text: string) {
    updateElement({
      text,
    });
  }

  const defaultIndex = elementIndex + 1;
  return (
    <Stack
      direction="row"
      spacing={2}
      display="flex"
      flex={1}
      alignContent="center"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        {...dragHandleProps}
        aria-label={`Element ${defaultIndex} ziehen und verschieben`}
        role="button"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DragIndicatorOutlined
          sx={{
            backgroundColor: "#E3EFFB",
            borderRadius: 6.25,
            padding: 0.5,
            width: "32px",
            height: "32px",
          }}
        />
      </Box>
      <Input
        slotProps={{
          input: {
            ref: ref,
          },
        }}
        disabled={readOnlyMode}
        sx={{ flex: 1, height: "51px" }}
        defaultValue={element?.text ?? ""}
        placeholder={`Text für Eintrag ${defaultIndex} eingeben`}
        onBlur={(event) => setTitle(event.target.value)}
      />
      {!readOnlyMode && (
        <IconButton
          title="Löschen"
          aria-label="Löschen"
          color="danger"
          onClick={deleteElement}
        >
          <DeleteOutlined />
        </IconButton>
      )}
    </Stack>
  );
}
