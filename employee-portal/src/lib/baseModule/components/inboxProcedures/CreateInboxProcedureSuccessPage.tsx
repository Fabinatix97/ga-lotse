/**
 * Copyright 2025 cronn GmbH
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
      <Button onClick={props.onButtonClick} sx={{ marginTop: 2 }}>
        Neuen Posteingangsvorgang anlegen
      </Button>
    </>
  );
}
