/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentPanel, PageGrid } from "@eshg/lib-employee-portal";
import { DisabledFormProvider } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";
import { Grid, Stack } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useDentalApi } from "@/contexts/dental";
import { getChildDetailsQuery } from "@/features/children/api/queries/details";
import { AdditionalInformationDetailsSection } from "@/features/children/components/childDetails/AdditionalInformationDetailsSection";
import { ChildDetailsSection } from "@/features/children/components/childDetails/ChildDetailsSection";
import { InstitutionHistoryDetailsSection } from "@/features/children/components/childDetails/InstitutionHistoryDetailsSection";
import { useChildRouteParams } from "@/features/children/hooks/useChildRouteParams";
import { DentalChildRouteParams } from "@/features/children/schemas/DentalChildRouteParams";

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

export function DentalChildDetailsPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);
  const { childApi } = useDentalApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );

  return (
    <DisabledFormProvider disabled={child.isClosed}>
      <PageGrid>
        <Grid xs={8}>
          <Stack spacing={SPACING}>
            <ContentPanel>
              <ChildDetailsSection child={child} />
            </ContentPanel>
            <ContentPanel>
              <InstitutionHistoryDetailsSection
                institutions={child.institutions}
              />
            </ContentPanel>
          </Stack>
        </Grid>
        <Grid xs={4}>
          <ContentPanel>
            <AdditionalInformationDetailsSection child={child} />
          </ContentPanel>
        </Grid>
      </PageGrid>
    </DisabledFormProvider>
  );
}
