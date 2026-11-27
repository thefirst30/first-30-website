# The First 30 free preview

GitHub Pages serves `/free-preview/` from this directory. Use the same page for invitations shared by guests. Its `ref` query parameter contains an opaque referral code. RSVPs and attribution are stored in the private **The First 30 · Free Preview RSVPs** spreadsheet.

## Enable submissions

1. In the RSVP spreadsheet, open **Extensions → Apps Script**. Paste in the contents of [Code.gs](Code.gs).
2. Deploy a **Web app** running as the spreadsheet owner. Set access to **Anyone** so guests can submit without signing in. Keep the spreadsheet itself private.
3. Set `rsvpEndpoint` in [index.html](index.html) to the deployment URL ending in `/exec`.
4. Test a fresh RSVP from the website, then open its copied referral link in a private window and submit a second test RSVP. Check that both rows exist and that the second row's **Referred by** matches the first row's **Referral code**. Delete the two test rows before sharing invitations.

The confirmation appears only after Google acknowledges the write. The sheet marks attending guests **To book** for manual entry in Bookamat. Sharing a link does not hold a separate seat.

## Complimentary January pass update

The homepage uses the same endpoint and existing spreadsheet columns. The RSVP column distinguishes `attend` (9 December; Bookamat status `To book`), `january` (one complimentary January session; Bookamat status `January pass — to arrange`), and `updates` (newsletter; no booking). Marketing consent is optional and separate for both complimentary session choices. Newsletter signup records consent because that is the requested action.

To enable the January option in production, open the existing Apps Script project from the RSVP sheet, replace its script with the current [Code.gs](Code.gs), save, then choose **Deploy → Manage deployments → Edit** for the existing web app, select **New version**, and deploy. Retain the existing deployment URL and anonymous access. Verify a synthetic January request and newsletter signup in the RSVP sheet; do not treat the January request as a December booking. If the old web app is still deployed it will reject `january`; the homepage will show an error and an email fallback rather than a false confirmation.
