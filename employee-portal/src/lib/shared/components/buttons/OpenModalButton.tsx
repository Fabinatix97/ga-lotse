/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, ButtonProps } from "@mui/joy";
import { ReactElement, useState } from "react";

import { BaseModalProps } from "@/lib/shared/components/BaseModal";

type ModalProps = Pick<BaseModalProps, "open" | "onClose">;

interface OpenModalButtonProps extends Omit<ButtonProps, "onClick"> {
  renderModal: (props: ModalProps) => ReactElement;
  initialModalValue?: boolean;
}

export function OpenModalButton(props: OpenModalButtonProps) {
  const { renderModal, initialModalValue, ...buttonProps } = props;
  const [open, setOpen] = useState(initialModalValue ?? false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)} />
      {renderModal({ open, onClose: () => setOpen(false) })}
    </>
  );
}
