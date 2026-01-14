/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ContactInformation } from "@/lib/baseModule/components/ContactInformation";
import { useTranslation } from "@/lib/i18n/client";
import { TitleAndSheetContentLayout } from "@/lib/shared/components/layout/TitleAndSheetContentLayout";

export default function ContactPage() {
  const { t } = useTranslation(["contact"]);
  return (
    <TitleAndSheetContentLayout pageTitle={t("pageTitle")}>
      <ContactInformation />
    </TitleAndSheetContentLayout>
  );
}
