/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, ButtonProps } from "@mui/joy";
import { ReactElement, useState } from "react";

import { BaseModalPropsRequiredClose } from "@eshg/lib-portal/components/BaseModal";

type ModalProps = Pick<BaseModalPropsRequiredClose, "open" | "onClose">;

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
