/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/joy";

export function SearchFooter(props: { onCreateFacility: () => void }) {
  return (
    <Button
      variant="plain"
      startDecorator={<AddOutlined />}
      onClick={props.onCreateFacility}
      sx={{ alignSelf: "start" }}
    >
      Neue Einrichtung anlegen
    </Button>
  );
}
