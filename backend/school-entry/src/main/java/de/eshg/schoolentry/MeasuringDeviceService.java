/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry;

import de.eshg.lib.gdt.GdtRecord;
import de.eshg.rest.service.error.NotFoundException;
import de.eshg.schoolentry.business.model.PersonDetailsData;
import de.eshg.schoolentry.domain.model.GdtDriver;
import de.eshg.schoolentry.domain.model.HearingTestResult;
import de.eshg.schoolentry.domain.model.MeasuringDevice;
import de.eshg.schoolentry.domain.model.PendingMeasurement;
import de.eshg.schoolentry.domain.repository.MeasuringDeviceRepository;
import de.eshg.schoolentry.util.CorrelationIdGenerator;
import de.eshg.schoolentry.util.NameAliasGenerator;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class MeasuringDeviceService {

  private final MeasuringDeviceRepository measuringDeviceRepository;
  private final CorrelationIdGenerator correlationIdGenerator;

  public MeasuringDeviceService(
      MeasuringDeviceRepository measuringDeviceRepository,
      CorrelationIdGenerator correlationIdGenerator) {
    this.measuringDeviceRepository = measuringDeviceRepository;
    this.correlationIdGenerator = correlationIdGenerator;
  }

  public PendingMeasurement initiateHearingTest(
      UUID procedureId, String equipmentSelector, PersonDetailsData child) {
    MeasuringDevice measuringDevice =
        findMeasuringDeviceByEquipmentSelectorOrThrow(equipmentSelector);

    String correlationId = correlationIdGenerator.generateCorrelationId();

    NameAliasGenerator.NameAlias nameAlias =
        NameAliasGenerator.generateAlias(
            procedureId, child.gender(), child.firstName(), child.lastName());

    byte[] gdtBytes = createHearingTestRequest(measuringDevice, child, nameAlias, correlationId);
    sendGdtFileToFileJockey(equipmentSelector, correlationId, gdtBytes);

    PendingMeasurement pendingMeasurement = new PendingMeasurement();
    pendingMeasurement.setCorrelationId(correlationId);
    pendingMeasurement.setEquipmentSelector(equipmentSelector);
    pendingMeasurement.setEquipmentName(measuringDevice.getName());
    pendingMeasurement.setFirstNameAlias(nameAlias.firstName());
    pendingMeasurement.setLastNameAlias(nameAlias.lastName());

    return pendingMeasurement;
  }

  public HearingTestResult completeHearingTest(HearingTestResult current) {
    String equipmentSelector = current.getPendingMeasurement().getEquipmentSelector();
    String correlationId = current.getPendingMeasurement().getCorrelationId();

    MeasuringDevice measuringDevice =
        findMeasuringDeviceByEquipmentSelectorOrThrow(equipmentSelector);

    // TODO
    // getbyte
    // select driver

    byte[] gdtBytes = getGdtFileFromFileJockey(equipmentSelector, correlationId);
    HearingTestResult result = extractTestResultFromResponse(gdtBytes, current);

    return result;
  }

  private byte[] createHearingTestRequest(
      MeasuringDevice device,
      PersonDetailsData child,
      NameAliasGenerator.NameAlias nameAlias,
      String correlationId) {
    GdtDriver driver = device.getDriver();

    GdtRecord gdtRecord =
        driver.domainToGdt(device.getEquipmentSelector(), correlationId, child, nameAlias);
    return driver.serialize(gdtRecord);
  }

  private void sendGdtFileToFileJockey(
      String equipmentSelector, String correlationId, byte[] gdtBytes) {
    // TODO
  }

  private HearingTestResult extractTestResultFromResponse(
      byte[] gdtBytes, HearingTestResult current) {
    // TODO
    HearingTestResult result = new HearingTestResult();
    result.setLeftEar(null);
    result.setRightEar(null);
    result.setExaminationResult(null);
    result.setNote(current.getNote());
    result.setPendingMeasurement(null);
    return result;
  }

  private byte[] getGdtFileFromFileJockey(String equipmentSelector, String correlationId) {
    // TODO
    return new byte[0];
  }

  private MeasuringDevice findMeasuringDeviceByEquipmentSelectorOrThrow(String equipmentSelector) {
    return measuringDeviceRepository
        .findByEquipmentSelector(equipmentSelector)
        .orElseThrow(
            () ->
                new NotFoundException(
                    "Measuring device with equipment selector '%s' not found."
                        .formatted(equipmentSelector)));
  }
}
