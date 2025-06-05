/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIconComponent } from "@mui/icons-material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import TextSnippetOutlined from "@mui/icons-material/TextSnippetOutlined";
import { IconButton, Sheet, Stack, Tooltip, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import { InformationSheet } from "@eshg/lib-employee-portal";

import {
  PaletteItem,
  PaletteItemType,
} from "@/lib/shared/components/contentEditor/types";

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
    [PaletteItemType.TEXT]: TextSnippetOutlined,
    [PaletteItemType.TEXTBLOCK]: TextSnippetOutlined,
  } satisfies Record<PaletteItemType, SvgIconComponent>;

  function getDecorator(type: PaletteItemType): ReactNode {
    const Icon = iconMap[type];

    return <Icon sx={{ display: { xxs: "none", lg: "block" } }} />;
  }

  return (
    <InformationSheet sx={sx} dataTestId="editor-templates">
      <Typography level="h3" component="p">
        Vorlagen
      </Typography>
      <Stack spacing={1} sx={{ overflow: "auto" }}>
        {palette.map((item, index) => (
          <Sheet
            key={index}
            sx={{
              padding: { xxs: 0, lg: 2 },
              paddingBlock: { xxs: 0, lg: 1 },
            }}
            data-testid={`editor-template-${index}`}
          >
            <Stack
              direction="row"
              spacing={{ xxs: 0, lg: 1 }}
              alignItems="center"
            >
              {getDecorator(item.type)}
              <Typography
                level="body-sm"
                sx={{ flex: 1, paddingLeft: { xxs: 1, lg: 0 } }}
                noWrap
              >
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
