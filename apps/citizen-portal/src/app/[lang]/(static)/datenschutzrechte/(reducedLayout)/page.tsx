/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import InternetIcon from "@mui/icons-material/LanguageOutlined";
import { Button, Sheet, SheetProps, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { Trans } from "react-i18next";

import { ExternalLink } from "@eshg/lib-portal";

import { UserType } from "@/lib/baseModule/components/layout/types";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";
import { AddressSection } from "@/lib/shared/components/AddressSection";
import { ContactSection } from "@/lib/shared/components/ContactSection";
import { LoginRedirectDialog } from "@/lib/shared/components/dialogs/LoginRedirectDialog";
import {
  InfoSection,
  InfoSectionGrid,
  InfoSectionTitle,
} from "@/lib/shared/components/infoSection";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  ContentSheet,
  ContentSheetTitle,
} from "@/lib/shared/components/layout/contentSheet";
import { PageTitle } from "@/lib/shared/components/layout/page";
import { ScopedInternalLink } from "@/lib/shared/components/scopedLinks";

interface LoginModalState {
  open: boolean;
  type: UserType;
}

export default function DataPrivacyRightsEntrypointPage() {
  const [loginModalState, setLoginModalState] = useState<LoginModalState>({
    open: false,
    type: "organization",
  });
  const { data: department } = useGetDepartmentInfo();
  const { t } = useTranslation("gdpr");
  const routes = useRoutes();

  return (
    <>
      <PageContent>
        <PageTitle>{t("entrypoint.title")}</PageTitle>

        <ContentSheet>
          <ContentSheetTitle>
            {t("entrypoint.intro_section.title")}
          </ContentSheetTitle>
          <Typography>
            <Trans
              i18nKey="gdpr:entrypoint.intro_section.description"
              components={{
                InternalLink: (
                  <ScopedInternalLink href={routes.privacyPolicy}>
                    {routes.privacyPolicy}
                  </ScopedInternalLink>
                ),
              }}
            />
          </Typography>
        </ContentSheet>

        <ContentSheet missingTitle>
          <Typography>
            {t("entrypoint.your_rights_section.description")}
          </Typography>

          <InfoSectionGrid>
            <StyledColumnSheet
              component="section"
              aria-labelledby="column-1-section"
            >
              <Typography level="h2" id="column-1-section">
                {t("entrypoint.your_rights_section.online.title")}
              </Typography>
              <InfoSection icon={<InternetIcon />}>
                <InfoSectionTitle>
                  {t("entrypoint.your_rights_section.online.internet.title")}
                </InfoSectionTitle>
                <Typography
                  sx={{
                    whiteSpace: "preserve",
                    textWrap: "pretty",
                    hyphens: "auto",
                    overflowWrap: "anywhere",
                  }}
                >
                  <Trans
                    i18nKey="gdpr:entrypoint.your_rights_section.online.internet.description"
                    components={{
                      BundIdLink: (
                        <ExternalLink
                          href="https://id.bund.de/de"
                          openInNewTab
                          sx={{ hyphens: "manual" }}
                        >
                          BundID
                        </ExternalLink>
                      ),
                      MukLink: (
                        <ExternalLink
                          href="https://info.mein-unternehmenskonto.de/"
                          openInNewTab
                          sx={{ hyphens: "manual" }}
                        >
                          Mein Unternehmenskonto
                        </ExternalLink>
                      ),
                    }}
                  />
                </Typography>
              </InfoSection>
              <Stack
                direction="row"
                justifyContent="center"
                flexWrap="wrap"
                gap={2}
                sx={{
                  marginTop: "auto",
                }}
              >
                <Button
                  sx={{ minWidth: "fit-content" }}
                  onClick={() =>
                    setLoginModalState({
                      open: true,
                      type: "person",
                    })
                  }
                >
                  {t("entrypoint.your_rights_section.online.buttons.person")}
                </Button>
                <Button
                  sx={{ minWidth: "fit-content" }}
                  onClick={() =>
                    setLoginModalState({
                      open: true,
                      type: "organization",
                    })
                  }
                >
                  {t(
                    "entrypoint.your_rights_section.online.buttons.organization",
                  )}
                </Button>
              </Stack>
            </StyledColumnSheet>
            <StyledColumnSheet
              component="section"
              aria-labelledby="column-2-section"
            >
              <Typography level="h2" id="column-2-section">
                {t("entrypoint.your_rights_section.in_person.title")}
              </Typography>
              <AddressSection department={department} />
              <ContactSection department={department} />
            </StyledColumnSheet>
          </InfoSectionGrid>
        </ContentSheet>
      </PageContent>
      <LoginRedirectDialog
        type={loginModalState.type}
        open={loginModalState.open}
        onClose={() =>
          setLoginModalState({
            open: false,
            type: loginModalState.type,
          })
        }
      />
    </>
  );
}

function StyledColumnSheet(props: Omit<SheetProps, "sx">) {
  return (
    <Sheet
      {...props}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.level1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      })}
    />
  );
}
