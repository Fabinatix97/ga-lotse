/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnBeforeNavigateProps } from "@eshg/lib-portal";

import { useConfirmNavigationEffect } from "./useConfirmNavigationEffect";
import { useConfirmUnloadEffect } from "./useConfirmUnloadEffect";

export function useConfirmLeaveDirtyFormEffect(
  isFormDirty: boolean,
  onBeforeNavigateProps?: OnBeforeNavigateProps,
) {
  useConfirmUnloadEffect(isFormDirty);
  useConfirmNavigationEffect(isFormDirty, onBeforeNavigateProps);
}
