/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";

import { ApiFluoridationConsent } from "@eshg/dental-api";
import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { FluoridationConsentHistoryTable } from "./FluoridationConsentHistoryTable";

export function useFluoridationConsentHistorySidebar(): UseSidebarResult<FluoridationConsentHistorySidebarProps> {
  return useSidebar({
    component: FluoridationConsentHistorySidebar,
  });
}

interface FluoridationConsentHistorySidebarProps extends DrawerProps {
  allFluoridationConsents: ApiFluoridationConsent[];
}

function FluoridationConsentHistorySidebar(
  props: FluoridationConsentHistorySidebarProps,
) {
  return (
    <>
      <SidebarContent title="Übersicht Einverständnis zur Fluoridierung">
        <FluoridationConsentHistoryTable
          fluoridationConsent={props.allFluoridationConsents}
        />
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={[
            <Button
              key="close"
              color="neutral"
              variant="soft"
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
