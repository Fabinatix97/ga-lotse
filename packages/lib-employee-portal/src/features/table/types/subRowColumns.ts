/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cell } from "@tanstack/react-table";
import { ComponentPropsWithRef, ReactNode } from "react";

export interface SubRowColumnProps<TData> {
  renderCell?: (cell: Cell<TData, unknown>) => ReactNode;
  tdProps?: Pick<ComponentPropsWithRef<"td">, "colSpan" | "align" | "valign">;
  skip?: boolean;
}

export type SubRowColumns<TData> = Record<string, SubRowColumnProps<TData>>;
