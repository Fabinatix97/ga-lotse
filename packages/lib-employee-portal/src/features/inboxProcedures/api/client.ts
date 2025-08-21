/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InboxProcedureApi } from "@eshg/lib-procedures-api";

export type InboxProcedureClient = Pick<
  InboxProcedureApi,
  "getInboxProceduresRaw" | "getInboxProcedure" | "updateInboxProcedureStatus"
>;
