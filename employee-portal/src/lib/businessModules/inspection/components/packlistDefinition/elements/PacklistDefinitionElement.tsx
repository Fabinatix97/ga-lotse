/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiPacklistDefinitionElement } from "@eshg/employee-portal-api/inspection";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { DeleteOutlined, DragIndicatorOutlined } from "@mui/icons-material";
import { IconButton, Input, Stack } from "@mui/joy";
import { doNothing } from "remeda";

interface PacklistDefinitionElementProps {
  element: ApiPacklistDefinitionElement;
  setElement?: (element: ApiPacklistDefinitionElement) => void;
  deleteElement?: () => void;
  elementIndex: number;
  readOnlyMode?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export function PacklistDefinitionElement({
  element,
  setElement = doNothing,
  deleteElement = doNothing,
  elementIndex,
  readOnlyMode,
  dragHandleProps,
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
      <div
        {...dragHandleProps}
        aria-label={`Element ${defaultIndex} ziehen und verschieben`}
        role="button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DragIndicatorOutlined
          style={{
            backgroundColor: "#E3EFFB",
            borderRadius: 50,
            padding: 4,
            width: 32,
            height: 32,
          }}
        />
      </div>
      <Input
        disabled={readOnlyMode}
        style={{ flex: 1, height: 51 }}
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
