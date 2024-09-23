/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddOutlined from "@mui/icons-material/AddOutlined";
import TextSnippetOutlined from "@mui/icons-material/TextSnippetOutlined";
import { IconButton, Sheet, Stack, Tooltip, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import {
  PaletteItem,
  PaletteItemType,
} from "@/lib/shared/components/contentEditor/types";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

interface ContentElementPaletteProps {
  palette: PaletteItem[];
  onItemAdd: (item: PaletteItem) => void;
  sx?: SxProps;
}

export function ContentElementPalette({
  palette,
  onItemAdd,
  sx,
}: Readonly<ContentElementPaletteProps>) {
  const iconMap = {
    [PaletteItemType.TEXT]: <TextSnippetOutlined />,
    [PaletteItemType.TEXTBLOCK]: <TextSnippetOutlined />,
  } satisfies Record<PaletteItemType, ReactNode>;

  return (
    <InformationSheet sx={sx} dataTestId={"editor-templates"}>
      <Typography level="h3" component="p">
        Vorlagen
      </Typography>
      <Stack spacing={1} sx={{ overflow: "auto" }}>
        {palette.map((item, index) => (
          <Sheet
            key={index}
            sx={{ paddingBlock: 1 }}
            data-testid={`editor-template-${index}`}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography level="body-sm" startDecorator={iconMap[item.type]}>
                {item.name}
              </Typography>
              <Tooltip title="Element hinzufügen">
                <IconButton
                  variant="plain"
                  color="primary"
                  aria-label="Element hinzufügen"
                  onClick={() => {
                    onItemAdd(item);
                  }}
                >
                  <AddOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          </Sheet>
        ))}
      </Stack>
    </InformationSheet>
  );
}
