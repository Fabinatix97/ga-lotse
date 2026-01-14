/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography, styled } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useGetConfig } from "@/lib/shared/api/queries/publicConfig";
import { MobileBreakpoint, byBreakpoint } from "@/lib/shared/breakpoints";
import { responsiveContent } from "@/lib/shared/components/layout/PageContent";
import { ScopedInternalLink } from "@/lib/shared/components/scopedLinks";
import { DepartmentInfoProps } from "@/lib/shared/types";

import { contentMarginMobile } from "./sizes";

const ResponsiveContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  paddingBlock: theme.spacing(5),
  ...responsiveContent(theme, {
    [MobileBreakpoint.Down]: {
      gap: theme.spacing(5),
      paddingBlockStart: theme.spacing(6),
      paddingBlockEnd: theme.spacing(7),
      paddingInline: theme.spacing(contentMarginMobile.leftRight),
    },
  }),
}));

interface FooterLinkProps extends RequiresChildren {
  href: string;
}

function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <Box display="contents" role="listitem">
      <ScopedInternalLink
        level="title-md"
        sx={{ color: "white", textDecorationColor: "white" }}
        href={href}
      >
        {children}
      </ScopedInternalLink>
    </Box>
  );
}

export function Footer(props: DepartmentInfoProps) {
  const { t } = useTranslation("footer");
  const routes = useRoutes();
  const { data: config } = useGetConfig();

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "neutral.700",
        marginTop: "auto",
        paddingTop: byBreakpoint({ desktop: "150px", mobile: "80px" }),
        backgroundClip: "content-box",
      }}
    >
      <ResponsiveContainer>
        <Typography fontSize="1.125rem" sx={{ color: "white" }}>
          © {props.department.name} {new Date().getFullYear()}
        </Typography>
        <Stack
          role="list"
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
          <FooterLink href={routes.data_privacy_rights}>
            {t("data_privacy_rights_link")}
          </FooterLink>
          <FooterLink href={routes.accessibility}>
            {t("accessibility_link")}
          </FooterLink>
          <FooterLink href={routes.termsOfUse}>
            {t("terms_of_use_link")}
          </FooterLink>
          {config.isOpenDataEnabled && (
            <FooterLink href={routes.openData}>
              {t("open_data_link")}
            </FooterLink>
          )}
          <FooterLink href={routes.contact}>{t("contact_link")}</FooterLink>
        </Stack>
      </ResponsiveContainer>
    </Box>
  );
}
