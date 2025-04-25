/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SvgIcon, Typography } from "@mui/joy";

import { ContentPanel, DetailsSection } from "@eshg/lib-employee-portal";
import { ApiGetProcedure200Response } from "@eshg/medical-registry-api";

export function WrittenConfirmationSection({
  procedure,
}: Readonly<{ procedure: ApiGetProcedure200Response }>) {
  return (
    <ContentPanel>
      <DetailsSection
        data-testid="written-confirmation"
        title="Meldebestätigung"
      >
        {procedure.requestForWrittenConfirmation ? (
          <Typography
            startDecorator={<ConfirmationRequestedIcon />}
            alignItems="flex-start"
          >
            Schriftliche Meldebestätigung angefordert
          </Typography>
        ) : (
          <Typography
            startDecorator={<NoConfirmationRequestedIcon />}
            alignItems="flex-start"
          >
            Keine schriftliche Meldebestätigung angefordert
          </Typography>
        )}
      </DetailsSection>
    </ContentPanel>
  );
}

function ConfirmationRequestedIcon() {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H14L20 8V13.35C19.6833 13.2333 19.3583 13.1458 19.025 13.0875C18.6917 13.0292 18.35 13 18 13V9H13V4H6V20H11.5C11.6333 20.3833 11.8 20.7417 12 21.075C12.2 21.4083 12.4333 21.7167 12.7 22H6Z"
          fill="#1F7A1F"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.1594 16.2151L17.1722 21.8134L13.3153 18.4253L14.6352 16.9227L17 19L20.6661 14.8847L22.1594 16.2151Z"
          fill="#1F7A1F"
        />
      </svg>
    </SvgIcon>
  );
}

function NoConfirmationRequestedIcon() {
  return (
    <SvgIcon>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H14L20 8V12.35C19.6833 12.2333 19.3583 12.1458 19.025 12.0875C18.6917 12.0292 18.35 12 18 12V9H13V4H6V20H12.35C12.4833 20.3833 12.65 20.7417 12.85 21.075C13.05 21.4083 13.2833 21.7167 13.55 22H6ZM15.9 21.5L14.5 20.1L16.6 18L14.5 15.9L15.9 14.5L18 16.6L20.1 14.5L21.5 15.9L19.425 18L21.5 20.1L20.1 21.5L18 19.425L15.9 21.5Z"
          fill="#636B74"
        />
      </svg>
    </SvgIcon>
  );
}
