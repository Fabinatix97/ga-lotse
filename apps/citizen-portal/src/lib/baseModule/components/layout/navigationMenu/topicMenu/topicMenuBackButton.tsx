/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NavigateBeforeOutlined } from "@mui/icons-material";
import { ListItemDecorator, Theme } from "@mui/joy";
import { ReactNode } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

import { topicMenuItemStyles } from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/styles";
import { useTranslation } from "@/lib/i18n/client";

type TopicMenuBackButtonComponent = (
  props: TopicMenuBackButtonComponentProps,
) => ReactNode;

export interface TopicMenuBackButtonComponentProps extends RequiresChildren {
  onClick: () => void;
}

interface TopicMenuBackButtonProps {
  component: TopicMenuBackButtonComponent;
  onClick: () => void;
}

export function TopicMenuBackButton(props: TopicMenuBackButtonProps) {
  const { component: ButtonComponent, ...buttonProps } = props;
  const { t } = useTranslation("header");

  return (
    <ButtonComponent {...buttonProps}>
      <ListItemDecorator>
        <NavigateBeforeOutlined size="md" />
      </ListItemDecorator>
      {t("nav.back_button")}
    </ButtonComponent>
  );
}

export function topicMenuBackButtonStyles(theme: Theme) {
  return {
    ...topicMenuItemStyles(theme),
    color: theme.palette.primary.plainColor,
  } as const;
}
