/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid } from "@mui/joy";
import { FormEventHandler } from "react";

interface FormGridContainerProps extends RequiresChildren {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function FormGridContainer(props: FormGridContainerProps) {
  return (
    <Grid container columnSpacing={2} rowSpacing={3} component={FormPlus}>
      {props.children}
    </Grid>
  );
}
