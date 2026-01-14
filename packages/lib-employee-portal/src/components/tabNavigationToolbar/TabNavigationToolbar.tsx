/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Divider, Sheet, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { HorizontalScrollBoxWithButtons } from "./HorizontalScrollBoxWithButtons";
import { TabNavigation, TabNavigationItem } from "./TabNavigation";

interface TabNavigationToolbarProps {
  /** tab definitions */
  items: TabNavigationItem[];
  /** component for back button */
  backButton?: ReactNode;
  /** component to be displayed as header; required. */
  header: ReactNode;
  /** component to be displayed right aligned beneath the tabs; optional. */
  afterTabs?: ReactNode;
  /** root path (if any) */
  index?: string;
}

export function TabNavigationToolbar(props: TabNavigationToolbarProps) {
  return (
    <Sheet
      sx={{
        padding: 0,
        borderRadius: 0,
        borderLeft: 0,
      }}
      data-testid="tabNavigationToolbar"
    >
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" />}
        sx={{
          // keep the fixed height of the toolbar
          height: "5.75rem",
          overflowY: "hidden",
        }}
      >
        {props.backButton}
        <Stack divider={<Divider />} sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ paddingInline: 3 }}>{props.header}</Box>
          <HorizontalScrollBoxWithButtons>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                paddingInline: 3,
                gap: 3,
                // prevent any wrapping
                minWidth: "max-content",
                // take up all the horizontal space
                //  so that afterTabs is right aligned
                width: "100%",
              }}
            >
              <TabNavigation items={props.items} index={props.index} />
              {props.afterTabs && (
                <Box sx={{ alignSelf: "center" }}>{props.afterTabs}</Box>
              )}
            </Stack>
          </HorizontalScrollBoxWithButtons>
        </Stack>
      </Stack>
    </Sheet>
  );
}
