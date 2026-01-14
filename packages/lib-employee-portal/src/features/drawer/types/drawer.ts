/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";

import { DrawerFallbackOptions } from "../contexts/drawer";

export interface DrawerProps {
  /**
   * Marks the overlay for closing
   * @param force Forces closing the overlay, skipping any confirmation
   */
  onClose: (force?: boolean) => void;
}

export interface DrawerOpenOptions<
  TDrawerProps extends DrawerProps = DrawerProps,
> extends DrawerFallbackOptions {
  /**
   * The component to be created when opening the drawer
   */
  component: (props: TDrawerProps) => ReactNode;
  /**
   * Handler to be executed before closing the drawer.
   * The drawer only closes when `confirmClose` is called with `true`.
   * `confirmClose` must be called with `false` in all other cases.
   */
  onBeforeClose?: (confirmClose: (close: boolean) => void) => void;
  /**
   * Handler to be executed after closing the drawer.
   */
  onClose?: () => void;
}
