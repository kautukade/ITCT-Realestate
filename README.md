# Yavatmal Property Connect — Frontend Demo

Professional multi-page responsive real-estate lead platform demo for a company-managed buyer/seller workflow.

## Pages
- index.html — homepage
- sell.html — seller property submission with photos/documents UI
- buy.html — buyer requirement form
- properties.html — public property showcase
- about.html — managed workflow
- contact.html — contact and enquiry

## Demo behavior
Forms store submitted text data in the browser's `localStorage` only. File inputs are represented by file names in demo storage; actual files are not uploaded anywhere.

## Production backend recommended
Use Supabase/Postgres with:
- Auth / OTP
- private Storage buckets for documents
- RLS policies
- seller_leads
- buyer_leads
- properties
- property_documents
- lead_matches
- site_visits
- employees
- followups
- commissions
- audit_logs

Important: sensitive property/identity documents must never be kept in public storage.
