/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AnnualInstitutionsTable,
  ChildDetails,
  routes,
  useUpdateAnnualChildSidebar,
} from "@eshg/dental";
import {
  CentralFilePersonDetails,
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
  PageGrid,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { Divider, Grid, Stack } from "@mui/joy";

import { useUpdateAnnualChildPersonSidebar } from "@/lib/businessModules/dental/features/children/details/UpdateAnnualChildPersonSidebar";
import { FluoridationConsentInformationSection } from "@/lib/businessModules/dental/shared/FluoridationConsentInformationSection";

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

interface ChildDetailsProps {
  child: ChildDetails;
  isFetching: boolean;
}

export function ChildDetailsPage(props: ChildDetailsProps) {
  const child = props.child;
  const updateAnnualChildSidebar = useUpdateAnnualChildSidebar();
  const updateAnnualChildDataSidebar = useUpdateAnnualChildPersonSidebar();
  const disabled = useIsFormDisabled();

  const syncRoute = routes.children
    .byId(child.id)
    .syncPerson(child.personDetails.fileStateId, child.personDetails.version);
  const { syncBarrier } = useSyncBarrier(syncRoute, child.personDetails);

  return (
    <PageGrid>
      <Grid xs={8}>
        <Stack spacing={SPACING}>
          <ContentPanel>
            <DetailsSection
              title="Kind"
              buttons={
                <SyncBarrier
                  outdated={child.personDetails.outdated}
                  syncHref={syncRoute}
                >
                  {!child.isClosed && (
                    <EditButton
                      aria-label="Kind bearbeiten"
                      onClick={syncBarrier(() =>
                        updateAnnualChildDataSidebar.open({
                          childId: child.id,
                          child,
                        }),
                      )}
                    />
                  )}
                </SyncBarrier>
              }
            >
              <CentralFilePersonDetails
                person={{ ...child.personDetails, ...child }}
              />
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
