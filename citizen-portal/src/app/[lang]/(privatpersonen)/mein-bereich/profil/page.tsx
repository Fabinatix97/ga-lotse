/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { isDefined } from "remeda";

import { useGetLinkedReferencePerson } from "@/lib/baseModule/api/queries/bundIdLink";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { AddressFields } from "@/lib/shared/components/centralFile/AddressFields";
import { BasePersonFields } from "@/lib/shared/components/centralFile/BasePersonFields";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function IndividualProfilePage() {
  const { t } = useTranslation("translation");
  const { data: linkedPerson } = useGetLinkedReferencePerson();

  return (
    <PageLayout>
      <PageContent>
        <PageTitle>{t("common.individual_profile")}</PageTitle>

        {linkedPerson === "not found" ? (
          <ContentSheet>
            <ContentSheetTitle>Platzhalter</ContentSheetTitle>
            Hier könnte Ihre Werbung stehen.
          </ContentSheet>
        ) : (
          <>
            <ContentSheet>
              <ContentSheetTitle>{t("common.personal_data")}</ContentSheetTitle>

              <Grid
                container
                spacing={2}
                columns={byBreakpoint({ mobile: 1, desktop: 2 })}
              >
                <BasePersonFields person={linkedPerson} />
              </Grid>
            </ContentSheet>

            {isDefined(linkedPerson.contactAddress) && (
              <ContentSheet>
                <ContentSheetTitle>{t("common.contact")}</ContentSheetTitle>
                <Grid
                  container
                  spacing={2}
                  columns={byBreakpoint({ mobile: 1, desktop: 2 })}
                >
                  <AddressFields address={linkedPerson.contactAddress} />
                </Grid>
              </ContentSheet>
            )}

            {isDefined(linkedPerson.differentBillingAddress) && (
              <ContentSheet>
                <ContentSheetTitle>
                  {t("common.different_billing_address")}
                </ContentSheetTitle>
                <Grid
                  container
                  spacing={2}
                  columns={byBreakpoint({ mobile: 1, desktop: 2 })}
                >
                  <AddressFields
                    address={linkedPerson.differentBillingAddress}
                  />
                </Grid>
              </ContentSheet>
            )}
          </>
        )}
      </PageContent>
    </PageLayout>
  );
}
