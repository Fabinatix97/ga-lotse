/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";

import { getClient } from "./client";

export function I18nProvider({
  children,
  lang,
}: PropsWithChildren<{ lang: string }>) {
  const client = getClient(lang);
  return <I18nextProvider i18n={client}>{children}</I18nextProvider>;
}
