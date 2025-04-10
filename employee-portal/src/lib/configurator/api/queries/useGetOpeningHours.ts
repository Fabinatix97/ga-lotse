/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { OpeningHoursFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";

export function useGetOpeningHours(
  module: ConfiguratorModuleName,
): OpeningHoursFormModel {
  return {
    opening_hours_german: {
      rows: [
        {
          weekday: "",
          timeWindow: "",
        },
      ],
      additionalInfo: "",
    },
    opening_hours_english: {
      rows: [
        {
          weekday: "",
          timeWindow: "",
        },
      ],
      additionalInfo: `je nach module ${module}`,
    },
  };
}
