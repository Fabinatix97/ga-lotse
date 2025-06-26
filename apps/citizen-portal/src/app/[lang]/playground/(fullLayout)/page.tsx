/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { List, ListItem } from "@mui/joy";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";
import { ScopedInternalLink } from "@/lib/shared/components/scopedLinks";

export default function CitizenSchoolEntryPage() {
  return (
    <PageLayout>
      <PageContent>
        <PageTitle>Playground</PageTitle>
        <ContentSheet>
          <List marker="disc">
            <ListItem>
              <ScopedInternalLink href="/playground/snackbar">
                Snackbar
              </ScopedInternalLink>
            </ListItem>
            <ListItem>
              <ScopedInternalLink href="/playground/alert">
                Alert
              </ScopedInternalLink>
            </ListItem>
          </List>
        </ContentSheet>
      </PageContent>
    </PageLayout>
  );
}
