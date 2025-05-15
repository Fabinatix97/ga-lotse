/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, styled } from "@mui/joy";

import { AlertSlot } from "@eshg/lib-portal/errorHandling/AlertContext";
import { LayoutProps } from "@eshg/lib-portal/types/pageParams";

const AlertContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  marginBlockEnd: theme.spacing(3),
}));

const MainContents = styled("main")({
  display: "contents",
});

export function MainContentLayout({ children }: LayoutProps) {
  return (
    <MainContents>
      <AlertSlot container={AlertContainer} />
      {children}
    </MainContents>
  );
}
