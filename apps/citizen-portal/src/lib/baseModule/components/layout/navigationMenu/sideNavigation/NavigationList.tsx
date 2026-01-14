/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, ListItemButton, Stack, styled } from "@mui/joy";
import { useId } from "react";

import { PageSwitchButtonsMobile } from "@/lib/baseModule/components/layout/navigationMenu/header/PageSwitchButtons";
import {
  TopicBreadcrumbs,
  useTopicMenu,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/TopicMenu";
import {
  TopicMenuBackButton,
  TopicMenuBackButtonComponentProps,
  topicMenuBackButtonStyles,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/topicMenuBackButton";
import {
  TopicMenuCategoryButton,
  TopicMenuCategoryButtonComponentProps,
  topicMenuCategoryButtonStyles,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/topicMenuCategoryButton";
import {
  TopicMenuLinkButton,
  TopicMenuLinkComponentProps,
  topicMenuLinkButtonStyles,
} from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/topicMenuLinkButton";
import {
  NavigationCategory,
  NavigationProps,
  isNavigationLink,
} from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";
import {
  LanguagePickerMobile,
  LanguagePickerMobileButton,
} from "@/lib/i18n/components/LanguagePicker";
import { ScopedInternalLink } from "@/lib/shared/components/scopedLinks";

export function NavigationList(props: NavigationProps) {
  const { userType, navigationState, navigationItems, setNavigationState } =
    props;
  const { t } = useTranslation("header");
  const titleId = useId();
  const allTopicsCategory: NavigationCategory = {
    name: t("nav.all_topics"),
    items: navigationItems,
  };
  const topicMenu = useTopicMenu(allTopicsCategory);

  return (
    <Stack
      component="nav"
      aria-label="Navigation"
      flex={1}
      sx={{ overflowY: "auto" }}
    >
      {navigationState.type === "language" && (
        <LanguagePickerMobile
          onClose={() => {
            setNavigationState({ type: "closed" });
          }}
        />
      )}
      {navigationState.type === "topic-menu" && (
        <Stack flex={1} justifyContent="space-between" paddingBottom={2}>
          <Stack>
            <Stack padding={2}>
              <PageSwitchButtonsMobile userType={userType} />
            </Stack>

            {topicMenu.categoryPath.length > 1 ? (
              <TopicMenuBackButton
                component={BackButtonListItem}
                onClick={topicMenu.backToPreviousCategory}
              />
            ) : null}
            <TopicBreadcrumbs
              id={titleId}
              categoryPath={topicMenu.categoryPath}
            />
            <UnstyledList aria-labelledby={titleId}>
              {topicMenu.items.map((item) =>
                isNavigationLink(item) ? (
                  <TopicMenuLinkButton
                    key={item.name}
                    component={LinkButtonListItem}
                    link={item}
                  />
                ) : (
                  <TopicMenuCategoryButton
                    key={item.name}
                    component={CategoryButtonListItem}
                    category={item}
                    onClick={() => topicMenu.openCategory(item)}
                  />
                ),
              )}
            </UnstyledList>
          </Stack>
          <LanguagePickerMobileButton
            onClick={() => setNavigationState({ type: "language" })}
          />
        </Stack>
      )}
    </Stack>
  );
}

const UnstyledList = styled(List)({
  paddingBlock: 0,
});

const ListItemBackButton = styled(ListItemButton)(({ theme }) =>
  topicMenuBackButtonStyles(theme),
) as typeof ListItemButton;

function BackButtonListItem(props: TopicMenuBackButtonComponentProps) {
  return (
    <ListItem>
      <ListItemBackButton {...props} />
    </ListItem>
  );
}

const ListItemCategoryButton = styled(ListItemButton)(({ theme }) =>
  topicMenuCategoryButtonStyles(theme),
) as typeof ListItemButton;

function CategoryButtonListItem(props: TopicMenuCategoryButtonComponentProps) {
  return (
    <ListItem>
      <ListItemCategoryButton {...props} />
    </ListItem>
  );
}

const ListItemLinkButton = styled(ListItemButton)(({ theme }) =>
  topicMenuLinkButtonStyles(theme),
) as typeof ListItemButton;

function LinkButtonListItem(props: TopicMenuLinkComponentProps) {
  return (
    <ListItem>
      <ListItemLinkButton {...props} component={ScopedInternalLink} />
    </ListItem>
  );
}
