/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Box, Stack, Typography, styled } from "@mui/joy";

import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { MobileBreakpoint, byBreakpoint } from "@/lib/shared/breakpoints";
import { responsiveContent } from "@/lib/shared/components/layout/PageContent";
import { DepartmentInfoProps } from "@/lib/shared/types";

import { contentMarginMobile } from "./sizes";

const ResponsiveContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  paddingBlock: theme.spacing(5),
  ...responsiveContent(theme, {
    [MobileBreakpoint.Down]: {
      gap: theme.spacing(5),
      paddingBlock: theme.spacing(6),
      paddingInline: theme.spacing(contentMarginMobile.leftRight),
    },
  }),
}));

interface FooterLinkProps extends RequiresChildren {
  href: string;
}

function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <InternalLink
      level="title-md"
      sx={{ color: "white", textDecorationColor: "white" }}
      href={href}
    >
      {children}
    </InternalLink>
  );
}

export function Footer(props: DepartmentInfoProps) {
  const { t } = useTranslation("footer");
  const routes = useRoutes();

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "neutral.700",
        marginTop: "auto",
      }}
    >
      <ResponsiveContainer>
        <Typography fontSize="1.125rem" sx={{ color: "white" }}>
          © {props.department.name} {new Date().getFullYear()}
        </Typography>
        <Stack
          sx={{
            flexDirection: byBreakpoint({
              mobile: "column",
              desktop: "row",
            }),
            alignItems: "flex-start",
            gap: byBreakpoint({ mobile: 3, desktop: 5 }),
          }}
        >
          <FooterLink href={routes.imprint}>{t("imprint_link")}</FooterLink>
          <FooterLink href={routes.privacyPolicy}>
            {t("privacy_policy_link")}
          </FooterLink>
          <FooterLink href={routes.accessibility}>
            {t("accessibility_link")}
          </FooterLink>
          <FooterLink href={routes.termsOfUse}>
            {t("terms_of_use_link")}
          </FooterLink>
          <FooterLink href={routes.contact}>{t("contact_link")}</FooterLink>
        </Stack>
      </ResponsiveContainer>
    </Box>
  );
}
