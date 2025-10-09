/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  enabled: boolean;
  externalChatUsername?: string;
  phoneNumber?: string;
  email?: string;
}
