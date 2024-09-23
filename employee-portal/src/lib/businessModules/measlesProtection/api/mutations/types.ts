/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultError, MutationOptions } from "@tanstack/react-query";

export type MutationPassThrough<TData, TParams> = Pick<
  MutationOptions<TData, DefaultError, TParams>,
  "onSuccess" | "onError"
>;
