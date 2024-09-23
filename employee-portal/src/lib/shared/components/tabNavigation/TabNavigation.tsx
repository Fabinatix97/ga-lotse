/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Stack } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";
import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";
import { noCheck } from "@/lib/shared/helpers/accessControl";
import { useAccessControl } from "@/lib/shared/hooks/useAccessControl";
import { useIsActiveRoute } from "@/lib/shared/hooks/useIsActiveRoute";

interface TabNavigationProps {
  items: TabNavigationItem[];
  index?: string;
}

export function TabNavigation({ items, index }: TabNavigationProps) {
  const checkAccess = useAccessControl();
  const isActiveRoute = useIsActiveRoute(index);

  const filteredItems = items.filter((item) =>
    checkAccess(item.accessCheck ?? noCheck()),
  );

  return (
    <Stack
      component="nav"
      aria-label="Tab-Navigation"
      direction="row"
      gap={2}
      alignItems="center"
    >
      {filteredItems.map((item) => {
        const selected = isActiveRoute(item.href, item.exactMatch);
        return (
          <InternalLinkButton
            key={item.tabButtonName}
            href={item.href}
            disabled={item.disabled}
            startDecorator={item.decorator}
            variant={selected ? "soft" : "plain"}
            color={item.color ?? (selected ? "primary" : "neutral")}
            aria-current={selected ? "true" : undefined}
            sx={{
              fontSize: theme.fontSize.md,
              lineHeight: theme.lineHeight.sm,
              height: "1rem",
            }}
          >
            {item.tabButtonName}
          </InternalLinkButton>
        );
      })}
    </Stack>
  );
}
