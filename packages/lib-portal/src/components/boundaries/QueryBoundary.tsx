/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { AlertContextProvider } from "../../errorHandling/AlertContext";
import { RequiresChildren } from "../../types/react";

export function QueryBoundary(props: RequiresChildren) {
  return (
    <QueryErrorResetBoundary>
      <AlertContextProvider>{props.children}</AlertContextProvider>
    </QueryErrorResetBoundary>
  );
}
