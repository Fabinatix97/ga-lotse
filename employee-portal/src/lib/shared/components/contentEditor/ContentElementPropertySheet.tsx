/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  ApiEditorBodyElementsInner,
  ApiUpdateEditorRequest,
} from "@eshg/lib-editor-api";
import { InformationSheet } from "@eshg/lib-employee-portal";

import { ContentElementProperties } from "@/lib/shared/components/contentEditor/ContentElementProperties";
import { ContentElementPropertiesToolbar } from "@/lib/shared/components/contentEditor/ContentElementPropertiesToolbar";

interface ContentElementPropertySheetProps {
  element?: ApiEditorBodyElementsInner | null;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (request: ApiUpdateEditorRequest) => Promise<boolean>;
  sx?: SxProps;
}

export function ContentElementPropertySheet({
  element,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
  sx,
}: Readonly<ContentElementPropertySheetProps>) {
  return (
    <InformationSheet sx={sx} dataTestId="editor-properties">
      <Typography level="h3" component="p">
        Auswahl
      </Typography>
      <Divider />

      {element ? (
        <>
          <ContentElementPropertiesToolbar
            moveable={element.moveable}
            deletable={element.deletable}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
          />
          <ContentElementProperties element={element} onUpdate={onUpdate} />
        </>
      ) : (
        <Typography paddingBlock={3}>Keine Auswahl getroffen</Typography>
      )}
    </InformationSheet>
  );
}
