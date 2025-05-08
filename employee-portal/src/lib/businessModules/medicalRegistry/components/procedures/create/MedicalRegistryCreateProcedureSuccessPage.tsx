/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Typography } from "@mui/joy";

interface MedicalRegistryCreateProcedureSuccessPageProps {
  onButtonClick: () => void;
}

export function MedicalRegistryCreateProcedureSuccessPage(
  props: MedicalRegistryCreateProcedureSuccessPageProps,
) {
  return (
    <>
      <Typography>Eintrag erfolgreich angelegt!</Typography>
      <Button sx={{ marginTop: 2 }} onClick={props.onButtonClick}>
        Neuen Eintrag anlegen
      </Button>
    </>
  );
}
