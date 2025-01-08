/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Grid, Typography } from "@mui/joy";

import {
  useGetContactHistoryQuery,
  useGetContactQuery,
} from "@/lib/baseModule/api/queries/contacts";
import { ContactDetails } from "@/lib/baseModule/components/contacts/ContactDetails";
import { fullContactName } from "@/lib/baseModule/components/contacts/helpers";
import { ContactHistory } from "@/lib/baseModule/components/contacts/history/ContactHistory";
import { routes } from "@/lib/baseModule/shared/routes";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ContactDetailsPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const { data: contact } = useGetContactQuery(params.id);
  const { data: history } = useGetContactHistoryQuery({ id: params.id });

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={fullContactName(contact)}
          backHref={routes.contacts.index}
        />
      }
    >
      <MainContentLayout>
        <Grid container spacing={3}>
          <Grid xxs={12} md={8}>
            <ContactDetails contact={contact} />
          </Grid>
          <Grid xxs={12} md>
            <ContentPanel testId={"contact-change-history"}>
              <Box
                component={"section"}
                sx={{ display: "contents" }}
                aria-labelledby={"contact-change-history-title"}
              >
                <Typography
                  level={"title-lg"}
                  id={"contact-change-history-title"}
                >
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
