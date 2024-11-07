/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoadingOverlay } from "@eshg/lib-portal/components/LoadingOverlay";
import { ExpandNavigation } from "@eshg/lib-portal/components/icons/ExpandNavigation";
import { Button, Stack, Typography } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { NavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/NavigationItem";
import { sideNavigationWidth } from "@/lib/baseModule/components/layout/sizes";

import { StyledList } from "./StyledList";
import { sideNavAriaLabel } from "./constants";
import { SideNavigationItem } from "./types";

export function NavigationListExpanded({
  setCollapsed,
  showCollapseButton,
  items,
  isLoading,
}: {
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  showCollapseButton: boolean;
  items: SideNavigationItem[];
  isLoading: boolean;
}) {
  return (
    <Stack
      component="nav"
      aria-label={sideNavAriaLabel}
      spacing={3}
      sx={{
        width: { xxs: "100vw", sm: sideNavigationWidth },
        backgroundColor: "background.body",
        paddingTop: 5,
        paddingBottom: 3,
      }}
    >
      {showCollapseButton && (
        <Button
          variant="plain"
          onClick={() => setCollapsed?.((prevState) => !prevState)}
          sx={{
            whiteSpace: "nowrap",
            justifyContent: "space-between",
            paddingInline: "0.25rem",
            marginInline: 3,
            display: "flex",
          }}
        >
          <Typography level="body-sm" textColor="neutral.700">
            Menü einklappen
          </Typography>
          <ExpandNavigation size="md" color="neutral" />
        </Button>
      )}
      <Stack flex={1} sx={{ overflowY: "auto", paddingInline: 3 }}>
        <StyledList
          sx={{
            // Small extra space that makes room for focus outline (keyboard navigation)
            paddingBlock: "0.25rem",
          }}
        >
          {items.map((item) => (
            <NavigationItem key={item.name} item={item} />
          ))}
        </StyledList>
        {isLoading && <LoadingOverlay />}
      </Stack>
    </Stack>
  );
}
