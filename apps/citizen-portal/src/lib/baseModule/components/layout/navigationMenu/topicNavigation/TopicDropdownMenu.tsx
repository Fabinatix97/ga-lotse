/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, Menu, MenuItem, Stack, styled } from "@mui/joy";
import { useId } from "react";

import {
  TopicBreadcrumbs,
  useTopicMenu,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/TopicMenu";
import {
  TopicMenuBackButton,
  topicMenuBackButtonStyles,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/topicMenuBackButton";
import {
  TopicMenuCategoryButton,
  topicMenuCategoryButtonStyles,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/topicMenuCategoryButton";
import {
  TopicMenuLinkButton,
  TopicMenuLinkComponentProps,
  topicMenuLinkButtonStyles,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/topicMenuLinkButton";
import { maxContentWidthDesktop } from "@/lib/baseModule/components/layout/sizes";
import {
  NavigationCategory,
  isNavigationLink,
} from "@/lib/baseModule/components/layout/types";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

export const KEEP_MENU_OPEN_MARKER = "data-keep-menu-open";

const KEEP_MENU_OPEN_PROPS = { [KEEP_MENU_OPEN_MARKER]: "true" } as const;

interface TopicDropdownMenuProps {
  category: NavigationCategory;
  anchorEl: HTMLDivElement | null;
}

export function TopicDropdownMenu(props: TopicDropdownMenuProps) {
  const { category, anchorEl } = props;
  const titleId = useId();
  const topicMenu = useTopicMenu(category);

  return (
    <Menu component={TopicMenuStack} anchorEl={anchorEl} variant="plain">
      {topicMenu.categoryPath.length > 1 ? (
        <TopicMenuBackButton
          component={MenuBackItem}
          onClick={topicMenu.backToPreviousCategory}
          {...KEEP_MENU_OPEN_PROPS}
        />
      ) : null}
      <TopicBreadcrumbs id={titleId} categoryPath={topicMenu.categoryPath} />
      <ResponsiveList aria-labelledby={titleId}>
        {topicMenu.items.map((item) =>
          isNavigationLink(item) ? (
            <TopicMenuLinkButton
              key={item.name}
              component={MenuLinkItem}
              link={item}
            />
          ) : (
            <TopicMenuCategoryButton
              key={item.name}
              component={MenuCategoryItem}
              category={item}
              onClick={() => topicMenu.openCategory(item)}
              {...KEEP_MENU_OPEN_PROPS}
            />
          ),
        )}
      </ResponsiveList>
    </Menu>
  );
}

const TopicMenuStack = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "flex-start",
  width: maxContentWidthDesktop,
  flexWrap: "wrap",
  "&.MuiStack-root": {
    paddingBlock: theme.spacing(4),
    paddingInline: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  borderRadius: theme.radius.lg,
  li: {
    width: 365,
  },
  [theme.breakpoints.down(MobileBreakpoint.Down)]: {
    display: "none",
  },
}));

const ResponsiveList = styled(List)({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  maxHeight: 392,
});

const MenuBackItem = styled(MenuItem)(({ theme }) =>
  topicMenuBackButtonStyles(theme),
) as typeof MenuItem;

const MenuCategoryItem = styled(MenuItem)(({ theme }) =>
  topicMenuCategoryButtonStyles(theme),
) as typeof MenuItem;

const StyledMenuLinkItem = styled(MenuItem)(({ theme }) =>
  topicMenuLinkButtonStyles(theme),
) as typeof MenuItem;

export function MenuLinkItem(props: TopicMenuLinkComponentProps) {
  const { href, ...buttonProps } = props;
  const scopedRouter = useScopedRouter();

  return (
    <StyledMenuLinkItem
      {...buttonProps}
      // we need to programmatically call the router
      // because Next.js' Link component interferes
      // with the event handling from Joy UIs MenuItem
      onClick={() => scopedRouter.push(href)}
    />
  );
}
