/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReferenceFacilityResponse,
  ApiGetReferencePersonResponse,
} from "@eshg/base-api";
import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode, useState } from "react";
import { isNonNullish } from "remeda";

import { mapAddCentralFileIdToGdprProcedureRequest } from "@/lib/baseModule/api/mapper/gdpr";
import { useAddCentralFileIdToGdprProcedure } from "@/lib/baseModule/api/mutations/gdpr";
import { FacilityCardContent } from "@/lib/baseModule/components/facility/FacilityCardContent";
import { PersonCardContent } from "@/lib/baseModule/components/person/PersonCardContent";
import { SelectableCard } from "@/lib/shared/components/cards/SelectableCard";
import { FacilityDetailsSidebar } from "@/lib/shared/components/facilitySidebar/FacilityDetailsSidebar";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { PersonDetailsSidebar } from "@/lib/shared/components/personSidebar/PersonDetailsSidebar";
import { fullAddress } from "@/lib/shared/helpers/facilityUtils";
import { useResetAlertContextOnChange } from "@/lib/shared/hooks/useResetAlertContextOnChange";

type CentralFileData =
  | ApiGetReferencePersonResponse
  | ApiGetReferenceFacilityResponse;

interface LinkCentralFileSidebarProps<TMatch> {
  procedureId: string;
  procedureVersion: number;
  title: string;
  matches: TMatch[];
  renderMatchCard: (match: TMatch) => ReactNode;
  renderDetailsSidebar: (props: {
    match: TMatch;
    onSelect: () => Promise<void>;
    onBack: () => void;
    onCancel: () => void;
  }) => ReactNode;
  onClose: () => void;
}

type LinkSidebarProps<TMatch> = Omit<
  LinkCentralFileSidebarProps<TMatch>,
  "title" | "renderMatchCard" | "renderDetailsSidebar"
>;

export function LinkFacilitySidebar(
  props: LinkSidebarProps<ApiGetReferenceFacilityResponse>,
) {
  return (
    <LinkCentralFileSidebar
      title={"Einrichtung anheften"}
      renderMatchCard={(match) => (
        <FacilityCardContent
          name={match.name}
          address={fullAddress(match.contactAddress)}
          phoneNumber={match.phoneNumbers.at(0)}
          emailAddress={match.emailAddresses.at(0)}
        />
      )}
      renderDetailsSidebar={(props) => (
        <FacilityDetailsSidebar
          title={"Einrichtung anheften"}
          submitLabel={"Anheften"}
          facility={props.match}
          onSubmit={props.onSelect}
          onCancel={props.onCancel}
          onBack={props.onBack}
        />
      )}
      {...props}
    />
  );
}

export function LinkPersonSidebar(
  props: LinkSidebarProps<ApiGetReferencePersonResponse>,
) {
  return (
    <LinkCentralFileSidebar
      title={"Person anheften"}
      renderMatchCard={(match) => <PersonCardContent person={match} />}
      renderDetailsSidebar={(props) => (
        <PersonDetailsSidebar
          title={"Person anheften"}
          submitLabel={"Anheften"}
          person={props.match}
          onSubmit={props.onSelect}
          onCancel={props.onCancel}
          onBack={props.onBack}
        />
      )}
      {...props}
    />
  );
}

function LinkCentralFileSidebar<TMatch extends CentralFileData>({
  procedureId,
  procedureVersion,
  title,
  matches,
  renderMatchCard,
  renderDetailsSidebar,
  onClose,
}: LinkCentralFileSidebarProps<TMatch>) {
  const [selected, setSelected] = useState<TMatch>();
  const { openConfirmationDialog } = useConfirmationDialog();

  useResetAlertContextOnChange(selected);

  const addCentralFileIdToGdprProcedure =
    useAddCentralFileIdToGdprProcedure(procedureId);

  async function doSubmit() {
    if (isNonNullish(selected)) {
      await addCentralFileIdToGdprProcedure.mutateAsync(
        mapAddCentralFileIdToGdprProcedureRequest(
          selected.id,
          procedureVersion,
        ),
        { onSuccess: onClose },
      );
    } else {
      onClose();
    }
  }

  function handleSubmit(): Promise<void> {
    return new Promise((resolve, reject) => {
      openConfirmationDialog({
        title: "Datensatz anheften",
        description: "Wollen Sie diesen Datensatz an diesen Vorgang anheften?",
        onConfirm: () => doSubmit().then(resolve).catch(reject),
        onClose: () => resolve(),
      });
    });
  }

  return (
    <>
      {isNonNullish(selected) ? (
        renderDetailsSidebar({
          match: selected,
          onSelect: () => handleSubmit(),
          onBack: () => setSelected(undefined),
          onCancel: onClose,
        })
      ) : (
        <Formik
          initialValues={{ selected: "" }}
          onSubmit={({ selected }) =>
            setSelected(matches.find((it) => it.id === selected))
          }
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <SidebarForm>
              <SidebarContent title={title}>
                <RadioGroupField name={"selected"} required={"Bitte auswählen"}>
                  <Stack gap={1}>
                    {matches.map((match) => (
                      <SelectableCard key={match.id} value={match.id}>
                        {renderMatchCard(match)}
                      </SelectableCard>
                    ))}
                  </Stack>
                </RadioGroupField>
              </SidebarContent>
              <SidebarActions>
                <MultiFormButtonBar
                  submitting={isSubmitting}
                  submitLabel={"Auswählen"}
                  onCancel={onClose}
                />
              </SidebarActions>
            </SidebarForm>
          )}
        </Formik>
      )}
    </>
  );
}
