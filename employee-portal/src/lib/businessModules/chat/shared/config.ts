/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { env } from "@/env/server";

export interface ChatConfiguration {
  PUBLIC_FRONTEND_URL: string;
  MATRIX_SERVER_URL: string;
}
export const CHAT_CONFIGURATION: ChatConfiguration = {
  PUBLIC_FRONTEND_URL: env.PUBLIC_FRONTEND_URL,
  MATRIX_SERVER_URL: env.MATRIX_SERVER_URL,
};
