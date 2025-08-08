/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PropsWithChildren } from "react";

import { DocumentTitleProvider, useTranslation } from "@eshg/lib-portal";

import { useDepartmentName } from "@/lib/shared/hooks/useDepartmentName";

export function ClientLayout({ children }: Readonly<PropsWithChildren>) {
  const { t } = useTranslation();
  const name = useDepartmentName();

  return (
    <DocumentTitleProvider defaultTitle={`${t("site_title")} ${name}`}>
      {children}
    </DocumentTitleProvider>
  );
}
