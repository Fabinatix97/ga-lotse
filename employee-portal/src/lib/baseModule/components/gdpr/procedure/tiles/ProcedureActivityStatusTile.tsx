/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { Button, Stack, Typography } from "@mui/joy";

import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function ProcedureActivityStatusTile() {
  return (
    <InfoTile name={"procedure-status"} title={"Aktivität (WIP)"}>
      <Typography sx={{ lineBreak: "normal" }}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </Typography>
      <Stack direction={"row"} gap={2}>
        <Button disabled>Abbrechen</Button>
        <Button disabled startDecorator={<PlayArrowOutlinedIcon />}>
          Starten
        </Button>
      </Stack>
    </InfoTile>
  );
}
