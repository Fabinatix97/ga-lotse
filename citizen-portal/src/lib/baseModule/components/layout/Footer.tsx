/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Box, Stack, Typography } from "@mui/joy";

import { footerMaxWidthDesktop } from "@/lib/baseModule/components/layout/sizes";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { DepartmentInfoProps } from "@/lib/shared/types";

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
      <Box
        sx={{
          width: footerMaxWidthDesktop,
          paddingInline: 2,
          paddingBlock: 5,
        }}
      >
        <Stack sx={{ gap: { xxs: 5, lg: 3 } }}>
          <Typography level="title-lg" sx={{ color: "white" }}>
            © {props.department.name} {new Date().getFullYear()}
          </Typography>
          <Stack
            sx={{
              flexDirection: { lg: "row" },
              alignItems: "flex-start",
              gap: { xxs: 3, lg: 5 },
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
        </Stack>
      </Box>
    </Box>
  );
}
