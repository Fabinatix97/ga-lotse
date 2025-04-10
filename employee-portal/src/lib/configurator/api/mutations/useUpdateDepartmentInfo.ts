/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { DepartmentInfoFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/DepartmentInfo";

export function useUpdateDepartmentInfo(module: ConfiguratorModuleName) {
  return (model: DepartmentInfoFormModel) => {
    // eslint-disable-next-line no-console
    console.log(module, model);
    return Promise.resolve();
  };
}
