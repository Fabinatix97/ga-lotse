/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Typography } from "@mui/joy";
import assert from "assert";
import { isArray, isString } from "remeda";

import { useTranslation } from "@/lib/i18n/client";

interface TranslatedListProps {
  baseKey: string;
  headingKey: string;
  listKey: string;
  localePath: string;
}

export function TranslatedList({
  baseKey,
  headingKey,
  listKey,
  localePath,
}: TranslatedListProps) {
  const { t } = useTranslation(localePath);
  const fullListKey = `${baseKey}.${listKey}`;
  const list = t(fullListKey, { returnObjects: true }) as unknown;
  assert.ok(
    isArrayOf(list, isString),
    `${localePath}:${fullListKey} isn't an array of strings! (${JSON.stringify(list)})`,
  );
  return (
    <div>
      <Typography level="title-md">{t(`${baseKey}.${headingKey}`)}</Typography>
      <Box component="ul" sx={{ margin: 1, paddingLeft: 2 }}>
        {list.map((value, index) => (
          <Typography key={index} component="li" sx={{ display: "list-item" }}>
            {value}
          </Typography>
        ))}
      </Box>
    </div>
  );
}

type ShowsIs<K> = (k: unknown) => k is K;
function isArrayOf<K>(t: unknown, predicate: ShowsIs<K>): t is K[] {
  return isArray(t) && t.every(predicate);
}
