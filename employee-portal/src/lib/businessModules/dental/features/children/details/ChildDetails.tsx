/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChildDetails } from "@eshg/dental";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { Divider, Grid, Stack } from "@mui/joy";

import { AnnualInstitutionsTable } from "@/lib/businessModules/dental/features/children/details/AnnualInstitutionsTable";
import { useUpdateAnnualChildSidebar } from "@/lib/businessModules/dental/features/children/details/UpdateAnnualChildSidebar";
import { FluoridationConsentInformationSection } from "@/lib/businessModules/dental/shared/FluoridationConsentInformationSection";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

interface ChildDetailsProps {
  child: ChildDetails;
  isFetching: boolean;
}

export function ChildDetailsPage(props: ChildDetailsProps) {
  const child = props.child;
  const updateAnnualChildSidebar = useUpdateAnnualChildSidebar();
  const disabled = useIsFormDisabled();

  return (
    <PageGrid>
      <Grid xs={8}>
        <Stack spacing={SPACING}>
          <ContentPanel>
            <DetailsSection title="Kind">
              <CentralFilePersonDetails person={child} />
            </DetailsSection>
          </ContentPanel>
          <ContentPanel>
            <DetailsSection title="Besuchte Einrichtungen">
              <AnnualInstitutionsTable
                institutions={child.institutions}
                isFetching={props.isFetching}
              />
            </DetailsSection>
          </ContentPanel>
        </Stack>
      </Grid>
      <Grid xs={4}>
        <ContentPanel>
          <DetailsSection
            title="Zusatzinfos"
            onEdit={() => updateAnnualChildSidebar.open({ child: child })}
            canEdit={!disabled}
          >
            <Stack gap={1}>
              <DetailsItem label="Einrichtung" value={child.institution.name} />
              <DetailsItem label="Gruppe" value={child.groupName} />
              <Divider orientation="horizontal" />
              <FluoridationConsentInformationSection
                allFluoridationConsents={child.allFluoridationConsents}
              />
            </Stack>
          </DetailsSection>
        </ContentPanel>
      </Grid>
    </PageGrid>
  );
}
