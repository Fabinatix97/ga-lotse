/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { List, ListItem } from "@mui/joy";

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenSchoolEntryPage() {
  return (
    <PageLayout>
      <PageContent>
        <PageTitle>Playground</PageTitle>
        <ContentSheet>
          <List marker="disc">
            <ListItem>
              <InternalLink href="/playground/snackbar">Snackbar</InternalLink>
            </ListItem>
            <ListItem>
              <InternalLink href="/playground/alert">Alert</InternalLink>
            </ListItem>
          </List>
        </ContentSheet>
      </PageContent>
    </PageLayout>
  );
}
