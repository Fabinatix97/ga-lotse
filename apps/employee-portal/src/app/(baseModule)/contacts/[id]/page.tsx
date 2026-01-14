/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Grid, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { use } from "react";

import {
  ContentPanel,
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
  useGetContactQueryOptions,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";

import { useGetContactHistoryQueryOptions } from "@/lib/baseModule/api/queries/contacts";
import { ContactDetails } from "@/lib/baseModule/components/contacts/ContactDetails";
import { fullContactName } from "@/lib/baseModule/components/contacts/helpers";
import { ContactHistory } from "@/lib/baseModule/components/contacts/history/ContactHistory";
import { routes } from "@/lib/baseModule/shared/routes";

export default function ContactDetailsPage(
  props: DynamicPageProps<{
    id: string;
  }>,
) {
  const { id } = use(props.params);
  const [{ data: contact }, { data: history }] = useSuspenseQueries({
    queries: [
      useGetContactQueryOptions(id),
      useGetContactHistoryQueryOptions({ id }),
    ],
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={fullContactName(contact)}
          backButton={<ToolbarBackButton href={routes.contacts.index} />}
        />
      }
    >
      <MainContentLayout>
        <Grid container spacing={3}>
          <Grid xxs={12} md={8}>
            <ContactDetails contact={contact} />
          </Grid>
          <Grid xxs={12} md>
            <ContentPanel testId="contact-change-history">
              <Box
                component="section"
                sx={{ display: "contents" }}
                aria-labelledby="contact-change-history-title"
              >
                <Typography level="title-lg" id="contact-change-history-title">
                  Historie
                </Typography>
                <ContactHistory history={history} />
              </Box>
            </ContentPanel>
          </Grid>
        </Grid>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
