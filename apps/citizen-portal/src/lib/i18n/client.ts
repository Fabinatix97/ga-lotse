/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Typography, TypographyProps } from "@mui/joy";
import assert from "assert";
import { TOptions, createInstance, type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { ReactElement, createElement, memo, useCallback } from "react";
import {
  Trans,
  UseTranslationOptions,
  initReactI18next,
  useTranslation,
} from "react-i18next";
import { flat, isArray, isNonNullish, pipe, unique } from "remeda";

import { options, resourceResolver } from "@/lib/i18n/options";

const cache: Record<string, i18n> = {};
export function getClient(lang: string) {
  const cacheHit = cache[lang];
  if (cacheHit) {
    return cacheHit;
  }
  const newClient = createClient(lang);
  cache[lang] = newClient;
  return newClient;
}

function createClient(lang: string) {
  const client = createInstance({
    ...options,
    lng: lang,
    fallbackLng: lang,
  })
    .use(initReactI18next)
    .use(resourcesToBackend(resourceResolver));

  void client.init();
  return client;
}

function loadNamespace(key: string | string[] | undefined, i18n: i18n) {
  const firstKey = key instanceof Array ? key[0] : key;
  const nsIndex = firstKey?.indexOf(":") ?? -1;
  const ns = nsIndex >= 0 ? firstKey?.slice(0, nsIndex) : undefined;
  if (ns && !i18n.hasLoadedNamespace(ns)) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Promise((resolve) => {
      void i18n.loadNamespaces(ns, resolve);
    });
  }
}

function useTranslationWrapper(
  ns?: string | string[],
  options?: UseTranslationOptions<undefined>,
) {
  const { t, i18n, ready } = useTranslation(ns, options);
  const tFunction = useCallback(
    (key: string | string[], tOptions?: TOptions) => {
      loadNamespace(key, i18n);
      return t(key, tOptions);
    },
    [i18n, t],
  );
  const CustomTrans = createTrans(ns, i18n);
  return {
    t: useTWithCamelCase(tFunction),
    i18n,
    ready,
    Trans: CustomTrans,
    TransTypography: createTransTypography(CustomTrans),
  };
}

export function createTransTypography(Trans: CustomTransComponent) {
  const component = memo(
    ({
      i18nKey,
      ns,
      components,
      shouldUnescape,
      ...typographyProps
    }: TransProps & Omit<TypographyProps, "children">) =>
      createElement(
        Typography,
        {
          ...typographyProps,
        },
        createElement(Trans, {
          i18nKey,
          ns,
          components,
          shouldUnescape,
        }),
      ),
  );
  component.displayName = "TransTypography";
  return component;
}
interface TransProps {
  i18nKey: string;
  ns?: string;
  components?: Record<string, ReactElement>;
  shouldUnescape?: boolean;
}
type CustomTransComponent = ReturnType<typeof createTrans>;
export function createTrans(
  namespace: string | string[] | undefined,
  i18n: i18n,
) {
  const component = memo(({ ...props }: TransProps) => {
    const givenNamespace = props.ns ?? namespace;
    assert.ok(
      !isArray(givenNamespace),
      "Multiple namespaces aren't supported with the <Trans /> component",
    );
    loadNamespace(props.i18nKey, i18n);
    return createElement(Trans, {
      shouldUnescape: true,
      ...props,
      components: {
        p: createElement("p"),
        mark: createElement("mark"),
        strong: createElement("strong"),
        u: createElement("u"),
        em: createElement("em"),
        ...props.components,
      },
      ns: givenNamespace,
    });
  });
  component.displayName = "Trans";
  return component;
}

export type TranslateFn = (
  key: string | string[],
  tOptions?: TOptions,
) => string;

function fromSnakeToCamel(snakeCase: string): string {
  return snakeCase
    .split(".")
    .map((keyPart) => {
      const words = keyPart.split("_");
      const capitalizedWords = words
        .slice(1)
        .map((t) => t[0]?.toUpperCase() + t.slice(1));
      return [words[0], ...capitalizedWords].join("");
    })
    .join(".");
}

function useTWithCamelCase(t: TranslateFn): TranslateFn {
  return useCallback(
    (args, tOptions) => {
      const keys: string[] = (isArray(args) ? args : [args]).filter(
        isNonNullish,
      );
      if (keys.length === 0) {
        return t(args, tOptions);
      }
      const newKeys: string[] = pipe(
        keys.map((k) => [fromSnakeToCamel(k), k]),
        flat(),
        unique(),
      );
      return t(newKeys, tOptions);
    },
    [t],
  );
}

export { useTranslationWrapper as useTranslation };
