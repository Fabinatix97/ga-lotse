/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { Stack, Typography } from "@mui/joy";

import {
  LinkInNewTab,
  StaticTextDocumentPanel,
} from "@/lib/baseModule/components/StaticTextDocumentPanel";

export function Contact() {
  return (
    <StaticTextDocumentPanel>
      <Stack component={"section"} aria-labelledby={"phone-contact"} gap={1}>
        <Stack>
          <Typography component={"h2"} level={"title-md"} id={"phone-contact"}>
            Telefonische Erreichbarkeit:
          </Typography>
          <Typography>Telefon: +49 (0) 800 -4256873</Typography>
        </Stack>
        <Typography>
          Montag - Donnerstag: 07:30 Uhr - 16:00 Uhr
          <br />
          Freitag: 07:30 Uhr - 14:00 Uhr
        </Typography>
      </Stack>
      <Stack component={"section"} aria-labelledby={"ticket-contact"}>
        <Typography component={"h2"} level={"title-md"} id={"ticket-contact"}>
          Erreichbarkeit via Ticketsystem:
        </Typography>
        <Typography>
          E-Mail:{" "}
          <ExternalLink href={"mailto:support@ga-lotse.de"}>
            support@ga-lotse.de
          </ExternalLink>
        </Typography>
      </Stack>
      <Typography>
        Open Source:{" "}
        <LinkInNewTab href={"https://gitlab.opencode.de/ga-lotse"}>
          OpenCoDE
        </LinkInNewTab>
      </Typography>
    </StaticTextDocumentPanel>
  );
}
