/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ref, useRef } from "react";

import { useConfirmationDialog } from "../../../hooks/useConfirmationDialog";
import { DrawerOpenOptions, DrawerProps } from "../types/drawer";
import { SidebarFormHandle } from "../types/sidebar";

import { UseSidebarResult, useSidebar } from "./useSidebar";

export interface SidebarWithFormRefProps extends DrawerProps {
  formRef: Ref<SidebarFormHandle>;
}

export type UseSidebarWithFormRefOptions<
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
          title: "Änderungen verwerfen",
          description:
            "Sie haben nicht gespeicherte Änderungen. Was möchten Sie damit machen?",
          cancelLabel: "Behalten",
          confirmLabel: "Verwerfen",
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
