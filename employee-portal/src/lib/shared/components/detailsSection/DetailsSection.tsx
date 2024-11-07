/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Stack } from "@mui/joy";
import { ReactNode, useId, useMemo, useState } from "react";
import { isNonNullish, isNullish } from "remeda";

import { BaseModalProps } from "@/lib/shared/components/BaseModal";
import { SectionHeader } from "@/lib/shared/components/detailsSection/SectionHeader";

export type SimplifiedModalProps = Pick<BaseModalProps, "open" | "onClose">;

interface DetailsSectionProps {
  name?: string;
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
  name,
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

  const backupId = useId();
  const headerId = `${name ?? backupId}-header`;

  return (
    <Stack
      component="section"
      gap={2}
      aria-labelledby={headerId}
      data-testid={name}
    >
      <SectionHeader
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
