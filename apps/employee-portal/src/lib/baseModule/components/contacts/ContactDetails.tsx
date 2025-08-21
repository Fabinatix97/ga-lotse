/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Divider, Stack, Typography } from "@mui/joy";
import { isDefined, isNonNullish } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import {
  BaseAddressDetailsColumn,
  CONTACT_CATEGORY_NAMES,
  Contact,
  ContentPanel,
  DetailsItem,
  DetailsRow,
  EditButton,
  ResponsiveDivider,
  formatSubCategory,
  isInstitutionContact,
  isPersonContact,
  useHasUserRoleCheck,
} from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  GENDER_VALUES,
  InternalLinkButton,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@eshg/lib-portal";

import { useUpdateContactSidebar } from "@/lib/baseModule/components/contacts/modals/UpdateContactSidebar";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import {
  ExternalLinkDetailsItem,
  emailHref,
  phoneHref,
} from "@/lib/shared/components/detailsSection/ExternalLinkDetailsItem";

export function ContactDetails({ contact }: { contact: Contact }) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseContactsWrite);
  const hasChatUserRole = useHasUserRoleCheck(ApiUserRole.ChatUser);
  const updateSidebar = useUpdateContactSidebar();

  const showEmailPhoneSection =
    (contact.emailAddresses?.length ?? 0) +
      (contact.phoneNumbers?.length ?? 0) >
    0;

  return (
    <ContentPanel dense={false} testId="contact-details-panel">
      {hasWritePerms && (
        <EditButton
          sx={{ maxWidth: "fit-content", flex: 0, alignSelf: "flex-end" }}
          onClick={() => updateSidebar.open({ contact })}
        />
      )}
      <DetailsList>
        <Stack
          gap={3}
          direction={{
            xxs: "column",
            md: "row",
          }}
          divider={<ResponsiveDivider />}
        >
          <DetailsColumn>
            {isPersonContact(contact) && (
              <>
                <DetailsRow>
                  {isDefined(contact.salutation) && (
                    <DetailsItem
                      label="Anrede"
                      value={
                        contact.salutation !== "NOT_SPECIFIED"
                          ? SALUTATION_VALUES[contact.salutation]
                          : undefined
                      }
                    />
                  )}
                  <DetailsItem
                    label="Titel"
                    value={getOptionalTitle(contact.title)}
                  />
                </DetailsRow>
                <DetailsItem label="Vorname" value={contact.firstName} />
                <DetailsItem label="Name" value={contact.name} />

                {isDefined(contact.gender) && (
                  <DetailsItem
                    label="Geschlecht"
                    value={GENDER_VALUES[contact.gender]}
                  />
                )}

                {contact.externalChatUsername && hasChatUserRole && (
                  <>
                    <DetailsItem
                      label="Chat-ID"
                      value={
                        <ChatUserId
                          userId={contact.externalChatUsername}
                          noLabel
                          isParagraph
                        />
                      }
                    />
                    <InternalLinkButton
                      href={routes.userRoom(contact.externalChatUsername)}
                      startDecorator={<ChatOutlinedIcon />}
                      variant="outlined"
                      sx={{
                        alignSelf: "flex-start",
                        maxWidth: "100%",
                        mt: 1,
                      }}
                    >
                      Direktnachricht
                    </InternalLinkButton>
                  </>
                )}
              </>
            )}
            {isInstitutionContact(contact) && (
              <>
                <DetailsItem label="Name" value={contact.name} />
                <DetailsItem
                  label="Objekttyp"
                  value={
                    isNonNullish(contact.category)
                      ? CONTACT_CATEGORY_NAMES[contact.category]
                      : undefined
                  }
                />
                <DetailsItem
                  label="Objektart"
                  value={formatSubCategory(
                    contact.category,
                    contact.subCategory,
                  )}
                />
              </>
            )}
          </DetailsColumn>

          {isDefined(contact.contactAddress) && (
            <DetailsColumn>
              <BaseAddressDetailsColumn
                address={contact.contactAddress}
                sx={{ flex: 1 }}
              />
              {isDefined(contact.differentBillingAddress) && (
                <>
                  <Divider />
                  <Typography level="title-md">Rechnungsadresse</Typography>
                  <BaseAddressDetailsColumn
                    address={contact.differentBillingAddress}
                  />
                </>
              )}
            </DetailsColumn>
          )}

          {showEmailPhoneSection && (
            <DetailsColumn>
              {contact.emailAddresses?.map((emailAddress, index) => (
                <ExternalLinkDetailsItem
                  key={[emailAddress, index].join("-")}
                  label="E-Mail-Adresse"
                  value={emailAddress}
                  href={emailHref}
                />
              ))}
              {contact.phoneNumbers?.map((phoneNumber, index) => (
                <ExternalLinkDetailsItem
                  key={[phoneNumber, index].join("-")}
                  label="Telefonnummer"
                  value={phoneNumber}
                  href={phoneHref}
                />
              ))}
            </DetailsColumn>
          )}
        </Stack>
      </DetailsList>
    </ContentPanel>
  );
}
