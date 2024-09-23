/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Divider, Sheet, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { TabNavigation } from "@/lib/shared/components/tabNavigation/TabNavigation";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";

export interface TabNavigationToolbarProps {
  /** tab definitions */
  items: TabNavigationItem[];
  /** route for back button */
  routeBack: string;
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
        <InternalLinkIconButton
          href={props.routeBack}
          aria-label="Zurück"
          sx={{ minWidth: "3.5rem" }}
        >
          <ChevronLeft sx={{ width: "40px", height: "40px" }} />
        </InternalLinkIconButton>
        <Stack divider={<Divider />} sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ paddingInline: 3 }}>{props.header}</Box>
          <Box
            sx={{
              // allow horizontal scrolling
              overflowX: "auto",
              // take up all the remaining vertical space
              flexGrow: 1,
              // keep the tabs centered
              display: "flex",
              alignItems: "center",
            }}
          >
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
          </Box>
        </Stack>
      </Stack>
    </Sheet>
  );
}
