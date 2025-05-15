/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { isDefined } from "remeda";

import { ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { useGetLinkedReferenceFacility } from "@/lib/baseModule/api/queries/mukFacilityLink";
import { GdprContactForm } from "@/lib/baseModule/components/gdpr/form/GdprContactForm";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { AddressFields } from "@/lib/shared/components/centralFile/AddressFields";
import {
  BaseFacilityFields,
  ContactPersonFields,
} from "@/lib/shared/components/centralFile/BaseFacilityFields";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function OrganizationProfilePage() {
  const { t } = useTranslation("translation");
  const { data: linkedFacility } = useGetLinkedReferenceFacility();

  return (
    <PageLayout>
      <PageContent>
        <PageTitle>{t("common.organization_profile")}</PageTitle>

        <QueryBoundary>
          <TwoColumnGrid
            content={<ProfileContent linkedFacility={linkedFacility} />}
            sidePanel={<GdprContactForm />}
          />
        </QueryBoundary>
      </PageContent>
    </PageLayout>
  );
}

function ProfileContent({
  linkedFacility,
}: {
  linkedFacility: ApiGetReferenceFacilityResponse | "not found";
}) {
  const { t } = useTranslation("translation");
  if (linkedFacility === "not found") {
    return (
      <ContentSheet>
        <ContentSheetTitle>
          {t("gdpr:profile.unlinked.title")}
        </ContentSheetTitle>
        {t("gdpr:profile.unlinked.description")}
      </ContentSheet>
    );
  }

  return (
    <div>
      <ContentSheet>
        <ContentSheetTitle>{linkedFacility.name}</ContentSheetTitle>

        <Grid
          container
          spacing={2}
          columns={byBreakpoint({ mobile: 1, desktop: 2 })}
        >
          <BaseFacilityFields facility={linkedFacility} />
        </Grid>
      </ContentSheet>

      {isDefined(linkedFacility.differentBillingAddress) && (
        <ContentSheet>
          <ContentSheetTitle>
            {t("common.different_billing_address")}
          </ContentSheetTitle>
          <Grid
            container
            spacing={2}
            columns={byBreakpoint({ mobile: 1, desktop: 2 })}
          >
            <AddressFields address={linkedFacility.differentBillingAddress} />
          </Grid>
        </ContentSheet>
      )}

      {linkedFacility.contactPersons.map((contactPerson, index) => (
        <ContentSheet key={index}>
          <ContentSheetTitle>
            {t("common.contact_person")}
            {" - "}
            {formatPersonName({
              firstName: contactPerson.firstName,
              lastName: contactPerson.lastName,
            })}
          </ContentSheetTitle>
          <Grid
            container
            spacing={2}
            columns={byBreakpoint({ mobile: 1, desktop: 2 })}
          >
            <ContactPersonFields contactPerson={contactPerson} />
          </Grid>
        </ContentSheet>
      ))}
    </div>
  );
}
