/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DynamicLayoutProps,
  RouteParams,
} from "@eshg/lib-portal/types/pageParams";
import { Metadata, ResolvingMetadata } from "next";
import * as v from "valibot";

import { AppLayout } from "@/lib/baseModule/components/layout/AppLayout";
import { BaseTranslation, baseTranslations } from "@/lib/baseModule/locales";
import { options, supportedLanguages } from "@/lib/i18n/options";

const RouteParamsSchema = v.object({
  lang: v.picklist(supportedLanguages),
});

export default async function Layout(props: DynamicLayoutProps) {
  const { lang } = await parseRouteParams(props.params);

  return <AppLayout lang={lang}>{props.children}</AppLayout>;
}
export const dynamicParams = false;

export function generateStaticParams() {
  return options.supportedLngs.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: DynamicLayoutProps,
  _parentMeta: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await parseRouteParams(props.params);

  const translations: BaseTranslation = baseTranslations[lang];
  return {
    title: translations.site_title,
    description: translations.site_description,
    keywords: translations.site_keywords,
  };
}

async function parseRouteParams(routeParams: Promise<RouteParams>) {
  return v.parse(RouteParamsSchema, await routeParams);
}
