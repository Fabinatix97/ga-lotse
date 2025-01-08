/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/joy";

export function SearchFooter(props: { onCreatePerson: () => void }) {
  return (
    <Button
      variant="plain"
      startDecorator={<AddOutlined />}
      onClick={props.onCreatePerson}
      sx={{ alignSelf: "start" }}
    >
      Person neu anlegen
    </Button>
  );
}
