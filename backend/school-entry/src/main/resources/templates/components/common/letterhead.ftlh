<#macro style>
  .header {
    padding-top: 13mm;
    margin-bottom: 40px;
    width: 100%;
  }

  .header .letterhead td {
    padding-top: 20px;
  }

  .header .receiver .officeAddress {
    font-size: 0.75rem;
    margin-bottom: 2mm;
  }

  .header .receiver .addressee {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .receiver, .sender {
    vertical-align: top;
  }

  .sender .sender-label {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5em;
  }

  .sender .sender-address {
    margin-bottom: 5mm;
  }

  .sender .sender-data {
    margin-bottom: 2mm;
  }
</#macro>

<#macro content sender logo date >
<#-- @ftlvariable name="sender" type="de.eshg.schoolentry.pdf.Address" -->
<#-- @ftlvariable name="logo" type="de.eshg.lib.document.generator.department.DepartmentLogo" -->
<#-- @ftlvariable name="date" type="java.lang.String" -->
  <table class="header">
    <colgroup>
      <col style="width: 70%;" />
      <col style="width: 30%;" />
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
      <td class="receiver">
        <div class="officeAddress">${sender.name}, ${sender.street}, ${sender.zipCode} ${sender.city}</div>
        <div class="addressee">
          <#nested />
        </div>
      </td>
      <td class="sender">
        <div class="sender-address">
          <div>${sender.name}</div>
          <div>${sender.street}</div>
          <div class="sender-data">${sender.zipCode} ${sender.city}</div>
        </div>
        <div class="sender-label">Telefon</div>
        <div class="sender-data">${sender.phoneNumber}</div>
        <#if sender.email??>
          <div class="sender-label">E-Mail</div>
          <div class="sender-data">${sender.email}</div>
        </#if>
        <div class="sender-label">Datum</div>
        <div class="sender-data">${date}</div>
        <div class="sender-label">Aktenzeichen</div>
        <div>-</div>
        <div style="font-size: 0.75rem; font-weight: 400; line-height: 1.5em;">(bitte bei Antwort angeben)</div>
      </td>
    </tr>
  </table>
</#macro>

