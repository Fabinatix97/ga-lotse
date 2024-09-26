/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { List, ListItem } from "@mui/joy";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenSchoolEntryPage() {
  return (
    <PageLayout>
      <PageContent>
        <PageTitle>Playground</PageTitle>
        <List marker="disc">
          <ListItem>
            <InternalLink href="/playground/snackbar">Snackbar</InternalLink>
          </ListItem>
        </List>
      </PageContent>
    </PageLayout>
  );
}
