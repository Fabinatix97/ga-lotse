/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ApiGetReferenceFacilityResponse } from "@eshg/base-api";
import {
  OverlayBoundary,
  Sidebar,
  SidebarFormHandle,
  createEmptyAddress,
  mapApiAddressToForm,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { ReactNode, useEffect, useRef, useState } from "react";
import { isNullish } from "remeda";

import { useAddFacility } from "@/lib/baseModule/api/mutations/facility";
import { FacilityForm } from "@/lib/shared/components/facilitySidebar/FacilityForm";
import { FacilitySearch } from "@/lib/shared/components/facilitySidebar/search/FacilitySearch";
import { BaseFacility } from "@/lib/shared/components/facilitySidebar/types";
import {
  createEmptyContactPerson,
  mapApiContactPersonToForm,
} from "@/lib/shared/helpers/facilityUtils";

export enum Mode {
  search,
  edit,
}

interface LegacyFacilitySidebarProps {
  /** Whether the sidebar should be open */
  open: boolean;
  /** Called when the sidebar is closed by the user */
  onClose: () => void;
  /** The mode to open the sidebar in, either `search` or `edit`. The default is `search`. */
  mode?: Mode;
  /**
   * Facility to edit or search for. Optional for `mode === search`.
   * Required when `mode === edit`.
   */
  facility?: BaseFacility;
  /**
   * Called in search mode when the user selected an existing facility and
   * confirmed the selection by clicking on the "Continue" button. This is not
   * needed if you only use the edit mode.
   */
  onSelectFacility?: (
    facility: ApiGetReferenceFacilityResponse,
  ) => void | Promise<void>;
  /**
   * Optional callback to save a facility. Called in edit mode after the user
   * edited a facility and pressed "save". Also called in search mode after the
   * user decided to create and edit a new facility. Optional; by default the
   * facility is saved using `FacilityApi.addFacilityFileState()`.
   */
  onSubmit?: (data: BaseFacility) => Promise<unknown>;
  /**
   * Called in edit mode after the facility has been saved successfully. Also
   * called in search mode after the user decided to create and edit a new
   * facility. Optional; by default the snackbar message "Einrichtung
   * erfolgreich gespeichert" gets displayed.
   *
   * This callback is called with two parameters:
   * `formData`: the facility form data entered by the user;
   * `response`: the response returned by `onSubmit`.
   *
   * If you do NOT set this callback, the default behaviour of FacilitySidebar
   * is to:
   *   * display a message "Einrichtung erfolgreich gespeichert",
   *   * close the sidebar and
   *   * reset the form, i.e. clear all fields for the next call.
   */
  onSaveSuccess?: (formData: BaseFacility, response: unknown) => void;
  /**
   * Only for some special usecases: display a different header in the search
   * results. Optional.
   */
  searchResultsHeader?: ReactNode;
  /**
   * The title to render when sidebar is in edit mode.
   */
  titleEdit?: string;
  contactPersonRequired?: boolean;
  extraFieldsTop?: ReactNode;
  extraFieldsBottom?: ReactNode;
  extraFieldsInitialValues?: NonNullable<unknown>;
}

export function LegacyFacilitySidebar({
  open,
  onClose,
  mode: pMode,
  facility: pFacility,
  onSelectFacility,
  onSubmit,
  onSaveSuccess,
  searchResultsHeader,
  titleEdit,
  contactPersonRequired,
  extraFieldsTop,
  extraFieldsBottom,
  extraFieldsInitialValues,
}: LegacyFacilitySidebarProps) {
  const [mode, setMode] = useState<Mode>(pMode ?? Mode.search);
  const [editFacility, setEditFacility] = useState<BaseFacility | null>(
    isNullish(pFacility) ? null : pFacility,
  );

  useEffect(() => {
    // update editFacility when the facility changes from outside
    setEditFacility(isNullish(pFacility) ? null : pFacility);
  }, [pFacility]);

  const { openCancelDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  function resetAndCloseForm() {
    sidebarFormRef.current?.resetForm();
    setMode(pMode ?? Mode.search);
    onClose();
  }

  function handleCancel() {
    if (!sidebarFormRef.current?.dirty) {
      resetAndCloseForm();
      return;
    }
    openCancelDialog({
      onConfirm: resetAndCloseForm,
    });
  }

  async function handleSelectFacility(
    facility: ApiGetReferenceFacilityResponse,
  ) {
    if (onSelectFacility) {
      await onSelectFacility(facility);
      resetAndCloseForm();
    } else {
      setEditFacility({
        ...extraFieldsInitialValues,
        ...mapApiFacilityData(facility),
      });
      setMode(Mode.edit);
    }
  }

  function handleCreateFacility(facility?: Partial<BaseFacility>) {
    setMode(Mode.edit);
    setEditFacility({
      name: facility?.name ?? "",
      emailAddresses: facility?.emailAddresses ?? [""],
      phoneNumbers: facility?.phoneNumbers ?? [""],
      contactAddress: isNullish(facility?.contactAddress)
        ? createEmptyAddress()
        : mapApiAddressToForm(facility.contactAddress),
      billingAddress: isNullish(facility?.billingAddress)
        ? undefined
        : mapApiAddressToForm(facility.billingAddress),
      contactPersons:
        facility?.contactPersons ??
        (contactPersonRequired ? [createEmptyContactPerson()] : []),
      ...extraFieldsInitialValues,
    } as BaseFacility);
  }

  const { mutateAsync: addFacility } = useAddFacility();

  async function handleSubmit(data: BaseFacility) {
    const cleanedData = {
      ...data,
      emailAddresses: data.emailAddresses.filter((email) =>
        isNonEmptyString(email),
      ),
      phoneNumbers: data.phoneNumbers.filter((phone) =>
        isNonEmptyString(phone),
      ),
    };
    if (onSubmit) {
      const response = await onSubmit(cleanedData);
      afterSaveSuccess(response, data);
    } else {
      const response = await addFacility(cleanedData);
      afterSaveSuccess(response, data);
    }
  }

  function afterSaveSuccess(response: unknown, data: BaseFacility) {
    if (onSaveSuccess) {
      onSaveSuccess(data, response);
    } else {
      snackbar.confirmation("Einrichtung erfolgreich gespeichert.");
    }
    resetAndCloseForm();
  }

  return (
    <Sidebar open={open} onClose={handleCancel}>
      <OverlayBoundary>
        {mode === Mode.edit ? (
          <FacilityForm
            title={titleEdit ?? "Neue Einrichtung anlegen"}
            facility={editFacility ?? createNewFacility(pFacility?.name)}
            sidebarFormRef={sidebarFormRef}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            contactPersonRequired={contactPersonRequired}
            extraFieldsTop={extraFieldsTop}
            extraFieldsBottom={extraFieldsBottom}
          />
        ) : (
          <FacilitySearch
            searchFacility={pFacility}
            searchResultsHeader={searchResultsHeader}
            onSelectFacility={handleSelectFacility}
            onCreateFacility={handleCreateFacility}
            onCancel={handleCancel}
          />
        )}
      </OverlayBoundary>
    </Sidebar>
  );
}

function createNewFacility(name?: string): BaseFacility {
  return {
    name: name ?? "",
    emailAddresses: [""],
    phoneNumbers: [""],
    contactAddress: createEmptyAddress(),
    billingAddress: undefined,
    contactPersons: [],
  };
}

function mapApiFacilityData(
  searchArgs: ApiGetReferenceFacilityResponse,
): BaseFacility {
  return {
    name: searchArgs?.name ?? "",
    emailAddresses: searchArgs?.emailAddresses ?? [],
    phoneNumbers: searchArgs?.phoneNumbers ?? [],
    contactAddress:
      mapApiAddressToForm(searchArgs.contactAddress!) ?? createEmptyAddress(),
    billingAddress: isNullish(searchArgs.differentBillingAddress)
      ? undefined
      : mapApiAddressToForm(searchArgs.differentBillingAddress),
    contactPersons:
      searchArgs?.contactPersons?.map(mapApiContactPersonToForm) ?? [],
  };
}
