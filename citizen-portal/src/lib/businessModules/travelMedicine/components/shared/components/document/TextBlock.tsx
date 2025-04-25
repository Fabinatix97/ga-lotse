/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import { ApiDocumentTextBlock } from "@eshg/travel-medicine-api";

interface TextBlockProps {
  textBlock: ApiDocumentTextBlock;
}
export function TextBlock(props: Readonly<TextBlockProps>) {
  return (
    <Box
      sx={{ whiteSpace: "pre-wrap" }}
      data-testid="document-element-type-textblock"
    >
      {props.textBlock.textField}
    </Box>
  );
}
