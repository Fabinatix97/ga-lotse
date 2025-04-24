/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.eshg.base.address.persistence.entity.Address;
import de.eshg.base.bundid.persistence.entity.BundIdPersonLink;
import de.eshg.base.bundid.persistence.entity.BundIdPersonLink_;
import de.eshg.base.centralfile.CentralFileData;
import de.eshg.base.util.Gender;
import de.eshg.base.util.Salutation;
import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(
    indexes = {
      @Index(columnList = "reference_person_id"),
      @Index(columnList = "first_name, last_name, date_of_birth")
    })
@EntityListeners(AuditingEntityListener.class)
public class Person extends SequencedBaseEntityWithExternalId implements CentralFileData {

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
  String firstName;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  String lastName;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Embedded
  private BirthDetails birthDetails;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PersonEmailAddress_.PERSON,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  @BatchSize(size = 100)
  private final List<PersonEmailAddress> emailAddresses = new ArrayList<>();

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = PersonPhoneNumber_.PERSON,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OrderBy
  @BatchSize(size = 100)
  private final List<PersonPhoneNumber> phoneNumbers = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Salutation salutation;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Gender gender;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.PROTECTED)
  private DataOrigin dataOrigin;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reference_person_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Person referencePerson;

  @OneToOne(cascade = CascadeType.PERSIST, orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private PersonAddress contactAddress;

  @OneToOne(cascade = CascadeType.PERSIST, orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private PersonAddress differentBillingAddress;

  @OneToOne(
      cascade = CascadeType.REMOVE,
      orphanRemoval = true,
      mappedBy = BundIdPersonLink_.REFERENCE_PERSON)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private BundIdPersonLink bundIdPersonLink;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(unique = true)
  @Min(0L)
  @Max((1L << 40L) - 1L)
  private Long humanReadableId;

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
    return getReferencePerson();
  }

  public void setReferenceVersion(Long referenceVersion) {
    this.referenceVersion = referenceVersion;
  }

  @Override
  public DataOrigin getDataOrigin() {
    return dataOrigin;
  }

  public void setDataOrigin(DataOrigin dataOrigin) {
    this.dataOrigin = dataOrigin;
  }

  public Person getReferencePerson() {
    return referencePerson;
  }

  public void setReferencePerson(Person referencePerson) {
    this.referencePerson = referencePerson;
  }

  public Person cloneFromFileState() {
    Person clone = new Person();
    clone.setReferencePerson(null);
    clone.setTitle(getTitle());
    clone.setSalutation(getSalutation());
    clone.setGender(getGender());
    clone.setFirstName(getFirstName());
    clone.setLastName(getLastName());
    clone.setBirthDetails(
        new BirthDetails(
            getBirthDetails().dateOfBirth(),
            getBirthDetails().nameAtBirth(),
            getBirthDetails().placeOfBirth(),
            getBirthDetails().countryOfBirth()));
    clone.setEmailAddresses(getEmailAddresses());
    clone.setPhoneNumbers(getPhoneNumbers());
    clone.setReferenceVersion(null);
    clone.setContactAddress(cloneAddress(getContactAddress()));
    clone.setDifferentBillingAddress(cloneAddress(getDifferentBillingAddress()));
    clone.setDataOrigin(getDataOrigin());
    return clone;
  }

  public Person cloneFromReferencePerson() {
    Person clone = new Person();
    clone.setReferencePerson(this);
    clone.setTitle(getTitle());
    clone.setSalutation(getSalutation());
    clone.setGender(getGender());
    clone.setFirstName(getFirstName());
    clone.setLastName(getLastName());
    clone.setBirthDetails(
        new BirthDetails(
            getBirthDetails().dateOfBirth(),
            getBirthDetails().nameAtBirth(),
            getBirthDetails().placeOfBirth(),
            getBirthDetails().countryOfBirth()));
    clone.setEmailAddresses(getEmailAddresses());
    clone.setPhoneNumbers(getPhoneNumbers());
    clone.setReferenceVersion(getVersion());
    clone.setContactAddress(cloneAddress(getContactAddress()));
    clone.setDifferentBillingAddress(cloneAddress(getDifferentBillingAddress()));
    clone.setDataOrigin(getDataOrigin());
    return clone;
  }

  public PersonAddress cloneAddress(PersonAddress address) {
    return switch (address) {
      case null -> null;
      case PostboxPersonAddress postboxAddress -> clonePostBoxAddress(postboxAddress);
      case DomesticPersonAddress domesticAddress -> cloneDomesticAddress(domesticAddress);
      default -> throw new RuntimeException("Unexpected instance of Address");
    };
  }

  private PostboxPersonAddress clonePostBoxAddress(PostboxPersonAddress address) {
    PostboxPersonAddress clone = new PostboxPersonAddress();
    setAddressAttributesOnClone(address, clone);
    clone.setPostbox(address.getPostbox());
    return clone;
  }

  private DomesticPersonAddress cloneDomesticAddress(DomesticPersonAddress address) {
    DomesticPersonAddress clone = new DomesticPersonAddress();
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

  public List<PersonEmailAddress> getEmailAddresses() {
    return emailAddresses;
  }

  public void setEmailAddresses(List<PersonEmailAddress> emailAddresses) {
    removeEmailAddresses(getEmailAddresses());
    ArrayList<PersonEmailAddress> newEmailAddresses =
        emailAddresses.stream()
            .map(this::cloneEmailAddress)
            .collect(Collectors.toCollection(ArrayList::new));
    this.addEmailAddresses(newEmailAddresses);
  }

  private PersonEmailAddress cloneEmailAddress(PersonEmailAddress emailAddress) {
    PersonEmailAddress clone = new PersonEmailAddress();
    clone.setPerson(null);
    clone.setEmailAddress(emailAddress.getEmailAddress());
    return clone;
  }

  public void addEmailAddresses(Collection<PersonEmailAddress> newEmail) {
    newEmail.forEach(a -> a.setPerson(this));
    this.emailAddresses.addAll(newEmail);
  }

  public void removeEmailAddresses(Collection<PersonEmailAddress> removedEmailAddresses) {
    removedEmailAddresses.forEach(a -> a.setPerson(null));
    this.emailAddresses.removeAll(removedEmailAddresses);
  }

  public List<PersonPhoneNumber> getPhoneNumbers() {
    return phoneNumbers;
  }

  public void setPhoneNumbers(List<PersonPhoneNumber> phoneNumbers) {
    removePhoneNumbers(getPhoneNumbers());
    ArrayList<PersonPhoneNumber> newPhoneNumbers =
        phoneNumbers.stream()
            .map(this::clonePhoneNumber)
            .collect(Collectors.toCollection(ArrayList::new));
    this.addPhoneNumbers(newPhoneNumbers);
  }

  private PersonPhoneNumber clonePhoneNumber(PersonPhoneNumber phoneNumber) {
    PersonPhoneNumber clone = new PersonPhoneNumber();
    clone.setPerson(null);
    clone.setPhoneNumber(phoneNumber.getPhoneNumber());
    return clone;
  }

  public void addPhoneNumbers(Collection<PersonPhoneNumber> newPhone) {
    newPhone.forEach(a -> a.setPerson(this));
    this.phoneNumbers.addAll(newPhone);
  }

  public void removePhoneNumbers(Collection<PersonPhoneNumber> removedPhoneNumbers) {
    removedPhoneNumbers.forEach(a -> a.setPerson(null));
    this.phoneNumbers.removeAll(removedPhoneNumbers);
  }

  public BirthDetails getBirthDetails() {
    return birthDetails;
  }

  public void setBirthDetails(BirthDetails birthDetails) {
    this.birthDetails = birthDetails;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Salutation getSalutation() {
    return salutation;
  }

  public void setSalutation(Salutation salutation) {
    this.salutation = salutation;
  }

  public Gender getGender() {
    return gender;
  }

  public void setGender(Gender gender) {
    this.gender = gender;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public PersonAddress getContactAddress() {
    return contactAddress;
  }

  public void setContactAddress(PersonAddress contactAddress) {
    this.contactAddress = contactAddress;
  }

  public PersonAddress getDifferentBillingAddress() {
    return differentBillingAddress;
  }

  public void setDifferentBillingAddress(PersonAddress differentBillingAddress) {
    this.differentBillingAddress = differentBillingAddress;
  }

  public void setBundIdPersonLink(BundIdPersonLink bundIdPersonLink) {
    this.bundIdPersonLink = bundIdPersonLink;
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
    return referencePerson == null;
  }

  @JsonIgnore
  public boolean isFileState() {
    return referencePerson != null;
  }

  @JsonIgnore
  public boolean isMarkedForDeletion() {
    return deleteAt != null;
  }

  @JsonIgnore
  public boolean isActive() {
    return deleteAt == null;
  }

  public Long getHumanReadableId() {
    return humanReadableId;
  }

  public void setHumanReadableId(long humanReadableId) {
    this.humanReadableId = humanReadableId;
  }
}
