/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { BaseModalPropsRequiredClose } from "@eshg/lib-portal/components/BaseModal";
import { Stack } from "@mui/joy";
import { ReactNode, useId, useMemo, useState } from "react";
import { isNonNullish, isNullish } from "remeda";

import { DetailsSectionHeader } from "./DetailsSectionHeader";

export type SimplifiedModalProps = Pick<
  BaseModalPropsRequiredClose,
  "open" | "onClose"
>;

interface DetailsSectionProps {
  "data-testid"?: string;
  title: string;
  canEdit?: boolean;
  canDelete?: boolean;
  renderEditModal?: (props: SimplifiedModalProps) => ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  buttons?: ReactNode;
  children: ReactNode;
}

export function DetailsSection({
  "data-testid": testId,
  title,
  renderEditModal,
  onEdit,
  children,
  onDelete,
  canEdit,
  canDelete,
  buttons,
}: Readonly<DetailsSectionProps>) {
  const [open, setOpen] = useState(false);
  const canRenderModal =
    canEdit !== false && isNonNullish(renderEditModal) && isNullish(onEdit);
  const canEditCallback =
    canEdit !== false && isNonNullish(onEdit) && isNullish(renderEditModal);

  const handleEdit = useMemo(() => {
    if (canRenderModal) {
      return () => setOpen(true);
    }
    if (canEditCallback) {
      return onEdit;
    }
    return undefined;
  }, [canEditCallback, canRenderModal, onEdit]);

  const headerId = useId();

  return (
    <Stack
      component="section"
      gap={2}
      aria-labelledby={headerId}
      data-testid={testId}
    >
      <DetailsSectionHeader
        id={headerId}
        title={title}
        onEdit={handleEdit}
        onDelete={canDelete !== false ? onDelete : undefined}
        buttons={buttons}
      />

      {canRenderModal &&
        renderEditModal({ open, onClose: () => setOpen(false) })}
      {children}
    </Stack>
  );
}
