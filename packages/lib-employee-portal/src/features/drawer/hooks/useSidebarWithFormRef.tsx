/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ref, RefObject, useRef } from "react";

import { ConfirmationDialogOptions } from "@eshg/lib-portal";

import { useConfirmationDialog } from "../../../hooks/useConfirmationDialog";
import { DrawerOpenOptions, DrawerProps } from "../types/drawer";
import { SidebarFormHandle } from "../types/sidebar";

import { UseSidebarResult, useSidebar } from "./useSidebar";

export interface SidebarWithFormRefProps extends DrawerProps {
  formRef: Ref<SidebarFormHandle>;
}

export type UseSidebarWithFormRefOptions<
  TSidebarProps extends SidebarWithFormRefProps,
> = Omit<DrawerOpenOptions<TSidebarProps>, "onBeforeClose"> & {
  onBeforeClose?: (options: OnBeforeCloseOptions) => void;
};

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
  const onBeforeClose = options.onBeforeClose ?? onBeforeCloseDefault;
  return useSidebar({
    ...sidebarOptions,
    component: (sidebarProps) => {
      const mergedProps = {
        ...sidebarProps,
        formRef,
      } as TSidebarProps;
      return <SidebarComponent {...mergedProps} />;
    },
    onBeforeClose: (confirmClose) =>
      onBeforeClose({ confirmClose, formRef, openCancelDialog }),
    onClose: () => {
      formRef.current?.resetForm();
      options.onClose?.();
    },
  });
}

interface OnBeforeCloseOptions {
  confirmClose: (force: boolean) => void;
  formRef: RefObject<SidebarFormHandle | null>;
  openCancelDialog: (options: ConfirmationDialogOptions) => void;
}

function onBeforeCloseDefault({
  confirmClose,
  formRef,
  openCancelDialog,
}: OnBeforeCloseOptions): void {
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
}
