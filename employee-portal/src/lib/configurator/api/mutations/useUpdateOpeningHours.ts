/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  OpeningHoursFormModel,
  OpeningHoursModuleName,
} from "@/lib/configurator/components/shared/ConfiguratorDetails/OpeningHours";

export function useUpdateOpeningHours(module: OpeningHoursModuleName) {
  return (model: OpeningHoursFormModel) => {
    // eslint-disable-next-line no-console
    console.log(module, model);
    return Promise.resolve();
  };
}
