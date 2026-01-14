/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Email, History, ThumbUp } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
// eslint-disable-next-line no-restricted-imports
import Link from "next/link";
import { ReactNode } from "react";

import { useTranslation } from "@/lib/i18n/client";

function LegalLink({
  category,
  startDecorator,
}: Readonly<{
  category: string;
  startDecorator: ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <ListItem sx={{ border: "none" }}>
      <ListItemButton
        component={Link}
        href={`/legal/${category}`}
        sx={{
          backgroundColor: (theme) => theme.palette.background.level2,
        }}
      >
        <ListItemDecorator>{startDecorator}</ListItemDecorator>
        <ListItemContent>{t(`legal.${category}.title`)}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

export function LegalLinkList() {
  return (
    <List sx={{ width: "max-content", flexGrow: 0 }}>
      <LegalLink category="acknowledgements" startDecorator={<ThumbUp />} />
      <LegalLink category="contact" startDecorator={<Email />} />
      <LegalLink category="releaseNotes" startDecorator={<History />} />
    </List>
  );
}
