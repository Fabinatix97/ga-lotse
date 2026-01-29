/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigateNextOutlined } from "@mui/icons-material";
import { ListItemDecorator, Theme } from "@mui/joy";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

import { isItemSelected } from "@/lib/baseModule/components/layout/navigationMenu/isItemSelected";
import { topicMenuItemStyles } from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/styles";
import { NavigationCategory } from "@/lib/baseModule/components/layout/types";

type TopicMenuCategoryButtonComponent = (
  props: TopicMenuCategoryButtonComponentProps,
) => ReactNode;

export interface TopicMenuCategoryButtonComponentProps extends RequiresChildren {
  onClick: () => void;
}

interface TopicMenuCategoryButtonProps {
  component: TopicMenuCategoryButtonComponent;
  category: NavigationCategory;
  onClick: () => void;
}

export function TopicMenuCategoryButton(props: TopicMenuCategoryButtonProps) {
  const { component: ButtonComponent, category, ...itemProps } = props;
  const pathname = usePathname();
  const isSelected = isItemSelected(category, pathname);

  return (
    <ButtonComponent {...itemProps} aria-current={isSelected}>
      {category.name}
      <ListItemDecorator>
        <NavigateNextOutlined size="md" />
      </ListItemDecorator>
    </ButtonComponent>
  );
}

export function topicMenuCategoryButtonStyles(theme: Theme) {
  return {
    ...topicMenuItemStyles(theme),
    justifyContent: "space-between",
  } as const;
}
