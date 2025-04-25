/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Typography } from "@mui/joy";

import { ApiConcern } from "@eshg/sti-protection-api";

import { ContactAndAvailability } from "@/lib/businessModules/stiProtection/components/ContactAndAvailability";
import { TranslatedList } from "@/lib/businessModules/stiProtection/components/shared/TranslatedList";
import { useTranslation } from "@/lib/i18n/client";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { GridColumnStack } from "@/lib/shared/components/layout/grid";

interface LandingpageContentProps {
  concern: ApiConcern;
}

export function LandingpageContent({ concern }: LandingpageContentProps) {
  const { t } = useTranslation("stiProtection/overview");

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>{t("information.title")}</ContentSheetTitle>
        <Typography>{t("information.invitation")}</Typography>
        <Typography>{t("information.cancellation")}</Typography>

        <TranslatedList
          baseKey="information"
          headingKey="applies_to_heading"
          listKey="applies_to_list"
          localePath="stiProtection/overview"
        />

        <TranslatedList
          baseKey="information"
          headingKey="tests_available_heading"
          listKey="tests_available_list"
          localePath="stiProtection/overview"
        />

        <TranslatedList
          baseKey="information"
          headingKey="exceptions_heading"
          listKey="exceptions_list"
          localePath="stiProtection/overview"
        />
      </ContentSheet>
      <ContactAndAvailability concern={concern} />
    </GridColumnStack>
  );
}
