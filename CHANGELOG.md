# Changelog

What's new in FOIA Around, Find Out — the findings added, the requests tightened, and the plumbing fixed. Currently **52 findings** with ready-to-file requests across **20+ federal agencies**. Newest first.

## 2026-07-06 — Follow-up drafter + stronger boilerplate (first community suggestion!)

- A r/TheDreyDossier commenter pointed at **MuckRock's** preset request language — good call. Two lines from their open-source boilerplate are now in every FAFO letter:
  - the **public-dissemination sentence** ("the requested records will be made available to the general public…") — a fee-waiver factor the letters weren't asserting;
  - the **statutory-deadline line** citing the 20-business-day determination window (5 U.S.C. § 552(a)(6)(A)(i)), so the clock is anchored from day one.
- New **Follow up** drafter: agencies routinely blow the 20-day window, and the polite status-check letter is its own genre. Enter the agency, filing date, tracking number, and a one-line description — it drafts a MuckRock-style neutral follow-up (no boilerplate stack, since your original request already carried it). Works with the same email/portal routing as everything else.

## 2026-07-06 — Webform-ready output for portal-only agencies

- **Portal version**: for agencies that only take FOIA through a webform (FBI, DOJ, DHS, GSA, Interior, and the rest), the drafter now produces a paste-ready *request description* — no name/address header, no salutation, no signature — because the form collects those in its own fields. Pasting the full letter into a description box duplicated all of that; now it doesn't.
- **Fee waiver and expedited processing get their own paste boxes** when drafting for a portal, since portals ask for those justifications in separate form sections.
- **DOJ component routing**: FOIA STAR makes you pick a DOJ component before filing, and the wrong pick yields a "no records" answer that's a routing artifact. Every DOJ request now names its component up front — Office of Information Policy for AG/DAG-office records (the Epstein memo, the Bondi binders, the NSPM-7 designation list), Civil Rights Division for the state voter-data letters, U.S. Marshals Service for the Flock ALPR agreements, Criminal Division for the MKUltra investigation disposition.
- **FBI eFOIPA guidance** shown while drafting: one subject per submission, pick the records-about-a-topic request type, paste the portal version into the description box. (The portal's old 3,000-character cap was lifted in 2021; a live character count is shown anyway, with trim advice if a form complains.)
- "Download full letter .txt" keeps the complete formal letter for your records — useful if a portal fails and you fall back to mail.

## 2026-07-06 — NSPM-7 and the Department of Labor

- **Three new cards from More Perfect Union's surveillance report** (Daniel Boguslaw, with Ken Klippenstein and former DHS intelligence attorney Spencer Reynolds on record):
  - **DHS** — the strategy implementing NSPM-7, including the leaked language treating *"class-based or economic grievances"* as a terrorism indicator.
  - **FBI + DOJ** — the bureau-wide directive operationalizing NSPM-7 in field offices, and the domestic-organization designation list the Attorney General declined to confirm or deny before Congress.
  - **DOL-OIG** — the participation agreements putting the Department of Labor's Inspector General inside DHS task forces and FBI Joint Terrorism Task Forces.
- New agency: **Department of Labor OIG** — one of the shrinking set that still accepts FOIA by email.
- New entities for the dot-connector: NSPM-7, DOL, the Domestic Security Alliance Council, the Homeland Security Information Network, and Jonathan Berry (Project 2025 DOL chapter author, now DOL Solicitor).
- Investigator filter: added Ken Klippenstein.

## 2026-07-02 — Corroboration sweep and four heavyweight cards

- **Corroborated 14 existing cards against the Unlimited Hangout corpus** — 17 sources added so findings lean on documented investigative work, not just the original video/post.
- Four new cards: **Erebor Bank's OCC charter** (Palmer Luckey/Thiel-orbit bank), **CISA and the CTI League**, **Cybereason's "Operation Blackout" election simulations**, and the **bin Sulayem redaction**.
- New cards for **Epstein-linked CBP officers** and **Crane/Accurate Energetic Systems**; folded the ICE request into the Flock Safety card.
- New feature: **filter by investigator/outlet** — browse by who reported or corroborates each finding.

## 2026-06-28 – 06-30 — Network-state thread and agency verification

- New **Network state** thread: DFC money and Próspera/La Ceiba (More Perfect Union), **prosperity zones / "Blueprint for America"**, and the **Subic Bay AI industrial park**.
- Ian Carroll **press-freedom** cards.
- New feature: **entity dot-connector** — click any person/org/program to see every finding it touches. Plus the amber terminal theme.
- Verified every agency's actual submission method; fixed **Interior** (portal-only — emailed requests are rejected).

## 2026-06-19 – 06-21 — The big expansion and the narrowing standard

- Threads added: **Kirk assassination** (FBI tip-line preview site, EEOB visit records, DoD messaging claim), **Butler shooting**, **Elections & voting** (DHS SAVE database, DOJ state voter-data demands), **Israel / foreign influence** (US-Israel military integration, Check Point's federal footprint, FBI–ADL relationship), **Civil liberties**, plus Flock Safety's federal ALPR access, the Trump Jr. / Office of Strategic Capital loan, Mar-a-Lago FBI tip records (two on-record survivors), and the Dialog society / Feinberg conflict-of-interest cluster.
- **The narrowing sweep**: every request converted to ask for *specific named instruments* — the agreement, the MOU, the SOW, the records schedule, the PIA — never "all records about X." This is the single biggest lever on whether a request gets processed or soft-denied as overbroad, and it's now the house standard for every new card.
- Plumbing: **Open in Gmail** button (with account-matching), per-agency email/portal indicators, Secret Service and DHS portal-only routing.

## 2026-06-18 — v1

- Launched: an investigation-driven FOIA request generator. Pick a credited finding by an independent investigator; it drafts a properly-scoped request with fee waiver, segregability, and no-records confirmation language built in — you review and file.
- Founding threads: the **National Design Studio** takeover cards (tracking scripts, missing privacy paperwork, vote.gov preview, USADF security contact, Gebbia ethics disclosures) from The Drey Dossier's investigation, and the **Epstein/DOJ** records cluster.
- Client-side only, no tracking, CC0.
