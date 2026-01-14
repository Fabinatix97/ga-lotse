/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { BaseErrorModal, ErrorModalProps } from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";

export function CitizenPortalErrorModal({
  title,
  ...props
}: Readonly<ErrorModalProps>) {
  const { t } = useTranslation();

  const fallbackTitle = t("error.title");

  return <BaseErrorModal title={title ?? fallbackTitle} {...props} />;
}
