/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Typography } from "@mui/joy";

interface CreateInboxProcedureSuccessPageProps {
  onButtonClick: () => void;
}

export function CreateInboxProcedureSuccessPage(
  props: CreateInboxProcedureSuccessPageProps,
) {
  return (
    <>
      <Typography>Posteingangsvorgang erfolgreich angelegt!</Typography>
      <Button sx={{ marginTop: 2 }} onClick={props.onButtonClick}>
        Neuen Posteingangsvorgang anlegen
      </Button>
    </>
  );
}
