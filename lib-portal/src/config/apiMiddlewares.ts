/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Middleware } from "@eshg/base-api";

import { clientOnlyMiddleware } from "../api/clientOnlyMiddleware";
import { errorInterceptionMiddleware } from "../api/errorInterceptionMiddleware";

export const apiMiddlewares: Middleware[] = [
  clientOnlyMiddleware,
  errorInterceptionMiddleware,
];
