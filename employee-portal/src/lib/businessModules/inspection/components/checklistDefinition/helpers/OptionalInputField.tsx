/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { FormikErrors } from "formik";
import { memo, useState } from "react";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";

import { FlexInputFieldProps } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/FlexInputField";
import { InputWithDeleteButton } from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputWithDeleteButton";

export interface OptionalInputFieldProps extends FlexInputFieldProps {
  addButtonLabel: string;
}

export function OptionalInputField(props: Readonly<OptionalInputFieldProps>) {
  const { meta, helpers } = useBaseField(props);

  return (
    <MemoizedOptionalInputField
      {...props}
      setValue={helpers.setValue}
      hasInitialValue={!!meta.initialValue}
    />
  );
}

interface InnerOptionalInputFieldProps extends OptionalInputFieldProps {
  setValue: (
    value: string,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<string>>;
  hasInitialValue: boolean;
}

const MemoizedOptionalInputField = memo(function InnerOptionalInputField({
  addButtonLabel,
  hasInitialValue,
  setValue,
  ...props
}: Readonly<InnerOptionalInputFieldProps>) {
  const [showInput, setShowInput] = useState(hasInitialValue);

  function handleDelete() {
    setShowInput(false);
    void setValue("");
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
});
