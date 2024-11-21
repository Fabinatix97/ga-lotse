/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

import { FlexInputFieldProps } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/FlexInputField";
import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";

export interface OptionalInputFieldProps extends FlexInputFieldProps {
  addButtonLabel: string;
}

export function OptionalInputField({
  addButtonLabel,
  ...props
}: Readonly<OptionalInputFieldProps>) {
  const { getFieldProps, setFieldValue } = useFormikContext();
  const [showInput, setShowInput] = useState(false);

  // show input if it has an initial value
  useEffect(() => {
    const { value } = getFieldProps<string>(props.name);
    setShowInput(!!value);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
  }, [props.name]);

  function handleDelete() {
    setShowInput(false);
    void setFieldValue(props.name, "");
  }

  if (showInput) {
    return <InputWithDeleteButton onDelete={() => handleDelete()} {...props} />;
  }

  return (
    <Button
      disabled={props.disabled}
      startDecorator={<Add />}
      sx={{ width: "fit-content" }}
      variant="plain"
      onClick={() => setShowInput(true)}
    >
      {addButtonLabel}
    </Button>
  );
}
