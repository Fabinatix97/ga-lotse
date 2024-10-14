/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LogoutButton } from "@/lib/businessModules/travelMedicine/components/shared/components/LogoutButton";
import { LogoutButtonWithText } from "@/lib/businessModules/travelMedicine/components/shared/components/LogoutButtonWithText";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import { PageTitle } from "@/lib/shared/components/layout/page";

interface AppointmentPageTitleProps {
  title: string;
}

export function AppointmentPageTitle(
  props: Readonly<AppointmentPageTitleProps>,
) {
  const isMobile = useIsMobile();
  return (
    <PageTitle toolbar={isMobile ? <LogoutButton /> : <LogoutButtonWithText />}>
      {props.title}
    </PageTitle>
  );
}
