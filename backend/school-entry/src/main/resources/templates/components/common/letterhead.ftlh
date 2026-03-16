<#macro style>
  .header {
    width: 100%;
  }

  .header .letterhead td {
    padding-top: 20px;
  }

  .header .receiver .officeAddress {
    font-size: 8pt;
    margin-bottom: 2mm;
  }

  .header .receiver .addressee {
    font-size: 9pt;
    font-weight: 600;
  }

  .receiver, .sender {
    vertical-align: top;
  }

  .sender .sender-label {
    font-size: 8pt;
    font-weight: 400;
    line-height: 1.5em;
  }

  .sender .sender-address {
    font-size: 9pt;
    margin-bottom: 2mm;
  }

  .sender .sender-data {
    font-size: 9pt;
    font-weight: 600;
  }
</#macro>

<#macro content sender logo date employeeInfo>
<#-- @ftlvariable name="sender" type="de.eshg.schoolentry.api.pdf.Address" -->
<#-- @ftlvariable name="logo" type="de.eshg.lib.document.generator.department.DepartmentLogo" -->
<#-- @ftlvariable name="date" type="java.lang.String" -->
  <table class="header">
    <colgroup>
      <col style="width: 65%;" />
      <col style="width: 35%;" />
    </colgroup>
    <tr>
      <td>
      </td>
      <td>
        <img src="data:${logo.contentType};base64,${logo.contentAsBase64}" alt="logo"
             style="width: 130px; height: 2cm" />
      </td>
    </tr>
    <tr class="letterhead">
      <td class="receiver" style="padding-top: 12mm">
        <div class="officeAddress">${sender.name}, ${sender.street}, ${sender.zipCode} ${sender.city}</div>
        <div class="addressee">
          <#nested />
        </div>
      </td>
      <td class="sender">
        <div class="sender-address">
          <div>${sender.name}</div>
          <div>${sender.street}</div>
          <div>${sender.zipCode} ${sender.city}</div>
        </div>
        <#if employeeInfo?has_content && employeeInfo.lastName?has_content &&  employeeInfo.firstName?has_content>
          <div class="sender-label">Ansprechperson</div>
          <div class="sender-data">${employeeInfo.
            salutation!""} ${employeeInfo.title!""}
            ${employeeInfo.firstName?substring(0,1)?upper_case}.
            ${employeeInfo.lastName}</div>
          <#if employeeInfo.phoneNumber??>
            <div class="sender-label">Telefon</div>
            <div class="sender-data">${employeeInfo.phoneNumber}</div>
          <#else>
            <#if office.phoneNumber?has_content>
              <div class="sender-label">Telefon</div>
              <div class="sender-data">
                <#list office.phoneNumber as phone>
                  <div>${phone}</div>
                </#list>
              </div>
            </#if>
          </#if>
          <div class="sender-label">E-Mail</div>
          <div class="sender-data">${employeeInfo.email}</div>
        <#else>
          <#if office.phoneNumber?has_content>
            <div class="sender-label">Telefon</div>
            <div class="sender-data">
              <#list office.phoneNumber as phone>
                <div>${phone}</div>
              </#list>
            </div>
          </#if>
          <#if office.email?has_content>
            <div class="sender-label">E-Mail</div>
            <div class="sender-data">
              <#list office.email as email>
                <div>${email}</div>
              </#list>
            </div>
          </#if>
        </#if>
        <div class="sender-label">Datum</div>
        <div class="sender-data">${date}</div>
      </td>
    </tr>
  </table>
</#macro>

