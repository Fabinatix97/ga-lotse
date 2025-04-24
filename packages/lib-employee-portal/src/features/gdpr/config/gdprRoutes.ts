/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineRoutes } from "@eshg/lib-portal/helpers/routes";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";

export const gdprRoutes = defineRoutes("/gdpr", (gdprPath) => ({
  index: gdprPath("/"),
  details: (procedureId: string) => gdprPath(`/${procedureId}`),
  validationTasks: (businessModule: ApiBusinessModule) =>
    defineRoutes(
      gdprPath(`/validation-tasks/${businessModule}`),
      (validationTasksPath) => ({
        overview: validationTasksPath("/overview"),
        byId: (id: string) => validationTasksPath(`/${id}`),
      }),
    ),
}));
