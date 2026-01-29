/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/joy";

import {
  FlexInputField,
  FlexInputFieldProps,
} from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/FlexInputField";

interface InputWithDeleteButtonProps
  extends FlexInputFieldProps, DeleteButtonProps {
  hideDeleteButton?: boolean;
}

export function InputWithDeleteButton({
  onDelete,
  endDecorator,
  hideDeleteButton,
  ...props
}: Readonly<InputWithDeleteButtonProps>) {
  return (
    <FlexInputField
      endDecorator={
        <>
          {!hideDeleteButton && <DeleteButton onDelete={onDelete} />}
          {endDecorator}
        </>
      }
      {...props}
    />
  );
}

interface DeleteButtonProps {
  onDelete: () => void;
}

function DeleteButton({ onDelete }: Readonly<DeleteButtonProps>) {
  return (
    <IconButton
      title="Löschen"
      aria-label="Löschen"
      variant="outlined"
      color="danger"
      onClick={onDelete}
    >
      <Delete />
    </IconButton>
  );
}
