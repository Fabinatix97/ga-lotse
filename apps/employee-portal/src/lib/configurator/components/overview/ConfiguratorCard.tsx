/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ArrowForwardOutlined } from "@mui/icons-material";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/joy";

import { InternalLink, InternalLinkIconButton } from "@eshg/lib-portal";

import { ConfiguratorStatus } from "@/lib/configurator/api/models/configuratorTabItem";

export function ConfiguratorCard({
  title,
  link,
  status,
}: {
  title: string;
  link: string;
  status: ConfiguratorStatus;
}) {
  return (
    <Card sx={{ padding: 3 }}>
      <CardContent>
        <Stack gap={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <InternalLink overlay underline="none" href={link}>
              <Typography level="h3">{title}</Typography>
            </InternalLink>
            <InternalLinkIconButton
              href={link}
              aria-label={title}
              variant="outlined"
              color="primary"
              aria-hidden="true"
              tabIndex={-1}
            >
              <ArrowForwardOutlined />
            </InternalLinkIconButton>
          </Stack>
          {status === "COMPLETE" && <Chip color="success">Vollständig</Chip>}
          {status === "PARTIALLY_COMPLETE" && (
            <Chip color="neutral">Englische Übersetzung fehlt</Chip>
          )}
          {status === "INCOMPLETE" && (
            <Chip color="warning">Unvollständig</Chip>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
