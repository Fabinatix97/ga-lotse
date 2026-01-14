<#macro style>
  .header {
    width: 100%;
  }

  .header .letterhead td {
    padding-top: 20px;
  }

  .department .department-address {
    font-size: 9pt;
    margin-bottom: 2mm;
  }
</#macro>

<#macro content person department extraLine="">
<#-- @ftlvariable name="person" type="de.eshg.prostituteprotection.pdf.PersonData" -->
<#-- @ftlvariable name="department" type="de.eshg.prostituteprotection.pdf.DepartmentData" -->
  <table class="header">
    <colgroup>
      <col style="width: 65%;" />
      <col style="width: 35%;" />
    </colgroup>
    <tr>
      <td>
      </td>
      <td>
        <img src="data:${department.contentType};base64,${department.contentAsBase64}" alt="logo"
             style="width: 130px; height: 2cm" />
      </td>
    </tr>
    <tr class="letterhead">
      <td>
        <div>Name: ${person.firstName} ${person.lastName}</div>
        <#if person.alias?has_content>
          <div>Alias: ${person.alias}</div>
        </#if>
        <div>Geburtsdatum: ${person.dateOfBirth}</div>
        <#if extraLine?has_content>
          <div>${extraLine}</div>
        </#if>
      </td>
      <td class="department">
        <div class="department-address">
          <div>${department.name}</div>
          <div>${department.street}</div>
          <div>${department.zipCode} ${department.city}</div>
        </div>
      </td>
    </tr>
  </table>
</#macro>

