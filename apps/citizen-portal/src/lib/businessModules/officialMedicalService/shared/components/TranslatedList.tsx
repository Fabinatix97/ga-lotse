/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, ListProps } from "@mui/joy";

import { useTranslation } from "@/lib/i18n/client";

interface TranslatedListProps
  extends Pick<ListProps, "marker" | "component" | "sx"> {
  ns: string;
  translationKey: string;
}

export function TranslatedList({
  ns,
  translationKey,
  ...props
}: Readonly<TranslatedListProps>) {
  const { t } = useTranslation([ns]);
  const items = [...t(translationKey, { returnObjects: true })];

  return (
    <List
      marker={props.marker ?? "disc"}
      component={props.component ?? "ul"}
      sx={{
        "--List-gap:": "0.5px",
        "--ListItem-minHeight:": 0,
        "--ListItem-paddingY:": 0,
        "--ListDivider-gap:": 0,
        "--ListItem-paddingLeft:": 0,
        ...props.sx,
      }}
    >
      {items.map((item, index) => (
        <ListItem key={`${item}.${index}`}>{item}</ListItem>
      ))}
    </List>
  );
}
