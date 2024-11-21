/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultError, MutationOptions } from "@tanstack/react-query";

export type MutationPassThrough<
  TParams,
  TData,
  TProps extends keyof MutationOptions<TData, DefaultError, TParams> =
    | "onSuccess"
    | "onError",
> = Pick<MutationOptions<TData, DefaultError, TParams>, TProps>;
