/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBaseFeature } from "@eshg/employee-portal-api/base";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";

interface ToggledPageProps extends RequiresChildren {
  feature: ApiBaseFeature;
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
