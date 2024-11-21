/**
 * Copyright 2024 cronn GmbH
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
      <Button onClick={props.onButtonClick} sx={{ marginTop: 2 }}>
        Neuen Eintrag anlegen
      </Button>
    </>
  );
}
