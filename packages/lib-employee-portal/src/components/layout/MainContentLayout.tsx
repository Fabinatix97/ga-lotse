/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertSlot } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Stack, StackProps, styled } from "@mui/joy";

interface MainContentLayoutProps extends StackProps {
  /**
   * If true, the layout will limit it's height to the height of the viewport.
   * This can be used to create an app-like layout.
   */
  fullViewportHeight?: boolean;
}

const LayoutStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "fullViewportHeight",
})<MainContentLayoutProps>(({ fullViewportHeight, theme }) => ({
  height: fullViewportHeight ? "100%" : undefined,
  paddingBlock: theme.spacing(3),

  marginInline: theme.spacing(3),
}));

const AlertContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  marginBlockEnd: theme.spacing(3),
}));

/**
 * This layout applies global margin or padding to it's children.
 *
 * This component should be directly used in page.tsx or layout.tsx files.
 * It may be put inside a StickyToolbarLayout if a toolbar is desired.
 *
 * This component wraps the children in a Stack component which is a flex container.
 *
 * If fullViewportHeight is set to true, one of the children should be a scroll container (overflowY: "auto") that takes all the available height by setting flex: 1.
 *
 * Instead, if fullViewportHeight is set to false, the layout behaves like in a regular flow layout.
 */
export function MainContentLayout(props: MainContentLayoutProps) {
  const { children, ...stackProps } = props;
  return (
    <LayoutStack
      {...stackProps}
      className={props.fullViewportHeight ? "fullViewportHeight" : undefined}
    >
      <AlertSlot container={AlertContainer} />
      {children}
    </LayoutStack>
  );
}
