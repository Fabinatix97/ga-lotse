/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence;

import static de.eshg.base.contact.persistence.ContactSearchSpecificationUtil.*;
import static de.eshg.base.util.PaginationUtil.getPageable;

import de.eshg.base.address.AddressDto;
import de.eshg.base.address.DomesticAddressDto;
import de.eshg.base.address.PostboxAddressDto;
import de.eshg.base.audit.RevisionPair;
import de.eshg.base.contact.ContactMapper;
import de.eshg.base.contact.api.AbstractUpdateContactRequest;
import de.eshg.base.contact.api.UpdateInstitutionContactRequest;
import de.eshg.base.contact.api.UpdatePersonContactRequest;
import de.eshg.base.contact.api.VCardInstitutionContactDto;
import de.eshg.base.contact.api.VCardPersonContactDto;
import de.eshg.base.contact.persistence.entity.Contact;
import de.eshg.base.contact.persistence.entity.ContactAddress;
import de.eshg.base.contact.persistence.entity.ContactAddress_;
import de.eshg.base.contact.persistence.entity.ContactEmailAddress;
import de.eshg.base.contact.persistence.entity.ContactPhoneNumber;
import de.eshg.base.contact.persistence.entity.Contact_;
import de.eshg.base.contact.persistence.entity.DomesticContactAddress;
import de.eshg.base.contact.persistence.entity.InstitutionContact;
import de.eshg.base.contact.persistence.entity.InstitutionContactCategory;
import de.eshg.base.contact.persistence.entity.PersonContact;
import de.eshg.base.contact.persistence.entity.PostboxContactAddress;
import de.eshg.base.contact.persistence.repository.ContactRepository;
import de.eshg.base.util.MappingUtil;
import de.eshg.base.util.PaginationUtil.PageSpec;
import de.eshg.domain.model.BaseRevisionEntity_;
import de.eshg.domain.model.audit.DefaultRevisionEntity_;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.mapper.AuditMapper;
import de.eshg.mapper.RevisionEntryWithChange;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.metamodel.SingularAttribute;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.function.Consumer;
import org.apache.commons.collections4.ListUtils;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.AuditQuery;
import org.hibernate.envers.query.criteria.AuditDisjunction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

  public static final String RELEVANCE_SORT_KEY = "RELEVANCE";
  public static final String TYPE_SORT_KEY = "TYPE";
  public static final String CATEGORY_SORT_KEY = "CATEGORY";

  private final ContactRepository contactRepository;
  private final AuditLogger auditLogger;
  private final EntityManager entityManager;

  public ContactService(
      ContactRepository contactRepository, AuditLogger auditLogger, EntityManager entityManager) {
    this.contactRepository = contactRepository;
    this.auditLogger = auditLogger;
    this.entityManager = entityManager;
  }

  public Optional<Contact> findById(UUID id) {
    return contactRepository.findById(id);
  }

  public List<Contact> findAllById(List<UUID> ids) {
    return contactRepository.findAllById(ids);
  }

  public List<RevisionEntryWithChange<Contact>> getContactHistory(
      UUID id, UUID userId, Instant before) {
    AuditReader reader = AuditReaderFactory.get(entityManager);
    AuditQuery query =
        reader
            .createQuery()
            .forRevisionsOfEntityWithChanges(Contact.class, true)
            .add(AuditEntity.id().eq(id));
    addQueryCondition(query, userId, before);
    return AuditMapper.mapToRevisionEntryWithChangeList(Contact.class, query.getResultList());
  }

  public List<RevisionEntryWithChange<ContactAddress>> getAllContactAddressHistory(
      UUID contactId, UUID userId, Instant before) {
    AuditReader reader = AuditReaderFactory.get(entityManager);
    AuditQuery query =
        reader
            .createQuery()
            .forRevisionsOfEntityWithChanges(ContactAddress.class, true)
            .add(getRelatedContactIdCriterion(contactId));
    addQueryCondition(query, userId, before);
    return AuditMapper.mapToRevisionEntryWithChangeList(
        ContactAddress.class, query.getResultList());
  }

  private static AuditDisjunction getRelatedContactIdCriterion(UUID contactId) {
    AuditDisjunction addressQuery = new AuditDisjunction();
    addressQuery.add(
        AuditEntity.relatedId(ContactAddress_.CONTACT_OF_CONTACT_ADDRESS).eq(contactId));
    addressQuery.add(
        AuditEntity.relatedId(ContactAddress_.CONTACT_OF_DIFFERENT_BILLING_ADDRESS).eq(contactId));
    return addressQuery;
  }

  private static void addQueryCondition(AuditQuery query, UUID userId, Instant before) {
    if (before != null) {
      query.add(AuditEntity.revisionProperty(BaseRevisionEntity_.CREATED_AT).lt(before));
    }
    if (userId != null) {
      query.add(AuditEntity.revisionProperty(DefaultRevisionEntity_.CREATED_BY).eq(userId));
    }
  }

  public RevisionPair<Contact> getContactRevisionChanges(UUID contactId, long revisionId) {
    AuditReader reader = AuditReaderFactory.get(entityManager);

    RevisionEntryWithChange<Contact> after =
        AuditMapper.mapToRevisionEntryWithChange(
            Contact.class,
            (Object[])
                reader
                    .createQuery()
                    .forRevisionsOfEntityWithChanges(Contact.class, true)
                    .add(AuditEntity.id().eq(contactId))
                    .add(AuditEntity.revisionNumber().eq(revisionId))
                    .setMaxResults(1)
                    .getSingleResult());

    if (after.getType() == RevisionType.ADD) {
      return new RevisionPair<>(null, after);
    }

    RevisionEntryWithChange<Contact> before =
        AuditMapper.mapToRevisionEntryWithChange(
            Contact.class,
            (Object[])
                reader
                    .createQuery()
                    .forRevisionsOfEntityWithChanges(Contact.class, true)
                    .add(AuditEntity.id().eq(contactId))
                    .add(AuditEntity.revisionNumber().lt(revisionId))
                    .addOrder(AuditEntity.revisionNumber().desc())
                    .setMaxResults(1)
                    .getSingleResult());

    return new RevisionPair<>(before, after);
  }

  public RevisionPair<ContactAddress> getContactAddressRevisionChanges(
      UUID contactId, long addressId, long revisionId) {
    AuditReader reader = AuditReaderFactory.get(entityManager);

    RevisionEntryWithChange<ContactAddress> after =
        AuditMapper.mapToRevisionEntryWithChange(
            ContactAddress.class,
            (Object[])
                reader
                    .createQuery()
                    .forRevisionsOfEntityWithChanges(ContactAddress.class, true)
                    .add(getRelatedContactIdCriterion(contactId))
                    .add(AuditEntity.id().eq(addressId))
                    .add(AuditEntity.revisionNumber().eq(revisionId))
                    .setMaxResults(1)
                    .getSingleResult());

    if (after.getType() == RevisionType.ADD) {
      return new RevisionPair<>(null, after);
    }

    RevisionEntryWithChange<ContactAddress> before =
        AuditMapper.mapToRevisionEntryWithChange(
            ContactAddress.class,
            (Object[])
                reader
                    .createQuery()
                    .forRevisionsOfEntityWithChanges(ContactAddress.class, true)
                    .add(getRelatedContactIdCriterion(contactId))
                    .add(AuditEntity.revisionNumber().lt(revisionId))
                    .add(AuditEntity.id().eq(addressId))
                    .addOrder(AuditEntity.revisionNumber().desc())
                    .setMaxResults(1)
                    .getSingleResult());

    return new RevisionPair<>(before, after);
  }

  public Contact save(Contact contact) {
    return contactRepository.save(contact);
  }

  public Contact addContact(
      Contact contact, ContactAddress contactAddress, ContactAddress differentBillingAddress) {
    save(contact);
    setOrAddContactAddress(contact, contactAddress);
    setOrAddDifferentBillingAddress(contact, differentBillingAddress);

    Contact saved = save(contact);
    writeAuditLog("Anlegen", mapAuditLog(saved));
    return saved;
  }

  public Contact update(InstitutionContact contact, UpdateInstitutionContactRequest request) {
    contact.setCategory(ContactMapper.mapInstitutionContactCategoryToDm(request.category()));
    return updateContact(contact, request);
  }

  public Contact update(PersonContact contact, UpdatePersonContactRequest request) {
    contact.setTitle(request.title());
    contact.setFirstName(request.firstName());
    contact.setSalutation(MappingUtil.mapSalutationToDm(request.salutation()));
    contact.setGender(MappingUtil.mapGenderToDm(request.gender()));
    contact.setExternalChatUsername(request.externalChatUsername());
    return updateContact(contact, request);
  }

  private Contact updateContact(Contact contact, AbstractUpdateContactRequest request) {
    contact.setName(request.name());
    updateAddress(
        contact.getContactAddress(),
        a -> setOrAddContactAddress(contact, a),
        request.contactAddress());
    updateAddress(
        contact.getDifferentBillingAddress(),
        a -> setOrAddDifferentBillingAddress(contact, a),
        request.differentBillingAddress());

    updateEmailAddresses(contact, request);
    // Envers needs a flush between audited list changes to compute the modification flags
    // correctly (although everything else works fine without the flush!)
    entityManager.flush();
    updatePhoneNumbers(contact, request);

    writeAuditLog("Editieren", mapAuditLog(contact));
    return contact;
  }

  private static void updateEmailAddresses(Contact contact, AbstractUpdateContactRequest request) {
    List<ContactEmailAddress> existingEmails = contact.getEmailAddresses();
    List<String> requestedEmails = request.emailAddresses();
    List<String> unchangedEmails = new ArrayList<>();
    List<ContactEmailAddress> removedEmails = new ArrayList<>();

    if (requestedEmails == null) {
      removedEmails.addAll(existingEmails);
    } else {
      existingEmails.forEach(
          existingEmail -> {
            String existingEmailString = existingEmail.getEmailAddress();
            if (requestedEmails.stream().anyMatch(existingEmailString::equals)) {
              unchangedEmails.add(existingEmailString);
            } else {
              removedEmails.add(existingEmail);
            }
          });
      List<String> newEmails = ListUtils.removeAll(requestedEmails, unchangedEmails);
      contact.addEmailAddresses(ContactMapper.mapEmailAddressesToDm(newEmails));
    }
    contact.removeEmailAddresses(removedEmails);
  }

  private static void updatePhoneNumbers(Contact contact, AbstractUpdateContactRequest request) {
    List<String> requestedPhoneNumbers = request.phoneNumbers();
    List<ContactPhoneNumber> existingPhoneNumbers = contact.getPhoneNumbers();
    List<String> unchangedPhoneNumbers = new ArrayList<>();
    List<ContactPhoneNumber> removedPhoneNumbers = new ArrayList<>();

    if (requestedPhoneNumbers == null) {
      removedPhoneNumbers.addAll(existingPhoneNumbers);
    } else {
      existingPhoneNumbers.forEach(
          existingPhoneNumber -> {
            String existingPhoneNumberString = existingPhoneNumber.getPhoneNumber();
            if (requestedPhoneNumbers.stream().anyMatch(existingPhoneNumberString::equals)) {
              unchangedPhoneNumbers.add(existingPhoneNumberString);
            } else {
              removedPhoneNumbers.add(existingPhoneNumber);
            }
          });
      List<String> newPhoneNumbers =
          ListUtils.removeAll(requestedPhoneNumbers, unchangedPhoneNumbers);
      contact.addPhoneNumbers(ContactMapper.mapPhoneNumbersToDm(newPhoneNumbers));
    }
    contact.removePhoneNumbers(removedPhoneNumbers);
  }

  private void updateAddress(
      ContactAddress existingAddress,
      Consumer<ContactAddress> addressConsumer,
      AddressDto addressDto) {
    if (existingAddress == null && addressDto != null) {
      addressConsumer.accept(ContactMapper.mapAddressIntoDm(addressDto));
    } else if (existingAddress != null) {
      if (addressDto == null) {
        entityManager.remove(existingAddress);
        addressConsumer.accept(null);
      } else if (addressDto instanceof DomesticAddressDto domesticAddressDto
          && existingAddress instanceof DomesticContactAddress existingDomesticAddress) {
        ContactMapper.mapAddressIntoDm(domesticAddressDto, existingDomesticAddress);
      } else if (addressDto instanceof PostboxAddressDto postboxAddressDto
          && existingAddress instanceof PostboxContactAddress existingPostboxAddress) {
        ContactMapper.mapAddressIntoDm(postboxAddressDto, existingPostboxAddress);
      } else {
        entityManager.remove(existingAddress);
        entityManager.flush();
        addressConsumer.accept(ContactMapper.mapAddressIntoDm(addressDto));
      }
    }
  }

  public void setOrAddContactAddress(Contact contact, ContactAddress contactAddress) {
    setOrAddAddress(a -> a.setContactOfContactAddress(contact), contactAddress);
    contact.setContactAddress(contactAddress);
  }

  public void setOrAddDifferentBillingAddress(
      Contact contact, ContactAddress differentBillingAddress) {
    setOrAddAddress(a -> a.setContactOfDifferentBillingAddress(contact), differentBillingAddress);
    contact.setDifferentBillingAddress(differentBillingAddress);
  }

  private void setOrAddAddress(Consumer<ContactAddress> contactSetter, ContactAddress address) {
    if (address != null) {
      contactSetter.accept(address);
      entityManager.persist(address);
    }
  }

  public <T extends Contact> Page<T> fuzzySearchContacts(
      String name,
      String firstName,
      String street,
      Class<T> type,
      InstitutionContactCategory category,
      PageSpec pageSpec) {
    Specification<Contact> specification =
        Specification.allOf(
            isNotMergedInto(),
            containsNameOrHasFuzzy(name),
            containsFirstNameOrHasFuzzy(firstName),
            containsStreetOrHasFuzzy(street),
            hasCategory(category));
    if (!type.equals(Contact.class)) {
      specification = Specification.allOf(specification, hasType(type));
    }
    return fuzzySortAndPage(name, firstName, street, pageSpec, specification).map(type::cast);
  }

  private Page<Contact> fuzzySortAndPage(
      String name,
      String firstname,
      String street,
      PageSpec pageSpec,
      Specification<Contact> specification) {
    String sortKey = pageSpec.order().getProperty();
    SingularAttribute<Contact, String> fallbackSortKey = Contact_.name;

    switch (sortKey) {
      case RELEVANCE_SORT_KEY -> {
        specification =
            Specification.allOf(specification, orderBySimilarity(name, firstname, street));
        return contactRepository.findAll(
            specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
      }
      case TYPE_SORT_KEY -> {
        specification =
            Specification.allOf(specification, orderByType(pageSpec.order(), fallbackSortKey));
        return contactRepository.findAll(
            specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
      }
      case CATEGORY_SORT_KEY -> {
        specification =
            Specification.allOf(specification, orderByCategory(pageSpec.order(), fallbackSortKey));
        return contactRepository.findAll(
            specification, PageRequest.of(pageSpec.pageNumber(), pageSpec.pageSize()));
      }
      default -> {
        Pageable pageable = getPageable(pageSpec, fallbackSortKey.getName());
        return contactRepository.findAll(specification, pageable);
      }
    }
  }

  public void merge(Contact target, Contact source) {
    target.setMergedFrom(source);
    source.setMergedInto(target);
    contactRepository.updateMergeRefs(target, source);
    writeAuditLog("Zusammenführen", mapAuditLogForMerge(source, target));
  }

  public void lockAll(List<Contact> contacts) {
    // Sort by id to prevent deadlocks
    Set<Contact> sorted = new TreeSet<>(Comparator.comparing(Contact::getId));
    sorted.addAll(contacts);
    for (Contact contact : sorted) {
      entityManager.lock(contact, LockModeType.PESSIMISTIC_WRITE);
    }
  }

  public Page<InstitutionContact> findMatchesForInstitutionContactImport(
      VCardInstitutionContactDto vCardData) {
    if (vCardData.fullName().isBlank()
        && (vCardData.addresses().isEmpty()
            || vCardData.addresses().getFirst().street().isBlank())) {
      return Page.empty();
    }

    return fuzzySearchContacts(
        vCardData.fullName(),
        null,
        vCardData.addresses().getFirst().street(),
        InstitutionContact.class,
        null,
        getPageSpec());
  }

  public Page<PersonContact> findMatchesForPersonContactImport(VCardPersonContactDto vCardData) {
    if (vCardData.lastName().isBlank() && vCardData.firstName().isBlank()) {
      return Page.empty();
    }

    return fuzzySearchContacts(
        vCardData.lastName(),
        vCardData.firstName(),
        null,
        PersonContact.class,
        null,
        getPageSpec());
  }

  private void writeAuditLog(String operationName, Map<String, String> attributes) {
    attributes = new LinkedHashMap<>(attributes);
    attributes.put(
        "durch Benutzer", CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"));
    auditLogger.log("Kontaktmanagement", operationName, attributes);
  }

  private Map<String, String> mapAuditLog(Contact contact) {
    return Map.of("Kontakt ID", contact.getExternalId().toString());
  }

  private Map<String, String> mapAuditLogForMerge(Contact target, Contact source) {
    return Map.of(
        "Quelle Kontakt ID", source.getExternalId().toString(),
        "Ziel Kontakt ID", target.getExternalId().toString());
  }
}
