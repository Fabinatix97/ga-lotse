/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Alert, RequiresChildren } from "@eshg/lib-portal";
import { ApiOpenDataFeature } from "@eshg/opendata-api";

import { useIsNewFeatureEnabled } from "@/lib/opendata/queries/feature";

interface ToggledPageProps extends RequiresChildren {
  feature: ApiOpenDataFeature;
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
