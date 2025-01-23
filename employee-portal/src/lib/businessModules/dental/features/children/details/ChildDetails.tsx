/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Divider, Grid, Stack, Typography } from "@mui/joy";

import { ChildDetails } from "@/lib/businessModules/dental/api/models/ChildDetails";
import { AnnualInstitutionsTable } from "@/lib/businessModules/dental/features/children/details/AnnualInstitutionsTable";
import { FluoridationConsentTable } from "@/lib/businessModules/dental/features/children/details/FluoridationConsentTable";
import { useUpdateAnnualChildSidebar } from "@/lib/businessModules/dental/features/children/details/UpdateAnnualChildSidebar";
import { IconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";
import { CentralFilePersonDetails } from "@/lib/shared/components/centralFile/display/CentralFilePersonDetails";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

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
              {child.currentFluoridationConsent ? (
                <>
                  <Divider />
                  <Typography>
                    Einverständnis zur Fluoridierung{" "}
                    <IconTooltipButton
                      title="Übersicht Einverständnis zur Fluoridierung"
                      infoText={
                        <FluoridationConsentTable
                          fluoridationConsent={child.allFluoridationConsents}
                        />
                      }
                      icon="(Übersicht)"
                    />
                  </Typography>
                  <Stack direction="row" gap={2} flexWrap="wrap">
                    <DetailsCell
                      name="fluoridationConsent"
                      label="Einverständis"
                      value={displayBoolean(
                        child.currentFluoridationConsent.consented,
                      )}
                    />
                    <DetailsCell
                      name="fluoridationConsentDate"
                      label="Datum der Einverständniserklärung"
                      value={formatDate(
                        child.currentFluoridationConsent.dateOfConsent,
                      )}
                    />
                    <DetailsCell
                      name="allergy"
                      label="Allergie"
                      value={displayBoolean(
                        child.currentFluoridationConsent.hasAllergy,
                      )}
                    />
                  </Stack>
                </>
              ) : (
                <DetailsCell
                  name="fluoridationConsent"
                  label="Einverständis zur Fluoridierung"
                  value="Liegt nicht vor"
                />
              )}
            </Stack>
          </DetailsSection>
        </ContentPanel>
      </Grid>
    </PageGrid>
  );
}
