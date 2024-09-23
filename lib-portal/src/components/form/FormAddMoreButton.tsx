/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Add as AddIcon } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/joy";

type FormAddMoreButtonProps = Omit<
  ButtonProps,
  "color" | "variant" | "size" | "sx" | "startDecorator"
>;

export function FormAddMoreButton(props: FormAddMoreButtonProps) {
  return (
    <Button
      color={"primary"}
      variant={"plain"}
      size={"sm"}
      sx={{ justifyContent: "flex-start" }}
      startDecorator={<AddIcon />}
      {...props}
    />
  );
}
