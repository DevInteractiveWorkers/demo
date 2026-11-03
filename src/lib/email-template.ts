// lib/email-template.ts
// Shared HTML for the notification emails sent to the team
// (support requests and demo requests).

const LOGO_URL =
  "https://assets.cdn.filesafe.space/dtfCxBE6SEYaCMFTlgu5/media/6a4e72d7708c41d4dff4d1de.png";

type Row = [label: string, value: string];

type FormEmailOptions = {
  logoAlt: string;
  /** Optional <h2> under the logo in the red header. */
  headerTitle?: string;
  labelWidth: number;
  infoTitle: string;
  info: Row[];
  messageTitle: string;
  message: string;
  technical: Row[];
  footer: string;
};

const rows = (items: Row[]) =>
  items
    .map(
      ([label, value]) => `
<tr>
<td class="label">${label}</td>
<td>${value}</td>
</tr>
`,
    )
    .join("");

export function renderFormEmail({
  logoAlt,
  headerTitle,
  labelWidth,
  infoTitle,
  info,
  messageTitle,
  message,
  technical,
  footer,
}: FormEmailOptions) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
body{
    margin:0;
    padding:32px;
    background:#f5f5f5;
    font-family:Arial,Helvetica,sans-serif;
    color:#222;
}

.container{
    max-width:800px;
    margin:auto;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 14px rgba(0,0,0,.08);
}

.header{
    background:#c1272d;
    color:#fff;
    padding:24px;
}

.header h2{
    text-align:center;
    margin:0;
}

.section{
    padding:28px;
}

table{
    width:100%;
    border-collapse:collapse;
}

td{
    padding:10px;
    border-bottom:1px solid #eee;
    vertical-align:top;
}

.label{
    width:${labelWidth}px;
    font-weight:bold;
    color:#444;
}

.description{
    margin-top:12px;
    border:1px solid #ddd;
    background:#fafafa;
    border-radius:8px;
    padding:16px;
    white-space:pre-wrap;
}

.footer{
    background:#fafafa;
    padding:20px;
    color:#666;
    font-size:13px;
}

.logo{
    max-width:100%;
    height:auto;
    display:block;
    margin:auto;
}
</style>
</head>

<body>

<div class="container">

<div class="header">
<img
    src="${LOGO_URL}"
    alt="${logoAlt}"
    width="260"
    class="logo"
/>
${headerTitle ? `<h2>${headerTitle}</h2>` : ""}
</div>

<div class="section">

<h3>${infoTitle}</h3>

<table>
${rows(info)}
</table>

<h3 style="margin-top:32px;">${messageTitle}</h3>

<div class="description">
${message}
</div>

<h3 style="margin-top:32px;">Technical Information</h3>

<table>
${rows(technical)}
</table>

</div>

<div class="footer">
${footer}
</div>

</div>

</body>
</html>
`;
}
