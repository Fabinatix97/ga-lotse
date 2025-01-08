/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTravelMedicineFeature } from "@eshg/employee-portal-api/travelMedicine";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";

interface ToggledPageProps extends RequiresChildren {
  feature: ApiTravelMedicineFeature;
}

export function ToggledPage(props: Readonly<ToggledPageProps>) {
  const isNewFeatureEnabled = useIsNewFeatureEnabled(props.feature);

  if (isNewFeatureEnabled) {
    return props.children;
  }

  return (
    <Alert
      title="Seite nicht verfügbar"
      message="Die aufgerufene Seite ist nicht freigeschaltet."
      color="primary"
    />
  );
}
