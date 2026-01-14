/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { eslintNextConfigs } from "../../config/eslint.next.js";

const NO_RESTRICTED_IMPORTS_RULE_NAME = "no-restricted-imports";

export default eslintNextConfigs.app.map((config) => {
  if (NO_RESTRICTED_IMPORTS_RULE_NAME in (config.rules ?? {})) {
    const [severity, options] = config.rules[NO_RESTRICTED_IMPORTS_RULE_NAME];

    if (!(typeof severity === "string" && Array.isArray(options))) {
      return config;
    }

    return {
      ...config,
      rules: {
        ...config.rules,
        [NO_RESTRICTED_IMPORTS_RULE_NAME]: [
          severity,
          {
            ...options,
            paths: [
              ...(options.paths ?? []),
              {
                name: "@eshg/lib-portal",
                importNames: [
                  "NavigationLink",
                  "InternalLink",
                  "InternalLinkButton",
                  "InternalLinkIconButton",
                ],
                message:
                  "Replace by scoped link variant, e.g. ScopedInternalLink.",
              },
              {
                name: "next/navigation",
                importNames: ["useRouter"],
                message: "Replace by useScopedRouter.",
              },
            ],
          },
        ],
      },
    };
  }

  return config;
});
