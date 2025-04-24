/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { BaseModalPropsRequiredClose } from "@eshg/lib-portal/components/BaseModal";
import { Button, ButtonProps } from "@mui/joy";
import { ReactElement, useState } from "react";

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
