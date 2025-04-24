/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFluoridationVarnish } from "@eshg/dental-api";

import { FLUORIDATION_VARNISH_DESCRIPTIONS } from "@/translations/prophylaxisSession";

export function formatFluoridationVarnishDescription(
  fluoridationVarnish: ApiFluoridationVarnish | undefined,
) {
  return fluoridationVarnish
    ? FLUORIDATION_VARNISH_DESCRIPTIONS[fluoridationVarnish]
    : "Nein";
}
