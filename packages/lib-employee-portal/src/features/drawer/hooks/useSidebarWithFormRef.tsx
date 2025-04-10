/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ref, useRef } from "react";

import {
  UseSidebarResult,
  useSidebar,
} from "@/features/drawer/hooks/useSidebar";
import { DrawerOpenOptions, DrawerProps } from "@/features/drawer/types/drawer";
import { SidebarFormHandle } from "@/features/drawer/types/sidebar";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

export interface SidebarWithFormRefProps extends DrawerProps {
  formRef: Ref<SidebarFormHandle>;
}

type UseSidebarWithFormRefOptions<
  TSidebarProps extends SidebarWithFormRefProps,
> = Omit<DrawerOpenOptions<TSidebarProps>, "onBeforeClose">;

export type UseSidebarWithFormRefResult<
  TSidebarProps extends SidebarWithFormRefProps = SidebarWithFormRefProps,
> = UseSidebarResult<Omit<TSidebarProps, "formRef">>;

export function useSidebarWithFormRef<
  TSidebarProps extends SidebarWithFormRefProps = SidebarWithFormRefProps,
>(
  options: UseSidebarWithFormRefOptions<TSidebarProps>,
): UseSidebarWithFormRefResult<TSidebarProps> {
  const { component: SidebarComponent, ...sidebarOptions } = options;
  const { openCancelDialog } = useConfirmationDialog();
  const formRef = useRef<SidebarFormHandle>(null);
  return useSidebar({
    ...sidebarOptions,
    component: (sidebarProps) => {
      const mergedProps = {
        ...sidebarProps,
        formRef,
      } as TSidebarProps;
      return <SidebarComponent {...mergedProps} />;
    },
    onBeforeClose: (confirmClose) => {
      if (formRef.current?.dirty) {
        openCancelDialog({
          onConfirm: () => confirmClose(true),
          onCancel: () => confirmClose(false),
        });
      } else {
        confirmClose(true);
      }
    },
    onClose: () => {
      formRef.current?.resetForm();
      options.onClose?.();
    },
  });
}
