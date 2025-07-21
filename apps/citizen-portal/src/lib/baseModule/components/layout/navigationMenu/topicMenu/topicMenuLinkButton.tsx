/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Theme } from "@mui/joy";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

import { isItemSelected } from "@/lib/baseModule/components/layout/navigationMenu/isItemSelected";
import { topicMenuItemStyles } from "@/lib/baseModule/components/layout/navigationMenu/topicMenu/styles";
import { NavigationLink } from "@/lib/baseModule/components/layout/types";

type TopicMenuLinkComponent = (props: TopicMenuLinkComponentProps) => ReactNode;

export interface TopicMenuLinkComponentProps extends RequiresChildren {
  href: string;
}

interface TopicMenuLinkButtonProps {
  component: TopicMenuLinkComponent;
  link: NavigationLink;
}

export function TopicMenuLinkButton(props: TopicMenuLinkButtonProps) {
  const { component: LinkComponent, link, ...buttonProps } = props;
  const pathname = usePathname();
  const isSelected = isItemSelected(link, pathname);

  return (
    <LinkComponent
      {...buttonProps}
      href={link.href}
      aria-current={isSelected ? "page" : false}
    >
      {link.name}
    </LinkComponent>
  );
}

export function topicMenuLinkButtonStyles(theme: Theme) {
  return {
    ...topicMenuItemStyles(theme),
    "&:hover": { textDecoration: "none" },
  };
}
