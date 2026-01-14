/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation as useTranslationI18next } from "react-i18next";

import { i18nNamespace } from "./namespace";

export function useTranslation() {
  return useTranslationI18next(i18nNamespace);
}
