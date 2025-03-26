/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFluoridationConsent } from "@eshg/dental-api";
import {
  ButtonBar,
  DetailsItem,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Button, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { FluoridationConsentTable } from "@/lib/businessModules/dental/shared/FluoridationConsentTable";
import { OpenHistorySidebarButton } from "@/lib/businessModules/dental/shared/OpenHistorySidebarButton";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

interface FluoridationConsentInformationSectionProps {
  allFluoridationConsents: ApiFluoridationConsent[];
}

export function FluoridationConsentInformationSection(
  props: FluoridationConsentInformationSectionProps,
) {
  const fluoridationConsent = props.allFluoridationConsents[0];
  const fluoridationOverviewSidebar = useSidebar({
    component: (drawerProps) => (
      <FluoridationOverviewSidebar
        allFluoridationConsents={props.allFluoridationConsents}
        onClose={drawerProps.onClose}
      />
    ),
  });
  if (!isDefined(fluoridationConsent)) {
    return (
      <DetailsItem
        label="Einverständnis zur Fluoridierung"
        value="Liegt nicht vor"
      />
    );
  }
  return (
    <>
      <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
        <Typography fontWeight={600}>Fluoridierung</Typography>
        <OpenHistorySidebarButton
          onClick={fluoridationOverviewSidebar.open}
          name="Übersicht"
        />
      </Stack>
      <Stack direction="row" gap={3} flexWrap="wrap">
        <DetailsItem
          label="Einverständnis"
          value={displayBoolean(fluoridationConsent.consented)}
        />
        <DetailsItem
          label="Datum"
          value={formatDate(fluoridationConsent.dateOfConsent)}
        />
        <DetailsItem
          label="Allergie"
          value={displayBoolean(fluoridationConsent.hasAllergy)}
        />
      </Stack>
    </>
  );
}

interface FluoridationOverviewSidebarProps extends DrawerProps {
  allFluoridationConsents: ApiFluoridationConsent[];
}
function FluoridationOverviewSidebar(props: FluoridationOverviewSidebarProps) {
  return (
    <>
      <SidebarContent title="Übersicht Einverständnis zur Fluoridierung">
        <FluoridationConsentTable
          fluoridationConsent={props.allFluoridationConsents}
        />
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              color="neutral"
              variant="soft"
              key="close"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>,
          ]}
        />
      </SidebarActions>
    </>
  );
}
