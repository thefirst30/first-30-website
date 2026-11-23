# The First 30 free preview

GitHub Pages serves `/free-preview/` from this directory. Use the same page for invitations shared by guests. Its `ref` query parameter contains an opaque referral code. RSVPs and attribution are stored in the private **The First 30 · Free Preview RSVPs** spreadsheet.

## Enable submissions

1. In the RSVP spreadsheet, open **Extensions → Apps Script**. Paste in the contents of [Code.gs](Code.gs).
2. Deploy a **Web app** running as the spreadsheet owner. Set access to **Anyone** so guests can submit without signing in. Keep the spreadsheet itself private.
3. Set `rsvpEndpoint` in [index.html](index.html) to the deployment URL ending in `/exec`.
4. Test a fresh RSVP from the website, then open its copied referral link in a private window and submit a second test RSVP. Check that both rows exist and that the second row's **Referred by** matches the first row's **Referral code**. Delete the two test rows before sharing invitations.

The confirmation appears only after Google acknowledges the write. The sheet marks attending guests **To book** for manual entry in Bookamat. Sharing a link does not hold a separate seat.
