/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

export function TermsOfUse() {
  return (
    <>
      <Typography level="body-sm" textAlign="justify">
        Mit der Nutzung des Chatmoduls wird ein individueller, Ende-zu-Ende
        verschlüsselter Bereich im Chatmodul für diesen Account angelegt. Dieser
        wird durch eine individuelle Passphrase gesichert und kann nach Verlust
        der eigenen Passphrase nicht mehr wiederhergestellt werden. Die Daten
        sind nur für den jeweiligen Account zugänglich.
      </Typography>
      <Typography level="body-sm" textAlign="justify">
        Nach Anlegen des Accounts können individuelle Einstellungen hinsichtlich
        bestimmter Sichtbarkeiten des Online-Status, der Lesebestätigungen und
        der Schreibanzeige individuell gesetzt werden.
      </Typography>
      <Typography level="body-sm" textAlign="justify">
        Die Zustimmung zur Nutzung des Chats kann auch im Menüpunkt Chat
        bestätigt werden.
      </Typography>
    </>
  );
}
