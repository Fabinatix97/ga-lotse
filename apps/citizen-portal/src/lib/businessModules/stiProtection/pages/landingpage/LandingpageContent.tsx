/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiConcern } from "@eshg/sti-protection-api";

import { ContactAndAvailability } from "@/lib/businessModules/stiProtection/components/ContactAndAvailability";
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
  const { t, TransTypography } = useTranslation("stiProtection/overview");
  const isSexWork = concern === ApiConcern.SexWork;
  const i18nPrefix = isSexWork ? "sex_work" : "sti_consultation";

  return (
    <GridColumnStack>
      <ContentSheet>
        <ContentSheetTitle>
          {t(`${i18nPrefix}.information.title`)}
        </ContentSheetTitle>
        <TransTypography i18nKey={`${i18nPrefix}.information.offer`} />
        {isSexWork ? null : (
          <TransTypography i18nKey={`${i18nPrefix}.information.applies_to`} />
        )}
        <TransTypography i18nKey={`${i18nPrefix}.information.test_results`} />
        <TransTypography i18nKey={`${i18nPrefix}.information.other_services`} />

        <section>
          <TransTypography
            level="title-md"
            i18nKey={`${i18nPrefix}.information.costs_heading`}
          />
          <TransTypography i18nKey={`${i18nPrefix}.information.costs_info`} />
        </section>
        <section>
          <TransTypography
            level="title-md"
            i18nKey={`${i18nPrefix}.information.notice_heading`}
          />
          <TransTypography i18nKey={`${i18nPrefix}.information.notice_info`} />
        </section>
      </ContentSheet>
      <ContactAndAvailability concern={concern} />
    </GridColumnStack>
  );
}
