/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.centralfile.CentralFileData;
import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(indexes = @Index(columnList = "reference_facility_id"))
@EntityListeners(AuditingEntityListener.class)
public class Facility extends BaseEntityWithExternalId implements CentralFileData {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant deleteAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Long referenceVersion;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String name;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = FacilityEmailAddress_.FACILITY,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  private final List<FacilityEmailAddress> emailAddresses = new ArrayList<>();

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = FacilityPhoneNumber_.FACILITY,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  private final List<FacilityPhoneNumber> phoneNumbers = new ArrayList<>();

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = FacilityContactPerson_.FACILITY,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @OrderBy
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<FacilityContactPerson> contactPersons = new ArrayList<>();

  @OneToOne(cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private FacilityAddress contactAddress;

  @OneToOne(cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private FacilityAddress differentBillingAddress;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private DataOrigin dataOrigin;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reference_facility_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Facility referenceFacility;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  @Override
  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant date) {
    this.modifiedAt = date;
  }

  @Override
  public Long getReferenceVersion() {
    return referenceVersion;
  }

  @Override
  public CentralFileData getReferenceData() {
    return getReferenceFacility();
  }

  public void setReferenceVersion(Long referenceVersion) {
    this.referenceVersion = referenceVersion;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<FacilityEmailAddress> getEmailAddresses() {
    return emailAddresses;
  }

  public List<FacilityPhoneNumber> getPhoneNumbers() {
    return phoneNumbers;
  }

  public List<FacilityContactPerson> getContactPersons() {
    return contactPersons;
  }

  public void setContactPersons(List<FacilityContactPerson> newContactPersons) {
    removeContactPersons(getContactPersons());
    addContactPersons(
        newContactPersons.stream()
            .map(this::cloneFacilityContactPersonFromFileState)
            .collect(Collectors.toCollection(ArrayList::new)));
  }

  public void addContactPersons(Collection<FacilityContactPerson> newContactPersons) {
    newContactPersons.forEach(c -> c.setFacility(this));
    this.contactPersons.addAll(newContactPersons);
  }

  public void removeContactPersons(Collection<FacilityContactPerson> contactPersons) {
    contactPersons.forEach(c -> c.setFacility(null));
    this.contactPersons.removeAll(contactPersons);
  }

  public FacilityAddress getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(FacilityAddress contactAddress) {
    this.contactAddress = contactAddress;
  }

  public FacilityAddress getDifferentBillingAddress() {
    return differentBillingAddress;
  }

  public void setDifferentBillingAddress(FacilityAddress differentBillingAddress) {
    this.differentBillingAddress = differentBillingAddress;
  }

  @Override
  public DataOrigin getDataOrigin() {
    return dataOrigin;
  }

  public void setDataOrigin(DataOrigin dataOrigin) {
    this.dataOrigin = dataOrigin;
  }

  public Facility getReferenceFacility() {
    return referenceFacility;
  }

  public void setReferenceFacility(Facility referenceFacility) {
    this.referenceFacility = referenceFacility;
  }

  public Facility cloneFromFileState() {
    Facility clone = new Facility();
    clone.setReferenceFacility(null);
    clone.setName(getName());
    clone.setEmailAddresses(getEmailAddresses());
    clone.setPhoneNumbers(getPhoneNumbers());
    clone.setReferenceVersion(null);
    clone.setDataOrigin(getDataOrigin());
    clone.setContactPersons(getContactPersons());
    clone.setContactAddress(cloneAddress(getContactAddress()));
    clone.setDifferentBillingAddress(cloneAddress(getDifferentBillingAddress()));

    return clone;
  }

  public Facility cloneFromReferenceFacility() {
    Facility clone = new Facility();
    clone.setReferenceFacility(this);
    clone.setName(getName());
    clone.setEmailAddresses(getEmailAddresses());
    clone.setPhoneNumbers(getPhoneNumbers());
    clone.setReferenceVersion(getVersion());
    clone.setDataOrigin(getDataOrigin());
    clone.setContactPersons(getContactPersons());
    clone.setContactAddress(cloneAddress(getContactAddress()));
    clone.setDifferentBillingAddress(cloneAddress(getDifferentBillingAddress()));

    return clone;
  }

  public void setEmailAddresses(List<FacilityEmailAddress> emailAddresses) {
    removeEmailAddresses(getEmailAddresses());
    ArrayList<FacilityEmailAddress> newEmailAddresses =
        emailAddresses.stream()
            .map(this::cloneEmailAddress)
            .collect(Collectors.toCollection(ArrayList::new));
    this.addEmailAddresses(newEmailAddresses);
  }

  public void addEmailAddresses(Collection<FacilityEmailAddress> newEmail) {
    newEmail.forEach(a -> a.setFacility(this));
    this.emailAddresses.addAll(newEmail);
  }

  public void removeEmailAddresses(Collection<FacilityEmailAddress> removedEmailAddresses) {
    removedEmailAddresses.forEach(a -> a.setFacility(null));
    this.emailAddresses.removeAll(removedEmailAddresses);
  }

  private FacilityEmailAddress cloneEmailAddress(FacilityEmailAddress emailAddress) {
    FacilityEmailAddress clone = new FacilityEmailAddress();
    clone.setFacility(null);
    clone.setEmailAddress(emailAddress.getEmailAddress());
    return clone;
  }

  public void setPhoneNumbers(List<FacilityPhoneNumber> phoneNumbers) {
    removePhoneNumbers(getPhoneNumbers());
    ArrayList<FacilityPhoneNumber> newPhoneNumbers =
        phoneNumbers.stream()
            .map(this::clonePhoneNumber)
            .collect(Collectors.toCollection(ArrayList::new));
    this.addPhoneNumbers(newPhoneNumbers);
  }

  private FacilityPhoneNumber clonePhoneNumber(FacilityPhoneNumber phoneNumber) {
    FacilityPhoneNumber clone = new FacilityPhoneNumber();
    clone.setFacility(null);
    clone.setPhoneNumber(phoneNumber.getPhoneNumber());
    return clone;
  }

  public void addPhoneNumbers(Collection<FacilityPhoneNumber> phoneNumbers) {
    phoneNumbers.forEach(a -> a.setFacility(this));
    this.phoneNumbers.addAll(phoneNumbers);
  }

  public void removePhoneNumbers(Collection<FacilityPhoneNumber> removedPhoneNumbers) {
    removedPhoneNumbers.forEach(a -> a.setFacility(null));
    this.phoneNumbers.removeAll(removedPhoneNumbers);
  }

  public FacilityContactPerson cloneFacilityContactPersonFromFileState(
      FacilityContactPerson facilityContactPerson) {
    FacilityContactPerson clone = new FacilityContactPerson();
    clone.setFacility(this);
    clone.setEmailAddress(facilityContactPerson.getEmailAddress());
    clone.setPhoneNumber(facilityContactPerson.getPhoneNumber());
    clone.setRole(facilityContactPerson.getRole());
    clone.setLastName(facilityContactPerson.getLastName());
    clone.setFirstName(facilityContactPerson.getFirstName());
    clone.setTitle(facilityContactPerson.getTitle());
    clone.setSalutation(facilityContactPerson.getSalutation());
    clone.setGender(facilityContactPerson.getGender());

    return clone;
  }

  public FacilityAddress cloneAddress(FacilityAddress address) {
    return switch (address) {
      case null -> null;
      case PostboxFacilityAddress postboxAddress -> clonePostBoxAddress(postboxAddress);
      case DomesticFacilityAddress domesticAddress -> cloneDomesticAddress(domesticAddress);
      default -> throw new RuntimeException("Unexpected instance of Address");
    };
  }

  private PostboxFacilityAddress clonePostBoxAddress(PostboxFacilityAddress address) {
    PostboxFacilityAddress clone = new PostboxFacilityAddress();
    setAddressAttributesOnClone(address, clone);
    clone.setPostbox(address.getPostbox());
    return clone;
  }

  private DomesticFacilityAddress cloneDomesticAddress(DomesticFacilityAddress address) {
    DomesticFacilityAddress clone = new DomesticFacilityAddress();
    setAddressAttributesOnClone(address, clone);
    clone.setStreet(address.getStreet());
    clone.setHouseNumber(address.getHouseNumber());
    clone.setAddressAddition(address.getAddressAddition());
    return clone;
  }

  private static void setAddressAttributesOnClone(Address address, Address clone) {
    clone.setPostalCode(address.getPostalCode());
    clone.setCity(address.getCity());
    clone.setCountry(address.getCountry());
    clone.setDifferentName(address.getDifferentName());
  }

  @Override
  public Instant getDeleteAt() {
    return deleteAt;
  }

  public void setDeleteAt(Instant deleteAt) {
    this.deleteAt = deleteAt;
  }

  @JsonIgnore
  public boolean isReferenceData() {
    return referenceFacility == null;
  }

  @JsonIgnore
  public boolean isFileState() {
    return referenceFacility != null;
  }

  @JsonIgnore
  public boolean isMarkedForDeletion() {
    return deleteAt != null;
  }

  @JsonIgnore
  public boolean isActive() {
    return deleteAt == null;
  }
}
