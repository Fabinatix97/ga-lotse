/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MenuOutlined } from "@mui/icons-material";
import { Box, Stack } from "@mui/joy";

import {
  TopicLinkButton,
  TopicMenuDropdownButton,
} from "@/lib/baseModule/components/layout/navigationMenu/topicNavigation/topicNavigationButtons";
import {
  NavigationCategory,
  NavigationItem,
  isNavigationLink,
} from "@/lib/baseModule/components/layout/types";
import { useTranslation } from "@/lib/i18n/client";

const MAX_VISIBLE_TOPICS = 3;

interface TopicNavigationProps {
  dropdownAnchorEl: HTMLDivElement | null;
  topics: NavigationItem[];
}

export function TopicNavigation(props: TopicNavigationProps) {
  const { dropdownAnchorEl, topics } = props;
  const { t } = useTranslation("header");
  const visibleTopics = topics.slice(0, MAX_VISIBLE_TOPICS);
  const moreTopics = topics.slice(MAX_VISIBLE_TOPICS);
  const moreTopicsCategory: NavigationCategory = {
    name: t("nav.more_topics"),
    items: moreTopics,
  };

  return (
    <Box
      component="nav"
      display="flex"
      flexDirection="row"
      flex={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" gap={3}>
        {visibleTopics.map((visibleTopic) =>
          isNavigationLink(visibleTopic) ? (
            <TopicLinkButton key={visibleTopic.name} link={visibleTopic} />
          ) : (
            <TopicMenuDropdownButton
              key={visibleTopic.name}
              category={visibleTopic}
              dropdownAnchorEl={dropdownAnchorEl}
            />
          ),
        )}
      </Stack>
      {moreTopics.length > 0 ? (
        <TopicMenuDropdownButton
          key={moreTopicsCategory.name}
          category={moreTopicsCategory}
          startDecorator={<MenuOutlined />}
          dropdownAnchorEl={dropdownAnchorEl}
        />
      ) : null}
    </Box>
  );
}
