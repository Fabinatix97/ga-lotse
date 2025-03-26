/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { eslintNextConfigs } from "../config/eslint.next.js";

const noRestrictedImportsRule = "no-restricted-imports";

// Allows relative imports, because this library is not yet migrated to tsup and absolute imports
function removeRelativeImportsRule(configs) {
  return configs.map((config) => {
    if ("rules" in config && noRestrictedImportsRule in config.rules) {
      const [level, options] = config.rules[noRestrictedImportsRule];
      config.rules[noRestrictedImportsRule] = [
        level,
        {
          ...options,
          patterns: options.patterns?.filter(
            (pattern) => !pattern.group.includes("..*"),
          ),
        },
      ];
    }

    return config;
  });
}

export default removeRelativeImportsRule(eslintNextConfigs.lib);
