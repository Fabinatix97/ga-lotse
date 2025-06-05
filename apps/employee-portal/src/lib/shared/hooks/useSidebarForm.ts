/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ref, useCallback, useRef } from "react";

import {
  SidebarFormHandle,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";

interface UseSidebarFormProps {
  onClose: () => void;
}

interface UseSidebarForm {
  closeSidebar: () => void;
  handleClose: () => void;
  sidebarFormRef: Ref<SidebarFormHandle>;
}

/**
 * @deprecated Replaced by `useSidebarWithFormRef`.
 */
export function useSidebarForm({
  onClose,
}: UseSidebarFormProps): UseSidebarForm {
  const { openCancelDialog } = useConfirmationDialog();

  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const closeSidebar = useCallback(() => {
    onClose();
    sidebarFormRef.current?.resetForm();
  }, [onClose, sidebarFormRef]);

  const handleClose = useCallback(() => {
    if (sidebarFormRef.current?.dirty) {
      openCancelDialog({
        onConfirm: closeSidebar,
      });
    } else {
      closeSidebar();
    }
  }, [sidebarFormRef, closeSidebar, openCancelDialog]);

  return {
    closeSidebar,
    handleClose,
    sidebarFormRef,
  };
}
