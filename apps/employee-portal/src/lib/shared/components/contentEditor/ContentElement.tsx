/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import { ApiEditorBodyElementsInner } from "@eshg/lib-editor-api";

import { ContentElementAudios } from "@/lib/shared/components/contentEditor/ContentElementAudio";
import { ContentElementImages } from "@/lib/shared/components/contentEditor/ContentElementImages";
import { ContentElementQA } from "@/lib/shared/components/contentEditor/ContentElementQA";

export function ContentElement({
  element,
  readonly = false,
  imagesBasePath,
}: Readonly<{
  element: ApiEditorBodyElementsInner;
  readonly?: boolean;
  imagesBasePath?: string;
}>) {
  switch (element.type) {
    case "TOPLEVEL_TITLE":
    case "EditorElementTopLevelTitle":
      return (
        <Typography level="h2" sx={{ paddingBlock: 1 }}>
          {element.title}
        </Typography>
      );

    case "CHAPTER":
    case "EditorElementChapter":
      return (
        <Stack>
          <Typography level="h3">{element.title}</Typography>
          <Divider />
        </Stack>
      );

    case "SECTION":
    case "EditorElementSection":
      return <Typography level="h4">{element.title}</Typography>;

    case "TEXT":
    case "EditorElementText":
      return (
        <Typography
          level="body-md"
          whiteSpace="pre-line"
          sx={{ overflowWrap: "break-word" }}
        >
          {element.text}
        </Typography>
      );

    case "TEXT_BLOCK":
    case "EditorElementTextBlock":
    case "FULL_TEXT_BLOCK":
    case "EditorElementFullTextBlock":
      // Not perfect: A list with only one element
      return (
        <Stack spacing={1} component="dl" margin={0}>
          <Typography role="term" level="title-md">
            {element.title}
          </Typography>
          <Typography
            level="body-md"
            whiteSpace="pre-line"
            sx={{ overflowWrap: "break-word" }}
            role="definition"
          >
            {element.text}
          </Typography>
        </Stack>
      );

    case "SEPARATOR":
    case "EditorElementSeparator":
      return <Divider />;

    case "QUESTION_AND_ANSWERS":
    case "EditorElementQA":
      return <ContentElementQA element={element} readonly={readonly} />;

    case "IMAGES":
    case "EditorElementImages":
      return (
        <ContentElementImages element={element} basePath={imagesBasePath} />
      );

    case "AUDIOS":
    case "EditorElementAudios":
      return (
        <ContentElementAudios element={element} basePath={imagesBasePath} />
      );
  }
}
