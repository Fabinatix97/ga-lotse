/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDocumentTextBlock } from "@eshg/citizen-portal-api/travelMedicine";
import { Box } from "@mui/joy";

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
