/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import { Stack, Typography, styled } from "@mui/joy";
import { UrlObject } from "url";

import { Row } from "@eshg/lib-portal/components/Row";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

interface MedicalHistoryCardProps {
  title: string;
  fulfilledLabel: string;
  unfulfilledLabel: string;
  buttonLabel: string;
  status: boolean;
  href: string | UrlObject;
}

export function MedicalHistoryCard(props: MedicalHistoryCardProps) {
  const {
    status: isFulfilled,
    title,
    fulfilledLabel,
    unfulfilledLabel,
    buttonLabel,
    href,
  } = props;
  const StatusIcon = isFulfilled ? StatusFulfilled : StatusUnfulfilled;

  return (
    <CardBox>
      <StatusIcon sx={{ alignSelf: "start" }} />
      <Stack flexGrow={0.5}>
        <Typography level="title-md">{title}</Typography>
        <Typography>
          {isFulfilled ? fulfilledLabel : unfulfilledLabel}
        </Typography>
      </Stack>
      {!isFulfilled ? (
        <InternalLinkButton
          color="primary"
          variant="solid"
          sx={{ padding: 0, flex: 1, minWidth: "10rem" }}
          href={href}
        >
          {buttonLabel}
        </InternalLinkButton>
      ) : null}
    </CardBox>
  );
}

const CardBox = styled(Row)(({ theme }) => ({
  backgroundColor: theme.palette.background.level1,
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  borderRadius: theme.radius.sm,
  alignItems: "center",
}));

const StatusFulfilled = styled(CheckOutlined)(({ theme }) => ({
  fill: theme.colorSchemes.light.palette.success.outlinedColor,
}));

const StatusUnfulfilled = styled(CloseOutlined)(({ theme }) => ({
  fill: theme.colorSchemes.light.palette.danger.plainColor,
}));
