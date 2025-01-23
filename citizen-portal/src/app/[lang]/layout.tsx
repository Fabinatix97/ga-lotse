/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";

import { AppLayout } from "@/lib/baseModule/components/layout/AppLayout";
import { BaseTranslation, baseTranslations } from "@/lib/baseModule/locales";
import { SupportedLanguage, options } from "@/lib/i18n/options";

export default function Layout({
  params: { lang },
  children,
}: Readonly<{
  params: { lang: string };
  children: ReactNode;
}>) {
  return <AppLayout lang={lang}>{children}</AppLayout>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return options.supportedLngs.map((lang) => ({ lang }));
}

export function generateMetadata(
  { params: { lang } }: { params: { lang: SupportedLanguage } },
  _parentMeta: ResolvingMetadata,
): Metadata {
  const translations: BaseTranslation = baseTranslations[lang];
  return {
    title: translations.site_title,
    description: translations.site_description,
    keywords: translations.site_keywords,
  };
}
