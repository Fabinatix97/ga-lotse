/**
 * Copyright 2025 cronn GmbH
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

export interface MutationBundle<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TVariables = any,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutationOptions: MutationOptions<any, Error, TVariables>;
  variableSupplier: () => TVariables;
}
