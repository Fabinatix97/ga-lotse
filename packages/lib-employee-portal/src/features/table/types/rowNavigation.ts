/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeepKeys, Row } from "@tanstack/react-table";

export type RowNavigation<TData> =
  | RowRouteNavigation<TData>
  | RowClickNavigation<TData>;

interface RowNavigationBase<TData> {
  /**
   * focusColumnAccessorKey should be set to the accessor key of an accessor column containing non-interactive cells.
   * Background: This is necessary to enable keyboard-based row navigation, which requires a focusable cell in each row. Currently, we expect each table to have at least one accessor column. If not the case, please consider extending this interface to support additional options.
   */
  focusColumnAccessorKey: DeepKeys<TData> & string;
}

interface RowRouteNavigation<TData> extends RowNavigationBase<TData> {
  route: (row: Row<TData>) => string | undefined;
}

interface RowClickNavigation<TData> extends RowNavigationBase<TData> {
  /**
   * onClick accepts a nested function. It will only handle the action if the function is returned. When undefined, the row will be shown as not navigable.
   */
  onClick: (row: Row<TData>) => (() => void) | undefined;
}
