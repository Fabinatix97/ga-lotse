/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";

import { ChildDetails } from "@/lib/businessModules/dental/api/models/ChildDetails";
import { useUpdateAnnualChildSidebar } from "@/lib/businessModules/dental/features/children/details/UpdateAnnualChildSidebar";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";

interface ChildDetailsProps {
  child: ChildDetails;
}

export function ChildDetailsPage(props: ChildDetailsProps) {
  const child = props.child;
  const updateAnnualChildSidebar = useUpdateAnnualChildSidebar();

  return (
    <PageGrid>
      <Grid xs={8}>
        <ContentPanel>
          <DetailsSection title="Kind">
            <CentralFilePersonDetails person={child} />
          </DetailsSection>
        </ContentPanel>
      </Grid>
      <Grid xs={4}>
        <ContentPanel>
          <DetailsSection
            title="Zusatzinfos"
            onEdit={() => updateAnnualChildSidebar.open({ child: child })}
            canEdit={true}
          >
            <Stack gap={1}>
              <DetailsCell
                name="institution"
                label="Einrichtung"
                value={child.institution.name}
              />
              <DetailsCell
                name="group"
                label="Gruppe"
                value={child.groupName}
              />
            </Stack>
          </DetailsSection>
        </ContentPanel>
      </Grid>
    </PageGrid>
  );
}
