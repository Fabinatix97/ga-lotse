/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiEditorBodyElementsInner,
  ApiUpdateEditorRequest,
} from "@eshg/lib-editor-api";
import { Typography } from "@mui/joy";

import { ContentElementFullTextEditor } from "@/lib/shared/components/contentEditor/ContentElementFullTextEditor";
import { ContentElementQAEditor } from "@/lib/shared/components/contentEditor/ContentElementQAEditor";
import { ContentElementTextEditor } from "@/lib/shared/components/contentEditor/ContentElementTextEditor";

interface ContentElementPropertiesProps {
  element: ApiEditorBodyElementsInner;
  onUpdate: (request: ApiUpdateEditorRequest) => Promise<boolean>;
}

export function ContentElementProperties({
  element,
  onUpdate,
}: Readonly<ContentElementPropertiesProps>) {
  if (
    !element.editable ||
    element.type === "SEPARATOR" ||
    element.type === "EditorElementSeparator"
  ) {
    return (
      <Typography paddingBlock={3}>
        Das gewählte Element kann nicht bearbeitet werden.
      </Typography>
    );
  }

  switch (element.type) {
    case "TOPLEVEL_TITLE":
    case "EditorElementTopLevelTitle":
    case "CHAPTER":
    case "EditorElementChapter":
    case "SECTION":
    case "EditorElementSection":
      return (
        <ContentElementTextEditor text={element.title} onUpdate={onUpdate} />
      );

    case "TEXT":
    case "EditorElementText":
    case "TEXT_BLOCK":
    case "EditorElementTextBlock":
      return (
        <ContentElementTextEditor text={element.text} onUpdate={onUpdate} />
      );

    case "FULL_TEXT_BLOCK":
    case "EditorElementFullTextBlock":
      return (
        <ContentElementFullTextEditor
          title={element.title}
          text={element.text}
          onUpdate={onUpdate}
        />
      );

    case "QUESTION_AND_ANSWERS":
    case "EditorElementQA":
      return <ContentElementQAEditor element={element} onUpdate={onUpdate} />;

    case "IMAGES":
    case "EditorElementImages":
      return null;
  }
}
