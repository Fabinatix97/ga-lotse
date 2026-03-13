/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Metadata, ResolvingMetadata } from "next";
import * as v from "valibot";

import { DynamicLayoutProps } from "@eshg/lib-portal";

import { AppLayout } from "@/lib/baseModule/components/layout/AppLayout";
import { getBaseTranslation } from "@/lib/baseModule/locales";
import { options, supportedLanguages } from "@/lib/i18n/options";

const RouteParamsSchema = v.object({
  lang: v.picklist(supportedLanguages),
});

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = { lang: string };

export default async function Layout(props: DynamicLayoutProps<RouteParams>) {
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

  return {
    description: getBaseTranslation(lang, "site_description"),
    keywords: getBaseTranslation(lang, "site_keywords"),
  };
}

async function parseRouteParams(routeParams: Promise<RouteParams>) {
  return v.parse(RouteParamsSchema, await routeParams);
}
