/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "./react";

export interface PageProps<TSearchParams extends PageParams = PageParams> {
  readonly searchParams: SearchParams<TSearchParams>;
}

export interface DynamicPageProps<
  TRouteParams extends PageParams = PageParams,
  TSearchParams extends PageParams = PageParams,
> {
  readonly params: RouteParams<TRouteParams>;
  readonly searchParams: SearchParams<TSearchParams>;
}

export type LayoutProps = RequiresChildren;

export interface DynamicLayoutProps<TRouteParams extends PageParams = never>
  extends LayoutProps {
  readonly params: RouteParams<TRouteParams>;
}

export type RouteParams<TParams extends PageParams = PageParams> =
  Readonly<TParams>;

export type SearchParams<TParams extends PageParams = PageParams> = Partial<
  Readonly<TParams>
>;

type PageParams = Record<string, PageParamValue>;

type PageParamValue = string | string[] | undefined;
