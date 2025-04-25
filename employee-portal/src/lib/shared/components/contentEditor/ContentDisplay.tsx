/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { MouseEventHandler, PropsWithChildren } from "react";

import { ApiEditorBodyElementsInner } from "@eshg/lib-editor-api";
import { InformationSheet } from "@eshg/lib-employee-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { ContentElement } from "@/lib/shared/components/contentEditor/ContentElement";

interface ContentDisplayProps {
  elements: ApiEditorBodyElementsInner[];
  selectedElement?: ApiEditorBodyElementsInner | null;
  onElementSelected?: (element: ApiEditorBodyElementsInner) => void;
  readonly?: boolean;
  sx?: SxProps;
  imagesBasePath?: string;
}

export function ContentDisplay({
  elements,
  selectedElement,
  onElementSelected,
  readonly = false,
  sx,
  imagesBasePath,
}: Readonly<ContentDisplayProps>) {
  function elementClicked(element: ApiEditorBodyElementsInner) {
    if (!readonly) {
      onElementSelected?.(element);
    }
  }

  return (
    <InformationSheet sx={sx} dataTestId={"editor-display"}>
      {elements?.map((element, index) => (
        <SelectableBox
          key={element.id}
          id={`element-${element.id}`}
          selected={element === selectedElement}
          highlighted={element.highlighted}
          readonly={readonly}
          onClick={() => elementClicked(element)}
          dataTestId={`editor-display-element-${index}`}
        >
          <ContentElement
            element={element}
            readonly={readonly}
            imagesBasePath={imagesBasePath}
          />
        </SelectableBox>
      ))}
    </InformationSheet>
  );
}

function SelectableBox({
  id,
  readonly,
  selected,
  highlighted,
  onClick,
  children,
  dataTestId,
}: PropsWithChildren<{
  id: string;
  readonly?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  onClick: MouseEventHandler;
  dataTestId?: string;
}>) {
  return (
    <Box
      sx={{
        borderLeft: highlighted ? 3 : 0,
        borderColor: highlighted ? theme.palette.danger[500] : undefined,
      }}
      data-testid={dataTestId}
    >
      <Box
        id={id}
        onClick={onClick}
        sx={{
          padding: 1,
          cursor: readonly ? "default" : "pointer",
          zIndex: theme.zIndex.toolbar - 1,
          borderRadius: theme.radius.md,
          backgroundColor: selected
            ? theme.palette.neutral.plainActiveBg
            : undefined,
          "&:hover": !readonly
            ? {
                backgroundColor: theme.palette.neutral.plainHoverBg,
              }
            : undefined,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
