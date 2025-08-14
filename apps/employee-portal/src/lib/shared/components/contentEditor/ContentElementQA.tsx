/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Checkbox,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/joy";
import { useId } from "react";

import { ApiEditorElementQA } from "@eshg/lib-editor-api";

export function ContentElementQA({
  element,
  readonly = false,
}: {
  element: ApiEditorElementQA;
  readonly?: boolean;
}) {
  const titleId = useId();
  return (
    <Stack spacing={1} role="group" aria-labelledby={titleId}>
      <Typography
        level="title-md"
        color={element.highlighted ? "danger" : undefined}
        id={titleId}
      >
        {element.title}
      </Typography>
      {element.answers.map((answer) => (
        <FormControl key={answer.answerId} sx={{ marginLeft: 3 }}>
          <Checkbox
            label={answer.answerText}
            checked={answer.selected}
            readOnly
            size="md"
            slotProps={{
              input: { sx: { cursor: readonly ? "default" : "pointer" } },
            }}
          />
          {answer.extraText && (
            <FormHelperText
              sx={{
                color: (theme) => theme.palette.neutral.plainColor,
                fontSize: (theme) => theme.fontSize.sm,
                whiteSpace: "pre",
                textWrap: "wrap",
              }}
            >
              {answer.extraText}
            </FormHelperText>
          )}
        </FormControl>
      ))}
    </Stack>
  );
}
