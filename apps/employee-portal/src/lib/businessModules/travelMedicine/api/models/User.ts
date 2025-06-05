/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface User {
  readonly email?: string;
  readonly enabled: boolean;
  readonly externalChatUsername?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber?: string;
  readonly userId: string;
  readonly username: string;
}
