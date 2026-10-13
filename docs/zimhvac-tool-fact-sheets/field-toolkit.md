# Field Toolkit: Fact Sheet

**Page:** `/field-toolkit`  |  **Roles with access:** `technician`, `contractor`, `org_admin`

## Purpose
One place for the paperwork of a job in the field: read an equipment nameplate, work through an installation or service checklist, record the installation and request a Certificate of Compliance (COC), log refrigerant used or recovered, and mark up photos.

## Who it's for
Registered technicians and contractors doing installations, re-gassing and service. Organization Admins can open it to review how technicians use it.

## The five tabs
The tab you are on is kept in the address (`?tab=`), so a link opens straight to it. The tab bar works with the arrow keys.

| Tab | What it does |
|---|---|
| **Scan** | Reads a nameplate photo: manufacturer, model, serial number and refrigerant. |
| **Checklist** | A tick-list for a new installation or for regassing and service. |
| **Installations** | Records an installation with photos, and requests the COC. |
| **Gas register** | Logs refrigerant charged, recovered or used on a leak repair. |
| **Photo notes** | Marks up a photo with numbered notes. Saved on this device only. |

## Scan (nameplate scanner)
1. Upload a clear photo of the plate, straight on, in good light, with no glare. Photos up to 10 MB are accepted. You can crop to the plate and rotate it.
2. The scanner reads the text, and also reads any barcode. A barcode is trusted over the printed serial when the two nearly match, and it is offered as a one-tap "Use as serial" suggestion when they do not.
3. The **manufacturer** is checked against a list of about 55 makers common on Zimbabwean sites (compressor, air conditioning and commercial refrigeration brands). A small misread such as "DAIKlN" is corrected to Daikin and the screen says so. If no maker is read, the whole plate text is searched for one. An unknown name is kept as read, with "Did you mean" buttons.
4. Every field shows a confidence check. A field the scanner is not sure of is outlined in amber and marked "check this". Editing a field yourself marks it as checked.
5. **Confirm and save scan** stores the result. **Use refrigerant** sends the refrigerant code to the Gas register, already filled in. Nothing is saved to the register until you press Save there.

## Checklist
- Two checklists: **New installation** (21 items in 5 groups) and **Regassing and service** (16 items in 4 groups).
- Installation groups: Pre-installation, Nitrogen inert gas brazing, Pressure test with dry nitrogen, Evacuation, Charging the system.
- Regassing groups: Pre-service assessment, Recovery, Vacuum and recharge, Post-service verification.
- Items cite their source where there is one, such as SANS 5001-1, SANS 10142-1, the F-gas rules or the Environmental Act. The links come from the Resources page.
- A progress bar shows how many items are ticked. **Save checklist** keeps the result so the Installations tab can attach it.

## Installations
- Record an installation with client name, site location, job type, floor space, job details and up to **10 photos**. Photos must be JPEG, PNG or WebP, up to 2 MB each and 8 MB in total.
- Client name, site location and job details are required.
- Summary tiles show Total, Pending review, COC pending and COC ready. You can filter the list by status.
- **Requesting a COC:** save the installation, then request the COC from its card. **Every checklist item must be ticked and the checklist saved first.** The request goes to an administrator with the checklist and photos attached.
- Administrators approve or reject COC requests. A rejection includes a reason. You are notified in the app when a request is decided.

## Gas register
- Three actions: **Charge**, **Recovery** and **Leak Repair**.
- Fields: refrigerant, amount in kg, client name, work location, job type, optional approved supplier, and the Pesepay transaction ID (needed for rewards).
- Link a **planner job** to fill in the client, site and job type for you. Only jobs that are not completed or cancelled are offered.
- Checks before saving: client name required, refrigerant required, amount greater than zero and not more than 10,000 kg.
- **Works offline.** A log is saved on the device first and sent when there is a connection. A banner shows the state: online, syncing, waiting to sync, or "logs the server refused". A refused log shows the reason and can be corrected or discarded. A log that only failed because the network was down stays queued and is retried.
- Each saved log can be downloaded as a PDF record. A log made with a supplier selected shows that supplier as verified.
- Voice commands can pre-fill this form. The form shows "Filled from your voice command. Check every field, then press Save." Nothing saves until you press Save.

## Photo notes
Add a photo, click it to place numbered markers with a label, enter a Job ID and save. These notes live only in this browser on this device. To keep a photo with a job, attach it on the Installations tab.

## Notifications
You are notified in the app when a COC request is approved or not approved.

## Good to know
- The scanner and the photo tools run in the browser. Nameplate text is read on the device, not sent to an outside AI service.
- The Gas register is the technician's own record of what was charged or recovered. Recovery totals feed the national recovery figures that the National Ozone Unit (NOU) reports on.
- A COC cannot be requested from an installation whose checklist is incomplete.

## Limits and cautions
- The scanner can misread. Check the model and serial against the plate before saving, especially fields marked "check this".
- The maker list is not complete. A maker that is not on it is kept exactly as read.
- Photo notes are not backed up. Clearing the browser's data removes them.
