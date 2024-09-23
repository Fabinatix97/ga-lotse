/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider, Theme } from "@mui/joy/styles";
import { ReactNode } from "react";

import { NextAppDirEmotionCacheProvider } from "./EmotionCache";

export function ThemeRegistry({
  children,
  theme,
  nonce,
}: {
  children: ReactNode;
  theme: Theme;
  nonce: string | undefined;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "joy", nonce }}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
