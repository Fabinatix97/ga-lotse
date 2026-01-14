/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography, styled } from "@mui/joy";
import { useState } from "react";

import { NavigationCategory } from "@/lib/baseModule/components/layout/types";

interface TopicMenuState {
  currentCategory: NavigationCategory;
  categoryPath: NavigationCategory[];
}

export function useTopicMenu(rootCategory: NavigationCategory) {
  const [menuState, setMenuState] = useState<TopicMenuState>({
    currentCategory: rootCategory,
    categoryPath: [rootCategory],
  });

  function openCategory(category: NavigationCategory): void {
    setMenuState((state) => ({
      currentCategory: category,
      categoryPath: [...state.categoryPath, category],
    }));
  }

  function backToPreviousCategory(): void {
    setMenuState((state) => {
      const previousCategory = state.categoryPath.at(-2);

      if (previousCategory === undefined) {
        throw new Error("Category has no previous category");
      }

      return {
        currentCategory: previousCategory,
        categoryPath: state.categoryPath.slice(0, -1),
      };
    });
  }

  return {
    categoryPath: menuState.categoryPath,
    items: menuState.currentCategory.items,
    openCategory,
    backToPreviousCategory,
  };
}

interface TopicBreadcrumbsProps {
  id: string;
  categoryPath: NavigationCategory[];
}

export function TopicBreadcrumbs(props: TopicBreadcrumbsProps) {
  const { id, categoryPath } = props;

  return (
    <BreadcrumbsTypography id={id} level="body-md">
      {categoryPath.map((category) => category.name).join(" / ")}
    </BreadcrumbsTypography>
  );
}

const BreadcrumbsTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));
