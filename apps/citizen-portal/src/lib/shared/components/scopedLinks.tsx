/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-restricted-imports */
import { Link } from "@mui/joy";
import {
  AppRouterInstance,
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useCallback } from "react";

import {
  ExternalLink,
  ExternalLinkButton,
  InternalLink,
  InternalLinkButton,
  NavigationLink,
} from "@eshg/lib-portal";

import { supportedLanguages } from "@/lib/i18n/options";

/* eslint-enable no-restricted-imports */

/**
 * Login scopes are derived from the scoped defined in
 * backend/auth/src/main/resources/application-citizen-portal.properties
 */
const LOGIN_SCOPES = [
  "/einschulungsuntersuchung/termin",
  "/impfberatung/meine-termin",
  "/sexuelle-gesundheit/mein-bereich",
  "/amtsaerztlicherdienst/mein-bereich",
  "/mein-bereich",
  "/unternehmen",
];

export function useScopedRouter(): AppRouterInstance {
  const { push, replace, prefetch, ...originalRouterFunctions } = useRouter();
  const pathname = usePathname();

  const scopedPush = useCallback(
    (href: string, options?: NavigateOptions) =>
      isCompatibleScope(href, pathname) ? push(href, options) : hardLink(href),
    [pathname, push],
  );

  const scopedReplace = useCallback(
    (href: string, options?: NavigateOptions) =>
      isCompatibleScope(href, pathname)
        ? replace(href, options)
        : hardLink(href),
    [pathname, replace],
  );

  const scopedPrefetch = useCallback(
    (href: string, options?: PrefetchOptions) =>
      isCompatibleScope(href, pathname)
        ? prefetch(href, options)
        : hardLink(href),
    [pathname, prefetch],
  );

  return {
    ...originalRouterFunctions,
    push: scopedPush,
    replace: scopedReplace,
    prefetch: scopedPrefetch,
  };
}

interface ScopedLinkProps {
  href: string;
}

export function ScopedNavigationLink(
  props: ComponentProps<typeof NavigationLink> & ScopedLinkProps,
) {
  const pathname = usePathname();

  if (isCompatibleScope(props.href, pathname)) {
    return <NavigationLink {...props} />;
  }

  return <a {...props} />;
}

export function ScopedInternalLink(
  props: ComponentProps<typeof Link> & ScopedLinkProps,
) {
  const pathname = usePathname();

  if (isCompatibleScope(props.href, pathname)) {
    return <InternalLink {...props} />;
  }

  return <ExternalLink {...props} />;
}

export function ScopedInternalLinkButton(
  props: ComponentProps<typeof InternalLinkButton> & ScopedLinkProps,
) {
  const pathname = usePathname();

  if (isCompatibleScope(props.href, pathname)) {
    return <InternalLinkButton {...props} />;
  }

  return <ExternalLinkButton {...props} />;
}

export function isCompatibleScope(
  targetPath: string,
  currentPath: string,
): boolean {
  const targetScope = findAssociatedScope(targetPath);
  if (targetScope === undefined) {
    return true;
  }

  const currentScope = findAssociatedScope(currentPath);
  return targetScope === currentScope;
}

function findAssociatedScope(pathname: string): string | undefined {
  const normalizedPathname = normalizePathname(pathname);
  return LOGIN_SCOPES.find((loginScope) =>
    normalizedPathname.startsWith(loginScope),
  );
}

function normalizePathname(pathname: string): string {
  for (const supportedLanguage of supportedLanguages) {
    const languagePath = `/${supportedLanguage}`;
    if (pathname.startsWith(languagePath)) {
      return pathname.substring(languagePath.length);
    }
  }

  return pathname;
}

function hardLink(href: string): void {
  window.location.href = href;
}
