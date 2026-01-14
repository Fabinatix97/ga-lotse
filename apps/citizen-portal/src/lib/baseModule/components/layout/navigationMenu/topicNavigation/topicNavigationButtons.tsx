/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dropdown, MenuButton, Theme, styled } from "@mui/joy";
import { usePathname } from "next/navigation";
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useState,
} from "react";
import { isDefined } from "remeda";

import { isItemSelected } from "@/lib/baseModule/components/layout/navigationMenu/isItemSelected";
import {
  KEEP_MENU_OPEN_MARKER,
  TopicDropdownMenu,
} from "@/lib/baseModule/components/layout/navigationMenu/topicNavigation/TopicDropdownMenu";
import {
  NavigationCategory,
  NavigationLink,
} from "@/lib/baseModule/components/layout/types";
import { ScopedInternalLinkButton } from "@/lib/shared/components/scopedLinks";

const TOPIC_BUTTON_PROPS = {
  variant: "plain",
  size: "lg",
  color: "primary",
} as const;

function buttonStyles(
  theme: Theme,
  activeSelector: string,
  toggledSelector?: string,
) {
  return {
    color: theme.palette.neutral.plainColor,
    paddingInline: theme.spacing(2),
    paddingBlock: theme.spacing(0.5),
    "&:hover": {
      color: theme.palette.primary.plainColor,
    },
    [`&[${activeSelector}]`]: {
      color: theme.palette.primary.plainColor,
    },
    ...(isDefined(toggledSelector)
      ? {
          [`&[${toggledSelector}]`]: {
            color: theme.palette.primary.plainColor,
            backgroundColor: theme.palette.primary.plainActiveBg,
          },
        }
      : {}),
  };
}

interface TopicLinkButtonProps {
  link: NavigationLink;
}

export function TopicLinkButton(props: TopicLinkButtonProps) {
  const { link } = props;
  const pathname = usePathname();
  const isSelected = isItemSelected(link, pathname);

  return (
    <StyledInternalLinkButton
      {...TOPIC_BUTTON_PROPS}
      href={link.href}
      aria-current={isSelected ? "page" : false}
    >
      {link.name}
    </StyledInternalLinkButton>
  );
}

const StyledInternalLinkButton = styled(ScopedInternalLinkButton)(({ theme }) =>
  buttonStyles(theme, "aria-current='page'"),
);

interface TopicMenuDropdownButtonProps {
  category: NavigationCategory;
  dropdownAnchorEl: HTMLDivElement | null;
  startDecorator?: ReactNode;
}

export function TopicMenuDropdownButton(props: TopicMenuDropdownButtonProps) {
  const { category, dropdownAnchorEl, startDecorator } = props;
  const pathname = usePathname();
  const isSelected = isItemSelected(category, pathname);
  const [open, setOpen] = useState(false);

  function handleOnOpenChange(
    event: MouseEvent | KeyboardEvent | FocusEvent | null,
    open: boolean,
  ): void {
    if (!open && shouldKeepMenuOpen(event)) {
      return;
    }
    setOpen(open);
  }

  return (
    <Dropdown open={open} onOpenChange={handleOnOpenChange}>
      <StyledMenuButton
        {...TOPIC_BUTTON_PROPS}
        startDecorator={startDecorator}
        aria-current={isSelected}
      >
        {category.name}
      </StyledMenuButton>
      <TopicDropdownMenu category={category} anchorEl={dropdownAnchorEl} />
    </Dropdown>
  );
}

const StyledMenuButton = styled(MenuButton)(({ theme }) =>
  buttonStyles(theme, "aria-current=true", "aria-expanded=true"),
);

function shouldKeepMenuOpen(
  event: MouseEvent | KeyboardEvent | FocusEvent | null,
): boolean {
  if (event === null) {
    return false;
  }

  // ignore events which are not related to menu navigation
  if (!(event.type === "click" || event.type === "keyup")) {
    return false;
  }

  const eventTarget = event.target;
  if (!(eventTarget instanceof HTMLElement)) {
    return false;
  }

  const relatedListItem = eventTarget.closest("li");
  if (relatedListItem === null) {
    return false;
  }

  return relatedListItem.getAttribute(KEEP_MENU_OPEN_MARKER) === "true";
}
