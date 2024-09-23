/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiCountryCode, ApiUser } from "@eshg/employee-portal-api/base";
import {
  ApiAppointmentBookingType,
  ApiAppointmentSummary,
  ApiAppointmentType,
  ApiGetVaccinationConsultationDetailsResponse,
  ApiInformationStatement,
  ApiPatient,
  ApiProcedureStatus,
  ApiServicePlanEntry,
  ApiServiceStatus,
  ApiTravelMedicineFeature,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import {
  isDateString,
  toDateString,
  toUtcDate,
} from "@eshg/lib-portal/helpers/dateTime";
import { AddOutlined } from "@mui/icons-material";
import { Button, Divider, Grid, Stack, Typography } from "@mui/joy";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { isEmpty, isNonNullish } from "remeda";

import {
  UsePatchStatusRequest,
  usePatchStatus,
  useUpdateVaccinationConsultationTravelDetails,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  useGetAllMedicalAssistants,
  useGetAllPhysicians,
} from "@/lib/businessModules/travelMedicine/api/queries/appointmentStaff";
import { useGetAllAppointmentTypes } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import { useGetAllDiseases } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import { useGetAllOtherServiceTemplates } from "@/lib/businessModules/travelMedicine/api/queries/otherServiceTemplates";
import { useGetVaccinationConsultationDetails } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useGetAllVaccines } from "@/lib/businessModules/travelMedicine/api/queries/vaccines";
import { AssignAppointmentSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AssignAppointmentSidebar";
import { InformationStatementSideBar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/InformationStatementSideBar";
import { InitialAppointmentTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/InitialAppointmentTile";
import { OtherServiceAppliedSideBar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/OtherServiceAppliedSideBar";
import { PatientTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/PatientTile";
import { ServiceAppliedSideBar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServiceAppliedSideBar";
import {
  Mode,
  ServiceAppointmentSidebar,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServiceAppointmentSidebar";
import {
  ServicePlanSideBar,
  emptyServicePlanSideBarValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanSideBar";
import { TravelDataTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TravelDataTile";
import { VaccinationConsultationInformationStatementsTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationInformationStatementsTable";
import { VaccinationConsultationServicePlanTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationServicePlanTable";
import { useSessionStorage } from "@/lib/businessModules/travelMedicine/hooks/useSessionStorage";
import { FormGridContainer } from "@/lib/shared/components/form/FormGridContainer";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";
import { isInteger } from "@/lib/shared/helpers/guards";
import { sortUsersByName } from "@/lib/shared/helpers/users";

export interface CreateProcedureValues {
  externalId: string;
  status: ApiProcedureStatus;
  patient: ApiPatient;
  travelType: ApiTravelType;
  travelDestinations: ApiCountryCode[];
  travelStartDate?: string;
  travelTimeAmount?: number;
  travelTimeUnit?: ApiTravelTimeUnit;
  services: ApiServicePlanEntry[];
  informationStatements: ApiInformationStatement[];
  templateId?: string;
  initialAppointment: ApiAppointmentSummary;
}

export interface VaccinationConsultationFormProps {
  id: string;
}

export function VaccinationConsultationDetails(
  props: Readonly<VaccinationConsultationFormProps>,
) {
  const snackbar = useSnackbar();
  const detailsResponse = useGetVaccinationConsultationDetails(props.id);
  const initialValues = createInitialFormValues(detailsResponse.data);

  const isInformationStatementEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalInformationStatement,
  );

  const [currentUsers, setCurrentUsers] = useSessionStorage(
    { physician: "", medicalAssistant: "" },
    "most-recent-users",
  );

  const alertContext = useAlertContext();

  const [serviceAppointmentSidebarOpen, setServiceAppointmentSidebarOpen] =
    useState(false);
  const [appointmentSidebarMode, setAppointmentSidebarMode] = useState<Mode>(
    Mode.create,
  );
  const [serviceSideBarOpen, setServiceSideBarOpen] = useState(false);
  const [assignAppointmentSidebarOpen, setAssignAppointmentSidebarOpen] =
    useState(false);
  const [serviceAppliedSideBarOpen, setServiceAppliedSideBarOpen] =
    useState(false);
  const [otherServiceAppliedSideBarOpen, setOtherServiceAppliedSideBarOpen] =
    useState(false);
  const [informationStatementSidebarOpen, setInformationStatementSidebarOpen] =
    useState(false);

  const [serviceId, setServiceId] = useState("");
  const [procedureStepId, setProcedureStepId] = useState("");
  const [appointmentType, setAppointmentType] = useState<
    ApiAppointmentType | undefined
  >(undefined);
  const [appointment, setAppointment] = useState<Date | undefined>(undefined);
  const [appointmentBookingType, setAppointmentBookingType] = useState<
    ApiAppointmentBookingType | undefined
  >(undefined);
  const [vaccinationInfo, setVaccinationInfo] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [batchIdentifier, setBatchIdentifier] = useState("");
  const [appliedAt, setAppliedAt] = useState(new Date());
  const [serviceTypeDescription, setServiceTypeDescription] = useState("");
  const [serviceStatus, setServiceStatus] = useState("");
  const [physician, setPhysician] = useState("");
  const [medicalAssistant, setMedicalAssistant] = useState("");

  const updateVaccinationConsultationTravelDetailsApi =
    useUpdateVaccinationConsultationTravelDetails();
  const patchStatus = usePatchStatus();

  const allVaccines = useGetAllVaccines().data.vaccines;
  const allDiseases = useGetAllDiseases().data.diseases;
  const allTemplates = useGetAllOtherServiceTemplates().data;
  /*const allFinalInformationStatementTemplates = isInformationStatementEnabled
    ? useGetAllInformationStatementTemplates().data.filter(
        (t) => t.state === ApiInformationStatementTemplateState.Final,
      )
    : [];*/

  const appointmentTypeStandardDuration = useGetAllAppointmentTypes().data.find(
    (type) => type.appointmentTypeDto == ApiAppointmentType.Vaccination,
  )!.standardDurationInMinutes;

  function resetAlertContext() {
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
  }

  function createInitialFormValues(
    newData: ApiGetVaccinationConsultationDetailsResponse,
  ): CreateProcedureValues {
    return {
      externalId: newData.procedureId as unknown as string,
      status: newData.status,
      patient: newData.patient,
      ...newData.travelInformation,
      travelStartDate:
        newData.travelInformation.travelStartDate
          ?.toISOString()
          .split("T")[0] ?? "",
      travelTimeAmount:
        newData.travelInformation.travelTimeAmount ?? ("" as unknown as number),
      services: newData.servicePlanList,
      informationStatements: newData.informationStatements,
      initialAppointment: newData.initialAppointment,
    };
  }

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      travelStartDate: initialValues.travelStartDate ?? "",
    },
    onSubmit: async () => {
      const isRealTravel = formik.values.travelType !== ApiTravelType.NoTravel;

      const travelData = createRequestEditView(isRealTravel);
      const apiRequest = {
        externalId: formik.initialValues.externalId ?? "",
        apiRequest: travelData,
      };

      await updateVaccinationConsultationTravelDetailsApi.mutateAsync(
        apiRequest,
      );
    },
  });

  function createRequestEditView(isRealTravel: boolean) {
    return {
      travelType: formik.values.travelType,
      travelDestinations:
        isRealTravel && !isEmpty(formik.values.travelDestinations)
          ? formik.values.travelDestinations
          : [],
      travelStartDate:
        isRealTravel && isDateString(formik.values.travelStartDate ?? "")
          ? toUtcDate(formik.values.travelStartDate ?? "")
          : undefined,
      travelTimeAmount:
        isRealTravel && formik.values.travelTimeAmount
          ? getTravelTimeAmount(formik.values.travelTimeAmount)
          : undefined,
      travelTimeUnit: isRealTravel ? formik.values.travelTimeUnit : undefined,
    };
  }

  function getTravelTimeAmount(travelTimeAmount: number): number {
    return isInteger(travelTimeAmount)
      ? travelTimeAmount
      : Number.parseInt(travelTimeAmount);
  }

  const initialServiceSideBarValues = {
    procedureId: initialValues.externalId,
    services: [emptyServicePlanSideBarValues],
  };

  function closeServiceAppointmentSidebar() {
    setServiceAppointmentSidebarOpen(false);
    setAppointmentSidebarMode(Mode.create);
    setAppointmentType(undefined);
    setProcedureStepId("");
    resetAlertContext();
  }

  function closeServiceSideBar() {
    setServiceSideBarOpen(false);
    resetAlertContext();
  }

  function closeServiceAppliedSideBar() {
    setServiceAppliedSideBarOpen(false);
    resetAlertContext();
  }

  function closeOtherServiceAppliedSideBar() {
    setOtherServiceAppliedSideBarOpen(false);
    resetAlertContext();
  }

  function closeAssignAppointmentSidebar() {
    setAssignAppointmentSidebarOpen(false);
    resetAlertContext();
  }

  function closeInformationStatementSidebar() {
    setInformationStatementSidebarOpen(false);
    resetAlertContext();
  }

  function handleAssignAppointment(serviceId: string) {
    if (!assignAppointmentSidebarOpen) {
      setAssignAppointmentSidebarOpen(true);
      setServiceId(serviceId);
      resetAlertContext();
    }
  }

  function handleEditAppointment(
    procedureStepId: string,
    appointmentType: ApiAppointmentType,
    appointment: Date,
    appointmentBookingType: ApiAppointmentBookingType,
  ) {
    if (!serviceAppointmentSidebarOpen) {
      setServiceAppointmentSidebarOpen(true);
      setAppointmentSidebarMode(Mode.edit);
      setProcedureStepId(procedureStepId);
      setAppointmentType(appointmentType);
      setAppointment(appointment);
      setAppointmentBookingType(appointmentBookingType);
      resetAlertContext();
    }
  }

  function handleOtherServiceApplied(
    serviceId: string,
    serviceStatus: string,
    serviceTypeDescription: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant?: string,
  ) {
    if (!otherServiceAppliedSideBarOpen) {
      setOtherServiceAppliedSideBarOpen(true);
      setServiceId(serviceId);
      setServiceStatus(serviceStatus);
      setServiceTypeDescription(serviceTypeDescription);
      setAppliedAt(isApplyingService(serviceStatus) ? new Date() : appliedAt);
      setPhysician(physician);
      setMedicalAssistant(medicalAssistant ?? "");
      resetAlertContext();
    }
  }

  function handleServiceApplied(
    serviceId: string,
    serviceStatus: string,
    vaccinationInfo: string,
    vaccineName: string,
    batchIdentifier: string,
    appliedAt: Date,
    physician: string,
    medicalAssistant?: string,
  ) {
    if (!serviceAppliedSideBarOpen) {
      setServiceAppliedSideBarOpen(true);
      setServiceId(serviceId);
      setServiceStatus(serviceStatus);
      setVaccinationInfo(vaccinationInfo);
      setVaccineName(vaccineName);
      setBatchIdentifier(
        isApplyingService(serviceStatus) ? "" : batchIdentifier,
      );
      setAppliedAt(isApplyingService(serviceStatus) ? new Date() : appliedAt);
      setPhysician(physician);
      setMedicalAssistant(medicalAssistant ?? "");
      resetAlertContext();
    }
  }

  function handleCrateInformationStatements() {
    if (!informationStatementSidebarOpen) {
      setInformationStatementSidebarOpen(true);
      resetAlertContext();
    }
  }

  function isProcedureClosed(): boolean {
    return initialValues.status === ApiProcedureStatus.Closed;
  }

  function procedureHasPlannedServices() {
    return initialValues.services.some(
      (s) => s.status === ApiServiceStatus.Planned,
    );
  }

  // Is the service currently being applied (kind of "new"), or are we just editing
  // an already applied service (kind of "edit")?
  function isApplyingService(serviceStatus: string) {
    return serviceStatus === ApiServiceStatus.Planned;
  }

  async function handleCloseProcedure() {
    if (procedureHasPlannedServices()) {
      snackbar.error(
        "Es befinden sich noch geplante Leistungen im Vorgang, diese müssen zunächst durchgeführt oder aus dem Termin entfernt werden, um den Vorgang schließen zu können.",
      );
    } else {
      const request: UsePatchStatusRequest = {
        procedureId: initialValues.externalId,
        apiProcedureStatus: ApiProcedureStatus.Closed,
      };
      await patchStatus.mutateAsync(request);
    }
  }

  async function handleReopenProcedure() {
    const request: UsePatchStatusRequest = {
      procedureId: initialValues.externalId,
      apiProcedureStatus: ApiProcedureStatus.Open,
    };
    await patchStatus.mutateAsync(request);
  }

  function determineInitialUser(
    currentUser: string,
    serviceStatus: string,
    users: ApiUser[],
    defaultUser: string,
  ) {
    let result = currentUser; // plain: just use the user stored in the model

    if (isApplyingService(serviceStatus)) {
      // when working with "new" data preset the (empty) field with the most recent user, or the 1st available option otherwise
      if (isNonNullish(defaultUser)) result = defaultUser;
      else if (isEmpty(users)) result = "";
      else result = users[0]!.userId;
    }

    return result;
  }

  const allPhysicians = useGetAllPhysicians().data.toSorted(sortUsersByName);
  const allMedicalAssistants =
    useGetAllMedicalAssistants().data.toSorted(sortUsersByName);

  const closeReopenTestId = "button-close-reopen";

  return (
    <>
      <Stack gap={3}>
        <FormikProvider value={formik}>
          <FormGridContainer onSubmit={formik.handleSubmit}>
            <Stack direction={{ md: "row" }} sx={{ flex: "1 1 auto" }}>
              <Grid xs={9} data-testid={"patient"} display={"flex"}>
                <PatientTile
                  procedureId={initialValues.externalId}
                  patient={initialValues.patient}
                  isProcedureClosed={isProcedureClosed()}
                />
              </Grid>
              <Grid xs={3} display={"flex"}>
                <Stack
                  direction={{ md: "column" }}
                  sx={{ flex: "1 1 auto" }}
                  gap={3}
                >
                  <InformationSheet>
                    <InitialAppointmentTile
                      initialValues={{
                        initialAppointment: initialValues.initialAppointment,
                      }}
                      isProcedureClosed={isProcedureClosed()}
                    />
                    <Divider orientation="horizontal" />
                    <TravelDataTile
                      initialValues={initialValues}
                      isProcedureClosed={isProcedureClosed()}
                    />
                  </InformationSheet>
                  <InformationSheet>
                    {isProcedureClosed() ? (
                      <Button
                        color="danger"
                        onClick={() => handleReopenProcedure()}
                        fullWidth
                        data-testid={closeReopenTestId}
                      >
                        Vorgang wiedereröffnen
                      </Button>
                    ) : (
                      <Stack direction={{ xxs: "column", md: "row" }} gap={2}>
                        <Button
                          onClick={() => handleCloseProcedure()}
                          fullWidth
                          data-testid={closeReopenTestId}
                        >
                          Vorgang schließen
                        </Button>
                      </Stack>
                    )}
                  </InformationSheet>
                </Stack>
              </Grid>
            </Stack>
          </FormGridContainer>
        </FormikProvider>
        <VaccinationConsultationServicePlanTable
          title={
            <Stack
              paddingX={1}
              paddingTop={1}
              direction="row"
              alignItems="center"
            >
              <Typography component="h2" level="h4">
                Leistungsplan
              </Typography>
            </Stack>
          }
          footer={
            !isProcedureClosed() && (
              <Grid xs={12}>
                <Button
                  color="primary"
                  variant="plain"
                  startDecorator={<AddOutlined />}
                  onClick={() => {
                    setServiceSideBarOpen(true);
                    resetAlertContext();
                  }}
                  disabled={!initialValues.externalId}
                >
                  Leistung hinzufügen
                </Button>
                {initialValues.services.length > 0 && (
                  <Button
                    color="primary"
                    variant="plain"
                    startDecorator={<AddOutlined />}
                    onClick={() => {
                      setServiceAppointmentSidebarOpen(true);
                      resetAlertContext();
                    }}
                    disabled={initialValues.services.every(
                      (curState) => curState.status !== ApiServiceStatus.Open,
                    )}
                  >
                    Impftermin erstellen
                  </Button>
                )}
              </Grid>
            )
          }
          data={initialValues.services}
          procedureId={initialValues.externalId ?? ""}
          isProcedureClosed={isProcedureClosed()}
          selectAppointmentOnChange={handleAssignAppointment}
          serviceAppliedOnChange={handleServiceApplied}
          otherServiceAppliedOnChange={handleOtherServiceApplied}
          selectEditAppointmentOnChange={handleEditAppointment}
        ></VaccinationConsultationServicePlanTable>
        {isInformationStatementEnabled && (
          <VaccinationConsultationInformationStatementsTable
            title={
              <Stack
                paddingX={1}
                paddingTop={1}
                direction="row"
                alignItems="center"
              >
                <Typography component="h2" level="h4">
                  Aufklärungsbögen
                </Typography>
              </Stack>
            }
            footer={
              !isProcedureClosed() && (
                <Grid xs={12}>
                  <Button
                    color="primary"
                    variant="plain"
                    startDecorator={<AddOutlined />}
                    onClick={() => {
                      handleCrateInformationStatements();
                    }}
                    disabled={isProcedureClosed()}
                  >
                    Bogen hinzufügen
                  </Button>
                </Grid>
              )
            }
            data={initialValues.informationStatements}
            procedureId={initialValues.externalId ?? ""}
            isProcedureClosed={isProcedureClosed()}
          ></VaccinationConsultationInformationStatementsTable>
        )}
      </Stack>

      <ServicePlanSideBar
        sideBarOpen={serviceSideBarOpen}
        closeSideBar={closeServiceSideBar}
        allVaccines={allVaccines}
        allDiseases={allDiseases}
        allTemplates={allTemplates}
        initialValues={initialServiceSideBarValues}
      ></ServicePlanSideBar>

      {isInformationStatementEnabled && (
        <InformationStatementSideBar
          sideBarOpen={informationStatementSidebarOpen}
          closeSideBar={closeInformationStatementSidebar}
          allDiseases={allDiseases}
          initialValues={{
            procedureId: initialValues.externalId,
          }}
        />
      )}

      <AssignAppointmentSidebar
        open={assignAppointmentSidebarOpen}
        onClose={closeAssignAppointmentSidebar}
        initialValues={{
          procedureId: initialValues.externalId,
          serviceId: serviceId,
        }}
      ></AssignAppointmentSidebar>

      <ServiceAppliedSideBar
        sideBarOpen={serviceAppliedSideBarOpen}
        closeSideBar={closeServiceAppliedSideBar}
        allPhysicians={allPhysicians}
        allMedicalAssistants={allMedicalAssistants}
        storeUsers={setCurrentUsers}
        initialValues={{
          procedureId: initialValues.externalId,
          serviceId: serviceId,
          serviceStatus: serviceStatus,
          batchIdentifier: batchIdentifier,
          appliedAt: toDateString(appliedAt),
          vaccineName: vaccineName,
          vaccinationInfo: vaccinationInfo,
          physician: determineInitialUser(
            physician,
            serviceStatus,
            allPhysicians,
            currentUsers.physician,
          ),
          medicalAssistant: determineInitialUser(
            medicalAssistant,
            serviceStatus,
            allMedicalAssistants,
            currentUsers.medicalAssistant,
          ),
        }}
      />

      <OtherServiceAppliedSideBar
        sideBarOpen={otherServiceAppliedSideBarOpen}
        closeSideBar={closeOtherServiceAppliedSideBar}
        allPhysicians={allPhysicians}
        allMedicalAssistants={allMedicalAssistants}
        storeUsers={setCurrentUsers}
        initialValues={{
          procedureId: initialValues.externalId,
          serviceId: serviceId,
          serviceStatus: serviceStatus,
          serviceTypeDescription: serviceTypeDescription,
          appliedAt: toDateString(appliedAt),
          physician: determineInitialUser(
            physician,
            serviceStatus,
            allPhysicians,
            currentUsers.physician,
          ),
          medicalAssistant: determineInitialUser(
            medicalAssistant,
            serviceStatus,
            allMedicalAssistants,
            currentUsers.medicalAssistant,
          ),
        }}
      />

      <ServiceAppointmentSidebar
        mode={appointmentSidebarMode}
        open={serviceAppointmentSidebarOpen}
        onClose={closeServiceAppointmentSidebar}
        initialValues={{
          procedureId: initialValues.externalId,
          appointmentTypeStandardDuration: appointmentTypeStandardDuration,
          procedureStepId: procedureStepId,
          appointmentType: appointmentType,
          initialAppointment: appointment,
          bookingType: appointmentBookingType,
        }}
      ></ServiceAppointmentSidebar>
    </>
  );
}
