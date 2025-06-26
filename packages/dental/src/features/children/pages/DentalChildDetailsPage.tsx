/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Grid, Stack } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  ContentPanel,
  DetailsSection,
  PageGrid,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { DisabledFormProvider, DynamicPageProps } from "@eshg/lib-portal";

import { useDentalApi } from "../../../contexts/dental";
import { useCloseChild } from "../api/mutations/details";
import { getChildDetailsQuery } from "../api/queries/details";
import { AdditionalInformationDetailsSection } from "../components/childDetails/AdditionalInformationDetailsSection";
import { ChildDetailsSection } from "../components/childDetails/ChildDetailsSection";
import { InstitutionHistoryDetailsSection } from "../components/childDetails/InstitutionHistoryDetailsSection";
import { useChildRouteParams } from "../hooks/useChildRouteParams";
import { DentalChildRouteParams } from "../schemas/DentalChildRouteParams";

const SPACING = { xxs: 2, sm: 3, md: 4, xxl: 5 };

export function DentalChildDetailsPage(
  props: DynamicPageProps<DentalChildRouteParams>,
) {
  const { childId } = useChildRouteParams(props.params);
  const { childApi } = useDentalApi();
  const { data: child } = useSuspenseQuery(
    getChildDetailsQuery(childApi, childId),
  );
  const { openConfirmationDialog } = useConfirmationDialog();
  const closeChild = useCloseChild(childId);

  async function handleCloseChild() {
    await closeChild.mutateAsync({ version: child.version });
  }

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
            {isDefined(child.note) && (
              <ContentPanel>
                <DetailsSection title="Bemerkung">{child.note}</DetailsSection>
              </ContentPanel>
            )}
          </Stack>
        </Grid>
        <Grid xs={4}>
          <Stack spacing={SPACING}>
            <ContentPanel>
              <AdditionalInformationDetailsSection child={child} />
            </ContentPanel>
            {!child.isClosed && (
              <ContentPanel>
                <Button
                  onClick={() =>
                    openConfirmationDialog({
                      title: "Vorgang für Kind abschließen",
                      description:
                        "Für dieses Kind sollen keine weiteren Untersuchungen und Maßnahmen mehr dokumentiert werden." +
                        "\nDiese Aktion kann nicht mehr rückgängig gemacht werden.",
                      confirmLabel: "Abschließen",
                      onConfirm: () => handleCloseChild(),
                    })
                  }
                >
                  Vorgang für Kind abschließen
                </Button>
              </ContentPanel>
            )}
          </Stack>
        </Grid>
      </PageGrid>
    </DisabledFormProvider>
  );
}
