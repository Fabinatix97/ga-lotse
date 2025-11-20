<#macro content date labelSignature >
  <table class="date-and-signature">
    <colgroup>
      <col style="width: 20%;"/>
      <col style="width: 80%;"/>
    </colgroup>

    <tr>
      <td style="vertical-align: bottom; padding-bottom: 5px;">
        ${date}
      </td>
      <td style="vertical-align: bottom; padding-bottom: 5px;">
        <div class="signature-line">&#160;</div>
      </td>
    </tr>

    <tr>
      <td>
        (Datum)
      </td>
      <td style="text-align: center;">
        ${labelSignature}
      </td>
    </tr>
  </table>
</#macro>
