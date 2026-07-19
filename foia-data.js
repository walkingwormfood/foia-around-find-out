/* FOIA Around, Find Out — data
 * Pure data, no dependencies. Drives index.html.
 * Model: investigations[] (a credited finding + the narrow FOIA requests it motivates), tagged by category/thread.
 * NARROW BY DEFAULT — ask for specific named instruments (agreements/MOUs/SOWs/detail orders/records schedules/PIAs),
 * NOT "all documents/communications", and disclaim the email search. Broad requests get soft-denied as overbroad.
 * The human reviews and submits via email or the agency portal. Placeholders: {{NAME}} {{EMAIL}} {{ADDRESS}} {{DATE}}
 */
const FOIA = {
  meta: {
    product: "FOIA Around, Find Out",
    tagline: "Independent investigators found these things in public records. A FOIA request makes the government hand over the official paperwork that would prove it. Pick a finding — we'll draft the request.",
    statute: "Freedom of Information Act, 5 U.S.C. § 552",
    portal: "https://www.foia.gov",
    submit_note: "Two ways to file. Email is fastest — it opens a message already addressed and written, so you just review and send — but a growing number of agencies have stopped accepting FOIA by email (DHS ended it in January 2026) and now require their own portal. So email is offered below only where it still works (look for the ✉ on a request); everything else copies the letter and opens that agency's portal (↗). The federal portal at FOIA.gov also works, but it's a maze of forms and click-throughs that just drops you on a landing page with no sense of the process.",
    narrowing_note: "Each request is deliberately narrow — a specific named instrument (an agreement, MOU, detail order, records schedule, disclosure), specific subjects, and a date range, with the burdensome email search disclaimed. Broad requests (\"all records about X\") are routinely denied as overbroad; narrow ones get answered. Edit before sending if you want to tighten further.",
    do_not: "This tool only drafts a letter — it submits nothing and collects nothing you type. Don't fire identical mass copies at one office; agencies deprioritize duplicates. Pick the angle that fits you."
  },

  boilerplate: {
    burden_carveout:
      "To minimize processing burden, I am not requesting classified information, sensitive security or " +
      "law-enforcement methodologies, or private personal information unrelated to official government business. " +
      "This request seeks records of official government activity only.",
    fee_waiver:
      "Fee waiver: I request a waiver of all fees under 5 U.S.C. § 552(a)(4)(A)(iii). Disclosure meets each factor of the " +
      "public-interest standard: (1) the subject specifically concerns the identifiable government operations, programs, or " +
      "investigations described in this request; (2) disclosure is meaningfully informative about those operations and how " +
      "they are conducted; (3) it will contribute to public understanding at large, not merely my own, because I will make " +
      "the records available to the general public; and (4) it is likely to contribute significantly to public understanding " +
      "of how federal authority is exercised and how government programs and investigations are authorized and conducted. " +
      "This request is not in my commercial interest and is not made for a commercial purpose. If a fee waiver is denied, " +
      "please notify me before incurring any costs over $25.",
    deadline:
      "I look forward to your determination on this request within the 20 business days provided by " +
      "5 U.S.C. § 552(a)(6)(A)(i).",
    expedited:
      "Expedited processing: I request expedited processing under 5 U.S.C. § 552(a)(6)(E) on two grounds. " +
      "(1) There is an urgency to inform the public about actual or alleged federal government activity, and I am a " +
      "person primarily engaged in disseminating information: I publish the government records I obtain through a " +
      "public records docket available to the general public. (2) This request concerns a matter of widespread and " +
      "exceptional media interest in which there exist possible questions about the government\u2019s integrity that " +
      "affect public confidence. I certify that the foregoing is true and correct to the best of my knowledge and belief.",
    segregability:
      "If any portion of a responsive record is withheld, please cite the specific FOIA exemption claimed and release " +
      "all reasonably segregable non-exempt portions, as required by 5 U.S.C. § 552(b).",
    no_records:
      "If no responsive records exist, I request written confirmation of that fact, including a description of the " +
      "search conducted.",
    format:
      "Please provide responsive records in electronic format (searchable PDF or native file) by email where possible.",
    closing:
      "Please confirm receipt and provide a tracking number. I am happy to clarify or reasonably narrow this request " +
      "if that would speed processing.\n\nSincerely,\n{{NAME}}\n{{EMAIL}}"
  },

  /* Agencies referenced by investigations. email: null => portal-only (deep-link + copy). */
  agencies: [
    { id: "state", name: "U.S. Department of State", email: "FOIARequest@state.gov", emailSubject: "Freedom of Information Act/Privacy Act Request",
      portal: "https://foia.state.gov/Request/Submit.aspx",
      submitNote: "State accepts FOIA by email (FOIARequest@state.gov), its PAL portal, mail, or fax (202-485-1669). The subject line MUST read \"Freedom of Information Act/Privacy Act Request\"." },
    { id: "nara", name: "National Archives and Records Administration", email: "foia@nara.gov",
      portal: "https://www.archives.gov/foia/foia-request.html",
      submitNote: "NARA accepts FOIA by email, mail, or fax." },
    { id: "gsa", name: "U.S. General Services Administration", email: null,
      portal: "https://www.foia.gov/",
      submitNote: "GSA gives three doors, each with a catch. (1) PAL — its own portal (securefoia.gsa.gov), direct and tracked, but it REQUIRES a login.gov sign-in — yes, you must authenticate through login.gov to FOIA about login.gov. The account is reusable across other agencies' FOIA portals, so it's a one-time cost if you file a lot. (2) FOIA.gov — the federal public form, no login.gov required, but a clunkier multi-step maze; pick General Services Administration there. (3) Mail — no login, no portal: FOIA Requester Service Center (LG), 1800 F St NW, Rm 7308, Washington DC 20405. gsa.foia@gsa.gov is inquiries only, not submission. (Checked July 2026.)",
      portalNote: "This button opens FOIA.gov (no login.gov required) — pick General Services Administration, paste the portal version into the description box, and use the paste boxes below for the fee-waiver and expedited justifications. It's multi-step but account-free. (GSA's own PAL portal, securefoia.gsa.gov, is more direct but gatekeeps behind a login.gov sign-in — see the note; or mail the full letter to the address there.) GSA correspondence comes from foia@foiaxpress.gsa.gov — safelist it." },
    { id: "eac", name: "U.S. Election Assistance Commission", email: "sparsons@eac.gov",
      portal: "https://www.eac.gov/foia/freedom-information-act-foia",
      submitNote: "EAC accepts FOIA by email, mail, or fax. Email goes to the FOIA officer, Seton Parsons, Associate Counsel (sparsons@eac.gov); no special subject line required. Mail: 633 3rd St NW, Suite 200, Washington DC 20001 · fax 301-734-3108." },
    { id: "omb", name: "Office of Management and Budget", email: "OMBFOIA@omb.eop.gov",
      portal: "https://www.foia.gov",
      submitNote: "OMB accepts FOIA by email." },
    { id: "usadf", name: "U.S. African Development Foundation", email: "info@usadf.gov", emailSubject: "Freedom of Information Act Request",
      portal: "https://www.usadf.gov/contact-us",
      submitNote: "USADF accepts FOIA by email — mark the subject line \"Freedom of Information Act Request\"." },
    { id: "oge", name: "U.S. Office of Government Ethics", email: "usoge@oge.gov",
      portal: "https://www.oge.gov",
      submitNote: "OGE accepts FOIA by email." },
    { id: "doj", name: "U.S. Department of Justice", email: null,
      portal: "https://doj-foia.entellitrak.com/etk-doj-foia-prod/login.request.do",
      submitNote: "This button opens FOIA STAR directly — DOJ's portal for the eight leadership offices (OAG, ODAG, Associate AG, Legislative Affairs, Pardon Attorney, Public Affairs, Legal Policy, OIP). First visit: hover Account Management \u2192 Register. One account files every OIP-routed request on this site and shows live status. No email intake.",
      portalNote: "Two ways in: register an account on FOIA STAR (doj-foia.entellitrak.com → Account Management → Register), or skip registration entirely and file through FOIA.gov (select Department of Justice → the component) — per DOJ's own privacy assessment, FOIA.gov submissions transmit into FOIA STAR automatically. KNOW THE SPLIT: OIP/FOIA STAR only processes EIGHT leadership offices — Attorney General, Deputy AG, Associate AG, Legislative Affairs, Pardon Attorney, Public Affairs, Legal Policy, Information Policy. Requests aimed at the AG's or Deputy AG's records (Bondi memos/binders, Blanche interview records, NSPM-7 designation) belong exactly there; one FOIA STAR account files them all and shows live status. Any other component — National Security Division (FARA unit), U.S. Marshals, Criminal Division — has its OWN intake and OIP will punt you: file at the component directly (FOIA.gov's component picker reaches them too). Either way you pick a DOJ component first — use the component named on this request; the wrong pick gets a \"no records\" answer that's a routing artifact, not a real absence. The form collects your name, address, and fee preference in its own fields; a DOJ-361 identity form is only needed for records about a person." },
    { id: "usms", name: "U.S. Marshals Service (DOJ component)", email: null,
      portal: "https://www.foia.gov/",
      submitNote: "USMS runs its own FOIA shop — OIP/FOIA STAR will punt this. File through FOIA.gov: pick Department of Justice \u2192 U.S. Marshals Service and paste the letter into the description box.",
      portalNote: "On FOIA.gov select Department of Justice, then the U.S. Marshals Service component. Fee-waiver and expedited justifications go in the paste boxes below." },
    { id: "doj-crt", name: "DOJ Civil Rights Division", email: null,
      portal: "https://www.foia.gov/",
      submitNote: "The Civil Rights Division has its own FOIA intake — OIP/FOIA STAR will punt this. File through FOIA.gov: Department of Justice \u2192 Civil Rights Division.",
      portalNote: "On FOIA.gov select Department of Justice, then Civil Rights Division. Name the Voting Section in the request text so it routes internally." },
    { id: "doj-crm", name: "DOJ Criminal Division", email: null,
      portal: "https://www.foia.gov/",
      submitNote: "The Criminal Division has its own FOIA intake — OIP/FOIA STAR will punt this. File through FOIA.gov: Department of Justice \u2192 Criminal Division.",
      portalNote: "On FOIA.gov select Department of Justice, then Criminal Division." },
    { id: "atfagency", name: "Bureau of Alcohol, Tobacco, Firearms and Explosives", email: null,
      portal: "https://www.foia.gov/",
      submitNote: "ATF FOIA routes through FOIA.gov (select Department of Justice → Bureau of Alcohol, Tobacco, Firearms and Explosives) or ATF's own eFOIA channels. Direct-email intake unverified — file via the portal. Expect 7(A) claims while the related prosecution is pending; the written denial still fixes what records exist." },
    { id: "fbi", name: "Federal Bureau of Investigation", email: null,
      portal: "https://efoia.fbi.gov",
      submitNote: "FBI takes FOIA only through its eFOIPA portal (efoia.fbi.gov); its email address is for questions only.",
      portalNote: "eFOIPA works best as one subject per submission — don't combine requests. The link lands on the eFOIPA home page: click through the agreement step to reach the form (it's an interactive app behind reCAPTCHA, so there's no deep link and no scripted filing — a human clicks it through). Choose the request type for records about a topic/organization (not about yourself), and paste the portal version into the request-description box; the form collects your name, address, and fee preference in its own fields." },
    { id: "treasury", name: "U.S. Department of the Treasury", email: "FOIA@treasury.gov",
      portal: "https://foia.treasury.gov",
      submitNote: "Treasury accepts FOIA by email (FOIA@treasury.gov), its portal (foia.treasury.gov), FOIA.gov, or mail. For a specific bureau, you may route directly through the portal." },
    { id: "dod", name: "U.S. Department of Defense", email: null,
      portal: "https://www.foia.gov",
      submitNote: "DoD routes FOIA by component — via FOIA.gov, select Office of the Secretary of Defense/Joint Staff for OSD officials, or the Department of the Army." },
    { id: "usss", name: "U.S. Secret Service", email: null,
      portal: "https://www.securerelease.us",
      submitNote: "As of Oct 2025, USSS takes FOIA only through its SecureRelease portal (securerelease.us) or by mail — no email." },
    { id: "dhs", name: "U.S. Department of Homeland Security", email: null,
      portal: "https://www.dhs.gov/foia",
      submitNote: "As of Jan 22, 2026, DHS no longer accepts emailed or mailed FOIA requests — submit only via FOIA.gov or the SecureRelease portal (HQ/CBP/FEMA/ICE/TSA/USCG/USSS); USCIS via its online account.",
      portalNote: "SecureRelease asks you to pick the DHS component before anything else — use the component named on this request." },
    { id: "odni", name: "Office of the Director of National Intelligence", email: "DNI-FOIA@dni.gov",
      portal: "https://www.dni.gov/index.php/foia",
      submitNote: "ODNI accepts FOIA by email (DNI-FOIA@dni.gov) or by mail — no online portal." },
    { id: "cia", name: "Central Intelligence Agency", email: null,
      portal: "https://www.foia.cia.gov/foia_request/form",
      submitNote: "CIA takes FOIA through its online request form (foia.cia.gov) or by mail (Information and Privacy Coordinator, Central Intelligence Agency, Washington, DC 20505) — no email submission." },
    { id: "dfc", name: "U.S. International Development Finance Corporation", email: "FOIA@dfc.gov",
      portal: "https://www.foia.gov",
      submitNote: "DFC accepts FOIA by email (FOIA@dfc.gov) or mail (FOIA Director (Legal), 1100 New York Ave NW, Washington DC 20527). Include your name, contact, a description of the records, and a fee authorization." },
    { id: "interior", name: "U.S. Department of the Interior", email: null,
      portal: "https://securefoia.doi.gov",
      submitNote: "Interior takes FOIA ONLY electronically — via its FOIAXpress Public Access Link (securefoia.doi.gov) or FOIA.gov; emailed requests are rejected. Public-lands records route to the Bureau of Land Management (BLM), which is also electronic-only.",
      portalNote: "The portal requires a login.gov account, and after sign-in it drops you on a welcome page — use \"Submit Request\" in the top menu. Walk the form top to bottom: Action Office = the office named on this request; Request Type = FOIA (not Privacy); Date Range fields = the window stated in the request text; Description = the portal version below. Fee section: UNCHECK \"Willing to Pay All Fees\", enter 25 in \"Willing to Pay Up To\", check \"Fee Waiver Requested\", and paste the fee-waiver text into \"Fee Waiver Request Reason\" (DOI won't charge under $50 regardless, and contacts you before exceeding your number). Expedite: checking the box certifies your reason is true — paste the expedited text into \"Expedite Reason\". Leave Park/Refuge/Site/Location blank." },
    { id: "navsea", name: "U.S. Navy — Naval Sea Systems Command (NAVSEA)", email: "NAVSEAFOIA@navy.mil",
      portal: "https://www.securerelease.us",
      submitNote: "NAVSEA — the parent command of NSWC Crane — accepts FOIA by email (NAVSEAFOIA@navy.mil), the SecureRelease portal (securerelease.us), FOIA.gov, or mail (Commander, NAVSEA, SEA 00A5, FOIA/Privacy Program Division, 1333 Isaac Hull Ave SE, Washington Navy Yard, DC 20376-2101). Requester Service Center: 202-781-4124." },
    { id: "epa", name: "U.S. Environmental Protection Agency", email: null,
      portal: "https://www.epa.gov/foia",
      submitNote: "EPA takes FOIA electronically — via its FOIAXpress public access link (epa.gov/foia) or FOIA.gov — or by mail to the National FOIA Office. FOIAonline is retired; email submission is not offered." },
    { id: "occ", name: "Office of the Comptroller of the Currency", email: null,
      portal: "https://foia-pal.occ.gov/",
      submitNote: "The OCC takes FOIA through its Public Access Link portal (foia-pal.occ.gov) or FOIA.gov — all requests should be submitted online. FOIA-PA@occ.treas.gov is for questions, not submission. Mail (Privacy Act or correspondence): Manager, Disclosure Services & FOIA Officer, Communications Division, OCC, Suite 3E-218, Washington DC 20219." },
    { id: "cisa", name: "Cybersecurity and Infrastructure Security Agency (DHS)", email: null,
      portal: "https://www.securerelease.us",
      submitNote: "CISA is a DHS component. As of Jan 22, 2026, DHS no longer accepts emailed or mailed FOIA — submit via the SecureRelease portal (securerelease.us; select DHS Headquarters, which covers CISA) or FOIA.gov. Questions only: CISAFOIA@hq.dhs.gov." },
    { id: "dol-oig", name: "U.S. Department of Labor — Office of Inspector General", email: "FOIA.PrivacyAct@oig.dol.gov",
      portal: "https://www.dol.gov/general/foia/submit",
      submitNote: "DOL-OIG accepts FOIA by email (FOIA.PrivacyAct@oig.dol.gov; the department-wide FOIArequests@dol.gov also routes to OIG), DOL's Public Access Link portal, FOIA.gov (select Department of Labor → Office of Inspector General), or mail (Disclosure Officer, Office of Inspector General, U.S. Department of Labor, 200 Constitution Ave NW, Room S-5506, Washington DC 20210)." },
    { id: "doj-nsd", name: "DOJ National Security Division (FARA Unit)", email: "nsdfoia@usdoj.gov",
      portal: "https://www.foia.gov/",
      submitNote: "NSD runs its own FOIA intake — OIP/FOIA STAR will punt this. Email works (nsdfoia@usdoj.gov), or file via FOIA.gov: Department of Justice → National Security Division. Before FOIAing, remember the FARA registration statements, supplementals, and exhibits themselves are already public — search efile.fara.gov first; FOIA is for what the public database doesn't show (unit correspondence, review files, advisory opinions). Checked July 2026." },
    { id: "dea", name: "Drug Enforcement Administration (DOJ component)", email: "DEA.FOIA@dea.gov",
      portal: "https://www.dea.gov/foia/requesting-foia-records",
      submitNote: "DEA prefers its FOIA Public Access Link (PAL) portal — the linked page walks through registration — but still accepts email (DEA.FOIA@dea.gov), just with slower processing. Requester Service Center: (571) 776-2300. Checked July 2026." },
    { id: "faa", name: "Federal Aviation Administration", email: "7-AWA-ARC-FOIA@faa.gov",
      portal: "https://www.faa.gov/foia",
      submitNote: "FAA's National FOIA Office accepts email (7-AWA-ARC-FOIA@faa.gov) or electronic submission from the FAA FOIA page. FAA is a DOT component, so FOIA.gov (Department of Transportation → Federal Aviation Administration) also works. Checked July 2026." }
  ],

  /* Entities the investigations reference — the connective tissue across categories.
   * type: person | org | company | program | place | country.
   * Investigations link to these by id. The investigator (who REPORTED a finding) is deliberately NOT an entity. */
  entities: [
    { id: "nds", name: "National Design Studio", type: "org" },
    { id: "eop", name: "Executive Office of the President", type: "org" },
    { id: "state-dept", name: "U.S. Department of State", type: "org" },
    { id: "passports-gov", name: "passports.gov", type: "program" },
    { id: "login-gov", name: "login.gov", type: "program" },
    { id: "vote-gov", name: "vote.gov", type: "program" },
    { id: "trumprx-gov", name: "trumprx.gov", type: "program" },
    { id: "save-system", name: "SAVE System", type: "program" },
    { id: "greg-hogan", name: "Greg Hogan", type: "person" },
    { id: "eac", name: "U.S. Election Assistance Commission", type: "org" },
    { id: "doj", name: "U.S. Department of Justice", type: "org" },
    { id: "fbi", name: "Federal Bureau of Investigation", type: "org" },
    { id: "atf", name: "ATF", type: "org" },
    { id: "dod", name: "U.S. Department of Defense", type: "org" },
    { id: "dhs", name: "U.S. Department of Homeland Security", type: "org" },
    { id: "treasury", name: "U.S. Department of the Treasury", type: "org" },
    { id: "gsa", name: "U.S. General Services Administration", type: "org" },
    { id: "odni", name: "Office of the Director of National Intelligence", type: "org" },
    { id: "usadf", name: "U.S. African Development Foundation", type: "org" },
    { id: "posthog", name: "PostHog", type: "company" },
    { id: "tesla", name: "Tesla", type: "company" },
    { id: "palantir", name: "Palantir", type: "company" },
    { id: "cerberus", name: "Cerberus Capital Management", type: "company" },
    { id: "flock", name: "Flock Safety", type: "company" },
    { id: "check-point", name: "Check Point", type: "company" },
    { id: "dialog-society", name: "Dialog society", type: "org" },
    { id: "unit-8200", name: "Unit 8200", type: "org" },
    { id: "adl", name: "Anti-Defamation League", type: "org" },
    { id: "betar", name: "Betar US", type: "org" },
    { id: "ice", name: "U.S. Immigration and Customs Enforcement", type: "org" },
    { id: "washington-post", name: "The Washington Post", type: "org" },
    { id: "gebbia", name: "Joe Gebbia", type: "person" },
    { id: "epstein", name: "Jeffrey Epstein", type: "person" },
    { id: "maxwell", name: "Ghislaine Maxwell", type: "person" },
    { id: "blanche", name: "Todd Blanche", type: "person" },
    { id: "bondi", name: "Pam Bondi", type: "person" },
    { id: "thiel", name: "Peter Thiel", type: "person" },
    { id: "bessent", name: "Scott Bessent", type: "person" },
    { id: "hoffman", name: "Auren Hoffman", type: "person" },
    { id: "driscoll", name: "Dan Driscoll", type: "person" },
    { id: "lonsdale", name: "Joe Lonsdale", type: "person" },
    { id: "feinberg", name: "Stephen Feinberg", type: "person" },
    { id: "hansell", name: "Bradley Hansell", type: "person" },
    { id: "charlie-kirk", name: "Charlie Kirk", type: "person" },
    { id: "graham-allen", name: "Graham Allen", type: "person" },
    { id: "erika-kirk", name: "Erika Kirk", type: "person" },
    { id: "kolvet", name: "Andrew Kolvet", type: "person" },
    { id: "kash-patel", name: "Kash Patel", type: "person" },
    { id: "crooks", name: "Thomas Matthew Crooks", type: "person" },
    { id: "trump", name: "Donald Trump", type: "person" },
    { id: "trump-jr", name: "Donald Trump Jr.", type: "person" },
    { id: "bongino", name: "Dan Bongino", type: "person" },
    { id: "netanyahu", name: "Benjamin Netanyahu", type: "person" },
    { id: "tom-cotton", name: "Tom Cotton", type: "person" },
    { id: "shlomo-kramer", name: "Shlomo Kramer", type: "person" },
    { id: "leo-terrell", name: "Leo Terrell", type: "person" },
    { id: "fort-huachuca", name: "Fort Huachuca", type: "place" },
    { id: "mar-a-lago", name: "Mar-a-Lago", type: "place" },
    { id: "israel", name: "Israel", type: "country" },
    { id: "iran", name: "Iran", type: "country" },
    { id: "dfc", name: "U.S. International Development Finance Corporation", type: "org" },
    { id: "ben-black", name: "Ben Black", type: "person" },
    { id: "prospera", name: "Próspera (Honduras charter city)", type: "program" },
    { id: "prosperity-zones", name: "Prosperity zones / Blueprint for America", type: "program" },
    { id: "new-american-industrial-alliance", name: "New American Industrial Alliance", type: "org" },
    { id: "subic-bay", name: "Subic Bay AI industrial park", type: "place" },
    { id: "philippines", name: "Philippines", type: "country" },
    { id: "cbp", name: "U.S. Customs and Border Protection", type: "org" },
    { id: "aes", name: "Accurate Energetic Systems (AES)", type: "company" },
    { id: "nswc-crane", name: "NSWC Crane Division", type: "org" },
    { id: "occ", name: "Office of the Comptroller of the Currency", type: "org" },
    { id: "cisa", name: "Cybersecurity and Infrastructure Security Agency", type: "org" },
    { id: "usss", name: "U.S. Secret Service", type: "org" },
    { id: "erebor", name: "Erebor Bank", type: "company" },
    { id: "jonathan-gould", name: "Jonathan Gould", type: "person" },
    { id: "palmer-luckey", name: "Palmer Luckey", type: "person" },
    { id: "cti-league", name: "CTI League", type: "org" },
    { id: "ohad-zaidenberg", name: "Ohad Zaidenberg", type: "person" },
    { id: "chris-krebs", name: "Chris Krebs", type: "person" },
    { id: "cybereason", name: "Cybereason", type: "company" },
    { id: "bin-sulayem", name: "Sultan Ahmed bin Sulayem", type: "person" },
    { id: "massie", name: "Thomas Massie", type: "person" },
    { id: "ro-khanna", name: "Rep. Ro Khanna", type: "person" },
    { id: "cia", name: "Central Intelligence Agency", type: "org" },
    { id: "mkultra", name: "Project MKUltra", type: "program" },
    { id: "luna", name: "Anna Paulina Luna", type: "person" },
    { id: "capitol-police", name: "U.S. Capitol Police", type: "org" },
    { id: "task-force-orange", name: "Task Force Orange (Intelligence Support Activity)", type: "org" },
    { id: "eip", name: "Election Integrity Partnership", type: "program" },
    { id: "cis", name: "Center for Internet Security", type: "org" },
    { id: "us-israel-dtci", name: "U.S.-Israel Defense Technology Cooperation Initiative", type: "program" },
    { id: "nspm-7", name: "NSPM-7 (National Security Presidential Memorandum 7)", type: "program" },
    { id: "dol", name: "U.S. Department of Labor", type: "org" },
    { id: "dsac", name: "Domestic Security Alliance Council", type: "org" },
    { id: "hsin", name: "Homeland Security Information Network", type: "program" },
    { id: "jonathan-berry", name: "Jonathan Berry", type: "person" },
    { id: "frbny", name: "Federal Reserve Bank of New York", type: "org" },
    { id: "ofac", name: "Office of Foreign Assets Control (Treasury)", type: "org" },
    { id: "usaid", name: "USAID (dissolved 2025, folded into State)", type: "org" },
    { id: "greg-brown", name: "Greg Brown / Global Cast Partners LLC", type: "person" },
    { id: "venezuela", name: "Venezuela", type: "country" },
    { id: "iraq", name: "Iraq", type: "country" },
    { id: "libya", name: "Libya", type: "country" },
    { id: "cuba", name: "Cuba", type: "country" },
    { id: "ukraine", name: "Ukraine", type: "country" },
  ],

  investigations: [
    {
      id: "khanna-westbank-detention",
      categories: ["Israel / foreign influence", "Civil liberties"],
      entities: ["ro-khanna", "israel", "state-dept"],
      investigator: "Ro Khanna (firsthand) · wire reporting",
      investigatorLinks: [
        { label: "Sabby Sabs — breaking coverage with Khanna's own footage", url: "https://www.youtube.com/watch?v=HFp3DgGnRkU" },
        { label: "John Kiriakou — adds Khanna's \"total impunity\" statement", url: "https://www.youtube.com/watch?v=ZVJVEy0Zu80" },
        { label: "Khanna firsthand (TYT) — he notified State via consular services + had the DCM's number; Huckabee denies it", url: "https://www.youtube.com/watch?v=DW421oEY2AY" }
      ],
      status: "reported",
      finding: "Rep. Ro Khanna says he and his delegation — Americans, with video rolling — were detained for over an hour by armed Israeli settlers carrying U.S.-made M4 rifles while touring Zanuta, a southern West Bank village destroyed in settler attacks, and that when the IDF arrived it sided with the settlers and continued the detention. The Israeli military's statement says the opposite: troops \"dispersed the Israeli civilians and allowed the vehicles to continue on their way.\" Both cannot be true.",
      implication: "A congressional delegation detained abroad generates federal paper in real time: the delegation's translator told the settlers the American embassy was concerned, which means the embassy knew during the incident. Embassy Jerusalem's contemporaneous cables and incident reporting, Diplomatic Security's incident file, and any protest or demarche to the Israeli government are discrete, dated records — and they will support one of the two conflicting accounts. Khanna, publicly weighing a 2028 run, says: \"You'll be hearing from me soon.\"",
      sources: [
        { label: "Khanna's public statement and footage (via X, aired in coverage)", url: "" },
        { label: "Reuters report incl. the Israeli military statement", url: "" }
      ],
      requests: [
        {
          agencyId: "state",
          summary: "State — Embassy Jerusalem's real-time incident reporting + the Diplomatic Security file",
          subject: "FOIA Request: records concerning the detention of a congressional delegation near Zanuta, West Bank, July 2026",
          records: "I request: (1) cables, situation reports, spot reports, or incident reports authored or received by U.S. Embassy Jerusalem or the U.S. Office of Palestinian Affairs, dated July 1 through July 31, 2026, concerning the detention, obstruction, or delay of a delegation including Representative Ro Khanna near the village of Zanuta in the southern West Bank; (2) any Bureau of Diplomatic Security incident report or after-action record concerning that event; and (3) records of real-time communications between Department or embassy personnel and the delegation, its escorts, or Israeli authorities during the incident. To keep this request narrow, I am not seeking general country-condition reporting — records concerning this incident only.",
          ask_no_records: true,
          filed: "PENDING — filed by email to FOIARequest@state.gov (State's required subject format) Jul 16, 2026 and re-sent Jul 18, 2026; both confirmed in the sent-mail record. No State acknowledgment yet (State FOIA/PAL acks lag)."
        },
        {
          agencyId: "state",
          summary: "State — the diplomatic follow-through: any protest, demarche, or press guidance",
          subject: "FOIA Request: communications with the Government of Israel concerning the July 2026 detention of a congressional delegation",
          records: "I request, for July 1 through August 31, 2026: (1) any demarche, protest note, talking points, or record of communication between the Department of State (including U.S. Embassy Jerusalem) and the Government of Israel concerning the detention of a delegation including Representative Ro Khanna by Israeli civilians and/or Israel Defense Forces personnel near Zanuta in the southern West Bank; and (2) any press guidance or briefing material prepared for the Department spokesperson concerning that incident. If the Department made no protest and prepared no guidance, I request written confirmation of that fact.",
          ask_no_records: true,
          filed: "PENDING — filed by email to FOIARequest@state.gov (State's required subject format) Jul 16, 2026 and re-sent Jul 18, 2026; both confirmed in the sent-mail record. No State acknowledgment yet."
        },
        {
          agencyId: "state",
          summary: "State — the pre-trip notification Khanna says he gave (consular services + the DCM), which Huckabee denies",
          subject: "FOIA Request: consular/embassy notification records for the July 2026 congressional delegation visit to the West Bank",
          records: "Rep. Khanna states he notified the Department in advance through consular services and had the direct contact of the Deputy Chief of Mission at U.S. Embassy Jerusalem; Ambassador Huckabee has stated the delegation did not notify the embassy. This request seeks the records that resolve that dispute. I request, for June 1 through July 31, 2026: (1) any consular notification, member-travel or congressional-delegation (CODEL) travel-notification, or country-clearance record concerning the visit of a delegation including Representative Ro Khanna to the West Bank; and (2) any communication to or from the office of the Deputy Chief of Mission at U.S. Embassy Jerusalem concerning that visit, including any advance notice of the delegation's travel. I am requesting the notification and DCM-office records for this one visit; I am not seeking general email correspondence beyond the records described.",
          ask_no_records: true,
          filed: "PENDING — filed by email to FOIARequest@state.gov Jul 18, 2026 (this request was reworked earlier that day from Khanna's TYT interview); confirmed in the sent-mail record. No State acknowledgment yet."
        }
      ]
    },
    {
      id: "dfc-ben-black-prospera",
      categories: ["Network state", "Conflict of interest"],
      entities: ["dfc", "ben-black", "prospera", "thiel"],
      investigator: "More Perfect Union",
      investigatorLinks: [
        { label: "\"Peter Thiel's Plan To Replace Democracy\"", url: "https://www.youtube.com/watch?v=6iLf2h_fo-w" }
      ],
      status: "reported",
      finding: "More Perfect Union reports that the U.S. International Development Finance Corporation (DFC) — the federal agency that invests tax dollars in private projects abroad, led by Ben Black (whom the report ties to Jeffrey Epstein) — is being lobbied for re-funding, and that Black traveled to Honduras promising investment in real estate and technology including La Ceiba, a city slated to be absorbed by Próspera, the Thiel/Pronomos-backed for-profit charter city.",
      implication: "A federal financing agency steering public money toward a privatized \"network state\" project its own leadership has personally promoted raises core conflict-of-interest and ethics questions. The DFC's Honduras investment commitments, and the agency head's financial-disclosure and recusal records, are exactly what federal ethics filings and agency records exist to surface. (Black's Epstein tie, his DFC role, and the La Ceiba plans are MPU's reporting; Próspera's Pronomos/Thiel backing and its ZEDE legal history are independently documented by Unlimited Hangout's City-States investigation. This request tests the DFC-specific claims against the record.)",
      sources: [
        { label: "More Perfect Union — Peter Thiel's Plan To Replace Democracy", url: "https://www.youtube.com/watch?v=6iLf2h_fo-w" },
        { label: "Unlimited Hangout — City-States Without Limits, Part 1", url: "https://unlimitedhangout.com/2025/10/investigative-reports/city-states-without-limits-part-1/" }
      ],
      requests: [
        {
          agencyId: "oge",
          summary: "OGE — Ben Black's financial disclosure + any ethics/recusal re Próspera/Pronomos",
          subject: "FOIA Request: OGE Form 278e and ethics/recusal records for DFC head Ben Black",
          records: "I request a copy of the OGE Form 278e public financial disclosure report filed by Ben Black in connection with his leadership of the U.S. International Development Finance Corporation, together with any ethics agreement, recusal statement, or authorization to participate concerning his interests in or dealings with Próspera, Pronomos Capital, or charter-city / \"network state\" ventures, dated from January 1, 2025 to the date this request is processed.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 2, 2026 by email to usoge@oge.gov; no acknowledgment yet. (OGE's Gebbia response routes 278e's to the Ethics in Government Act special-access process rather than FOIA — expect the same redirect here; the ethics/recusal records portion still stands.)"
        },
        {
          agencyId: "dfc",
          summary: "DFC — its Honduras / La Ceiba / Próspera-adjacent investment commitments",
          subject: "FOIA Request: DFC investment commitments concerning Honduras, La Ceiba, and Próspera",
          records: "I request, for the period January 1, 2025 to the date this request is processed: (1) the commitment letter, term sheet, memorandum of understanding, or investment-committee decision record for the Jilamito hydropower project (advanced with IDB Invest, serving La Ceiba); (2) the commitment letter and term sheet for any DFC commitment to Honduras Próspera Inc., or to any affiliate through which it operates the Próspera ZEDE on Roatán; (3) the commitment letter for any new or amended DFC commitment to Banco Ficohsa (Honduras) or Banco Lafise Honduras entered during the period — with written confirmation as to any named entity for which no commitment exists; and (4) the trip report, after-action or read-out memorandum, briefing or debriefing memorandum, and delegation agenda prepared in connection with CEO Benjamin Black's 2026 meetings in Tegucigalpa with President Asfura and Honduran officials. Note: per DFC's Jul 14, 2026 letter, ‘investment commitment’ is construed as commitment letters (confirmed), and published Board resolutions are excluded as public-domain material.",
          ask_no_records: true,
          history: [
            { label: "filed Jul 2, 2026 (DFC 26-039)",
              records: "I request a copy of any investment commitment, term sheet, memorandum of understanding, or investment-committee or board decision record of the U.S. International Development Finance Corporation concerning projects in Honduras — specifically any investment in or relating to the city of La Ceiba or the charter city known as Próspera (Roatán) — together with any recusal or ethics-screening record governing the agency head's involvement in those matters, dated between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
              outcome: "PERFECTION DEMANDED (Jul 10): the request ‘does not reasonably describe the records sought’ — DFC pointed to its Active Projects Database and Board Resolutions page for project names, and said the ethics/recusal ask belongs in the OGE Form 201 process, not FOIA.",
              refinement: "Named the projects from DFC’s own press releases ($1B Honduras initiative, Jilamito, Próspera/Roatán entities, Ficohsa and Lafise) plus CEO Black’s Tegucigalpa delegation records; withdrew the ethics portion and routed it through OGE Form 201. Amended the same day." },
            { label: "amended Jul 10, 2026",
              records: "[Amended Jul 10, 2026] The investment commitment, term sheet, memorandum of understanding, or investment-committee or Board decision record for: (a) any DFC commitment or proposed commitment connected to DFC's stated goal of financing $1 billion of private-sector investment in Honduras (per DFC's own press release); (b) the Jilamito hydropower project (with IDB Invest, serving La Ceiba); (c) any commitment concerning Próspera, the Próspera ZEDE on Roatán, or any entity operating within it, and any new or amended commitment to Banco Ficohsa or Banco Lafise Honduras; plus (d) the trip report, delegation agenda, or memorandum of conversation for CEO Benjamin Black's 2026 Tegucigalpa meetings. Ethics/recusal portion withdrawn to the OGE Form 201 process.",
              outcome: "SECOND PERFECTION DEMAND (Jul 14 acknowledgement letter): item (a) ‘not reasonably described’ — the cited press release is dated Jul 21, 2020; item (c) must name a specific project, commitment, or entity; ‘memorandum of conversation’ in item (d) uninterpretable; ‘investment commitment’ construed as commitment letters. Fee waiver DENIED and expedited DENIED — both final (90-day appeal windows). Clarify by Jul 17 or the items die.",
              refinement: "Item (a) withdrawn as subsumed; item (c) perfected with named entities — Honduras Próspera Inc. (and ZEDE-operating affiliates), Banco Ficohsa (Honduras), Banco Lafise Honduras; item (d) re-specified as trip report / after-action / read-out / briefing memoranda plus delegation agenda; the commitment-letters interpretation confirmed. Answered Jul 15 — two days ahead of the deadline." }
          ],
          refined: true,
          filed: "PENDING (perfected, round two) — filed Jul 2, 2026 (26-039); perfected Jul 10 after DFC's first demand; DFC's Jul 14 acknowledgement demanded a second round of clarification by Jul 17, answered Jul 15 ahead of deadline: 'investment commitment' = commitment letters confirmed; Item 1 ($1B-Honduras catch-all) withdrawn as subsumed; Item 2 (Jilamito) confirmed as interpreted; Item 3 perfected with named entities (Honduras Próspera Inc. / its Próspera ZEDE Roatán affiliate, Banco Ficohsa Honduras, Banco Lafise Honduras — with per-entity no-records confirmation demanded); Item 4's 'memorandum of conversation' recast as trip report / after-action or read-out memo / briefing memo / delegation agenda for Black's Tegucigalpa meetings. Written confirmation of perfection and the clock-start date requested. COMPLEX queue; EO 12600 third-party notice and interagency consultation warned as added delay. Fee waiver DENIED and expedited DENIED — both final agency decisions, 90-day appeal windows open (from Jul 14); classified 'all other requesters' (2 hrs search + 100 pages free; $25 cap stands)."
        }
      ]
    },
    {
      id: "prosperity-zones-federal-land",
      categories: ["Network state", "Conflict of interest"],
      entities: ["prosperity-zones", "new-american-industrial-alliance", "prospera", "thiel"],
      investigator: "More Perfect Union",
      investigatorLinks: [
        { label: "\"Peter Thiel's Plan To Replace Democracy\"", url: "https://www.youtube.com/watch?v=6iLf2h_fo-w" }
      ],
      status: "reported",
      finding: "More Perfect Union reports a lobbying push — the \"Blueprint for America\" — for \"prosperity zones\" and \"maritime prosperity zones\": districts on American soil with reduced regulation, created by selling federal and public land to private companies for low-tax, low-regulation havens. Co-sponsors include the New American Industrial Alliance and the company behind Próspera (Honduras), whose lobbying disclosures show hundreds of thousands of dollars spent pushing the plan.",
      implication: "A plan to transfer federal and public land to private operators for deregulated corporate enclaves is exactly the kind of policy whose framework documents, interagency planning, and land-disposal records are federal records. (The \"Blueprint\" and prosperity-zone framing are MPU's reporting and lobbying-disclosure-derived; these requests test what the agencies actually hold.)",
      sources: [
        { label: "More Perfect Union — Peter Thiel's Plan To Replace Democracy", url: "https://www.youtube.com/watch?v=6iLf2h_fo-w" },
        { label: "Senate lobbying disclosures (LDA filings)", url: "https://lda.senate.gov/system/public/" },
        { label: "Unlimited Hangout — City-States Without Limits, Part 2", url: "https://unlimitedhangout.com/2025/10/investigative-reports/city-states-without-limits-part-2/" },
        { label: "Unlimited Hangout — The Dark MAGA Gov-Corp Technate, Part 2", url: "https://unlimitedhangout.com/2025/03/investigative-reports/the-dark-maga-gov-corp-technate-part-2/" }
      ],
      requests: [
        {
          agencyId: "interior",
          component: "Action Office: BLM-HQ — BLM Headquarters. The dropdown lists every BLM state office; pick HQ because this asks for the policy instrument (plans/directives), which is a Washington-office record. State offices (BLM-NV, BLM-UT, …) hold implementation records — a follow-on request once a plan names its states.",
          summary: "Interior/BLM — any plan to sell or designate public land for \"prosperity zones\"",
          subject: "FOIA Request: Interior records on \"prosperity zones\" and disposal of public land",
          records: "I request a copy of any framework document, plan, interagency agreement, or land-disposal record held by the Department of the Interior or the Bureau of Land Management concerning the designation, sale, lease, or transfer of public land for \"prosperity zones,\" \"maritime prosperity zones,\" or the \"Blueprint for America,\" dated between January 1, 2025 and the date this request is processed. To keep this request narrow, I am not seeking general email correspondence. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 7, 2026 via Interior's PAL portal (Action Office: BLM-HQ). DOI control number DOI-2026-007659; BLM acknowledgment letter Jul 8, 2026: fee-waiver request accepted for processing, requester classified News Media (no search/review charges, 100 free pages), but the request is placed in the COMPLEX track (21–60 workdays — so a determination could run to ~Oct rather than the statutory ~Aug 4), with BLM promising to 'prioritize and process your request as the records become available.'"
        },
        {
          agencyId: "gsa",
          summary: "GSA — any \"prosperity zones\" / Blueprint-for-America federal-property records",
          subject: "FOIA Request: GSA records on \"prosperity zones\" and disposal of federal property",
          records: "I request a copy of any framework document, plan, interagency agreement, or real-property disposal record held by the U.S. General Services Administration concerning \"prosperity zones,\" \"maritime prosperity zones,\" or the \"Blueprint for America,\" and the sale or transfer of federal property for low-regulation corporate development, dated between January 1, 2025 and the date this request is processed. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 2026 via FOIA.gov (GSA's own PAL portal was down; FOIA.gov transmits to GSA). Watch for correspondence from foia@foiaxpress.gsa.gov — safelist it. Statutory determination window: 20 business days."
        }
      ]
    },
    {
      id: "subic-bay-ai-park",
      categories: ["Network state", "Conflict of interest"],
      entities: ["subic-bay", "philippines", "lonsdale", "thiel"],
      investigator: "More Perfect Union",
      investigatorLinks: [
        { label: "\"Peter Thiel's Plan To Replace Democracy\"", url: "https://www.youtube.com/watch?v=6iLf2h_fo-w" }
      ],
      status: "reported",
      finding: "More Perfect Union reports that Joe Lonsdale (8VC co-founder and Thiel associate) helped staff the Trump administration and accompanied administration officials to the Philippines to christen a new regulatory zone — a \"historic deal\" for an approximately 4,000-acre \"AI-native industrial park\" next to Subic Bay, described as a startup-city-style development.",
      implication: "A private venture-capital figure embedded in an official U.S. delegation to inaugurate a foreign \"regulatory zone\" his network stands to profit from raises conflict-of-interest and foreign-deal-transparency questions. The agreement or memorandum, the delegation roster, and any U.S. financing commitment are federal records. (Lonsdale's role and the deal's framing are MPU's reporting; these requests test the official record.)",
      sources: [
        { label: "More Perfect Union — Peter Thiel's Plan To Replace Democracy", url: "https://www.youtube.com/watch?v=6iLf2h_fo-w" },
        { label: "Unlimited Hangout — City-States Without Limits, Part 2", url: "https://unlimitedhangout.com/2025/10/investigative-reports/city-states-without-limits-part-2/" }
      ],
      requests: [
        {
          agencyId: "state",
          summary: "State — the Subic Bay AI-park agreement + the U.S. delegation roster",
          subject: "FOIA Request: State Department records on the Subic Bay AI industrial park and U.S. delegation",
          records: "I request a copy of any agreement, memorandum of understanding, framework document, or signing/ceremony record held by the Department of State concerning the approximately 4,000-acre \"AI-native industrial park\" or regulatory zone near Subic Bay, Philippines, together with any record identifying the members of the U.S. delegation to that event, including any private-sector participants (such as Joe Lonsdale or 8VC), dated between January 1, 2025 and the date this request is processed. To keep this request narrow, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "PENDING — filed by email to FOIARequest@state.gov (State's required subject format) Jul 16, 2026; confirmed in the sent-mail record. No State acknowledgment yet."
        },
        {
          agencyId: "dfc",
          summary: "DFC — any U.S. financing commitment for the Subic Bay project",
          subject: "FOIA Request: DFC financing records for the Subic Bay (Philippines) AI industrial park",
          records: "I request a copy of any investment commitment, term sheet, memorandum of understanding, or investment-committee decision record of the U.S. International Development Finance Corporation concerning the AI-native industrial park or regulatory zone near Subic Bay, Philippines, dated between January 1, 2025 and the date this request is processed. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          filed: "PENDING — filed by email to FOIA@dfc.gov Jul 16, 2026; confirmed in the sent-mail record. No DFC acknowledgment on this specific request yet (distinct from the Honduras/Próspera DFC request 26-039)."
        }
      ]
    },
    {
      id: "passports-eop",
      categories: ["NDS takeover"],
      entities: ["nds", "eop", "state-dept", "passports-gov"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "\"Trump Built A New Passport.gov Website\"", url: "https://thedreydossier.substack.com/p/trump-built-a-new-passport-website" },
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" }
      ],
      status: "confirmed",
      finding: "passports.gov is registered to the Executive Office of the President — not the State Department that issues passports.",
      implication: "A live passport sign-in portal (auth.passports.gov, no State seal) sitting under the President's own executive office rather than the agency that actually issues passports.",
      sources: [
        { label: "CISA dotgov-data", url: "https://github.com/cisagov/dotgov-data" },
        { label: "crt.sh certificate logs", url: "https://crt.sh" }
      ],
      requests: [
        {
          agencyId: "state",
          summary: "State Dept — the instrument authorizing EOP/NDS to operate passports.gov",
          subject: "FOIA Request: Department of State authorization for passports.gov under the EOP/National Design Studio",
          records: "I request a copy of the specific instrument(s) that authorized the Executive Office of the President or the National Design Studio — rather than the Department of State — to register or operate the passports.gov domain: namely, any interagency agreement, memorandum of understanding, memorandum of agreement, or delegation of authority between the Department of State and the National Design Studio (or the Executive Office of the President) concerning passports.gov, executed or in effect between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          filed: "NOT CONFIRMED SENT — a Jul 2026 reconcile against the full sent-mail record found NO email to FOIARequest@state.gov for this passports.gov request. It appears to have been carded (Jul 16, to prevent duplicate generation) but never actually filed — the State requests that DID go out are the Khanna and Subic Bay ones. ACTION: file it (FOIARequest@state.gov, subject 'Freedom of Information Act/Privacy Act Request')."
        },
        {
          agencyId: "nara",
          summary: "NARA — any records schedule filed for NDS",
          subject: "FOIA Request: records schedules filed by or for the National Design Studio",
          records: "I request a copy of any records schedule or records-disposition authority that the National Design Studio has filed with the National Archives since the studio's establishment in August 2025 — a single, discrete, catalogued document, not a broad search. If none has been filed, I request written confirmation of that fact. If NARA's position is that the National Design Studio's records fall under the Presidential Records Act rather than the Federal Records Act, I request written confirmation of that determination and any record memorializing it, which would itself be responsive.",
          priorArt: "NO PRIOR ART (Federal Register shows no NARA schedule notice mentioning NDS — consistent with none filed). Anticipate the PRA-not-FRA shield for a White House Office component (records sealed to ~2040); the request now forces that determination onto paper. Prior-art sweep 2026-07-04.",
          ask_no_records: true,
          response: "ANSWERED — filed Jun 19, 2026 (tracking NGC26-543; a Jul 4 duplicate was folded into the same number); final response Jul 9, 2026: \"Following a search, no records were found to be responsive.\" NARA confirms in writing that the National Design Studio has filed NO records schedule — the exact fact this request was built to force onto paper. 90-day appeal window open."
        }
      ]
    },
    {
      id: "hogan-login-gov",
      categories: ["NDS takeover"],
      entities: ["nds", "greg-hogan", "login-gov", "passports-gov"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "Greg Hogan was detailed from the National Design Studio to run login.gov, reportedly expanding it to cover passports and driver's licenses.",
      implication: "The government's universal sign-in is being extended to the highest-value identity documents — steered by a detailee from the same White House design office.",
      sources: [
        { label: "Wired / Nextgov / FedScoop (Apr–May 2026)", url: "" }
      ],
      requests: [
        {
          agencyId: "gsa",
          summary: "GSA — Greg Hogan's detail from NDS to login.gov",
          subject: "FOIA Request: detail of Greg Hogan from the National Design Studio to login.gov",
          records: "I request a copy of the detail agreement, the appointment or assignment memorandum, and any reimbursable-detail (e.g., IPA) paperwork documenting the detail of Greg Hogan from the National Design Studio to login.gov or the Technology Transformation Service, limited to records dated between January 1, 2026 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence."
        },
        {
          agencyId: "gsa",
          summary: "GSA — plans to extend login.gov to passports & driver's licenses",
          subject: "FOIA Request: login.gov expansion to passport and driver's-license verification",
          records: "I request a copy of any project charter, statement of work, requirements document, or interagency agreement concerning the expansion of login.gov identity verification to cover U.S. passports or state driver's licenses, dated between January 1, 2026 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence."
        }
      ]
    },
    {
      id: "vote-gov-preview",
      categories: ["NDS takeover"],
      entities: ["nds", "eac", "vote-gov", "doj"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "\"I found a second vote.gov\"", url: "https://thedreydossier.substack.com/p/i-found-a-second-votegov-and-its" },
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" }
      ],
      status: "confirmed",
      finding: "NDS built a preview replacement of the Election Assistance Commission's vote.gov — even as DOJ reportedly told a court that the voter-registration infrastructure \"does not exist.\"",
      implication: "A White House design office prototyping the national voter-registration portal, owned by a different agency, around the same time DOJ disclaimed its existence in litigation.",
      sources: [
        { label: "crt.sh certificate logs", url: "https://crt.sh" },
        { label: "CISA dotgov-data", url: "https://github.com/cisagov/dotgov-data" }
      ],
      requests: [
        {
          agencyId: "eac",
          summary: "EAC — its dealings with NDS over vote.gov",
          subject: "FOIA Request: Election Assistance Commission records concerning the National Design Studio and vote.gov",
          records: "I request a copy of any interagency agreement, memorandum of understanding, statement of work, or task order between the U.S. Election Assistance Commission and the National Design Studio (or the Executive Office of the President) concerning vote.gov — or any preview, replacement, or redesign of vote.gov — dated between January 1, 2026 and the date this request is processed. I note that the EAC stated to The Guardian (June 2026) that discussions with the National Design Studio regarding possible modernization of vote.gov had taken place and had been paused — records of those discussions and any agreements framing them are responsive. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          priorArt: "NO PRIOR REQUEST (MuckRock: zero vote.gov/NDS requests). Predicate strengthened: EAC admitted to The Guardian (Jun 2026) that NDS modernization discussions occurred and were 'paused' — records must exist. Prior-art sweep 2026-07-04.",
          ask_no_records: true,
          response: "ANSWERED — filed Jul 2, 2026 (EAC 26-0064); response Jul 9, 2026 from Associate Counsel Seton Parsons: \"The EAC does not possess records responsive to your request.\" No interagency agreement, MOU, statement of work, or task order exists between EAC and NDS/EOP concerning vote.gov — despite EAC's reported admission that NDS modernization discussions occurred. Whatever happened around vote.gov, it was never papered with the agency. 90-day appeal window open."
        }
      ]
    },
    {
      id: "no-pias-sorns",
      categories: ["Surveillance & privacy", "NDS takeover"],
      entities: ["nds"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "No Privacy Impact Assessments or System of Records Notices exist for any NDS program — the federal privacy registries come back empty.",
      implication: "Identity systems handling personal data appear to be operating without the public privacy disclosures the Privacy Act generally requires. A \"no records\" answer is itself the finding.",
      sources: [
        { label: "Federal PIA/SORN registries (all empty)", url: "" }
      ],
      requests: [
        {
          agencyId: "omb",
          summary: "OMB — any privacy assessment (PIA/SORN) covering an NDS system",
          subject: "FOIA Request: Privacy Impact Assessments and System of Records Notices for National Design Studio programs",
          records: "I request the following records in OMB's own custody, dated August 1, 2025 to the date this request is processed: (1) any Privacy Impact Assessment submitted to or filed with OMB under E-Government Act § 208 concerning a National Design Studio program, website, or information system; (2) any System of Records Notice submitted to OMB for review under OMB Circular A-108 concerning a National Design Studio system, together with OMB's review correspondence; and (3) any correspondence between OMB and the National Design Studio concerning compliance with OMB Circular A-108 or A-130. This request seeks OMB's own records only — not records in NDS custody. Per OMB's July 16, 2026 letter, NDS records are outside OMB's control; records submitted to or created by OMB, however, are OMB records subject to FOIA. If no responsive records exist, I request written confirmation of that fact.",
          history: [
            { label: "filed Jun 19, 2026 (re-sent Jul 4); status demand Jul 15",
              records: "I request a copy of any Privacy Impact Assessment (PIA) or System of Records Notice (SORN) prepared for a National Design Studio program or information system since the studio's establishment in August 2025. These are discrete, published privacy documents, not a broad search; if none exists, I request written confirmation of that fact.",
              outcome: "CUSTODY DEFLECTION (Jul 16, one business day after the status demand): NDS ‘is not a component of OMB’ — established within the White House Office by E.O. 14338 of Aug 21, 2025; ‘OMB does not process FOIA requests on behalf of NDS.’ No tracking number ever issued.",
              refinement: "Re-aimed at OMB’s own files, which the custody argument cannot deflect: E-Government Act § 208 PIAs are submitted TO OMB, and Circular A-108 makes OMB the SORN reviewer — OMB’s copies and review correspondence are OMB records subject to FOIA." }
          ],
          refined: true,
          ask_no_records: true,
          response: "ANSWERED (custody deflection — the shield is now on paper) — filed Jun 19, 2026; ignored until the Jul 15 status demand, which produced OMB's answer within one business day (Jul 16): NDS 'is not a component of OMB' — it was established within the White House Office of the EOP by E.O. 14338 of Aug 21, 2025 ('Improving Our Nation Through Better Design'); NDS records 'are not within the legal custody and control of OMB'; 'OMB does not process FOIA requests on behalf of NDS.' Verified against the inbox Jul 2026: the deflection is OMB's own words (Jul 16), and a same-day re-send of the PIA/SORN request was then logged as OMB FOIA 2026-745 (a routing number; OMB still maintains the custody position). The PostHog and automonitor requests drew no separate acknowledgment. What this wins: the anticipated shield is now an official written statement — NDS sits inside the White House Office, the one EOP corner FOIA cannot reach (PRA, sealed to ~2040), and the E.O. number is on the record. What OMB dodged: whether OMB ITSELF holds copies — E-Government Act § 208 PIAs are submitted TO OMB, and OMB Circular A-108 makes OMB the SORN reviewer, so a narrowed follow-up ('any PIA or SORN concerning an NDS program in OMB's own files, and any A-108/A-130 correspondence with NDS') targets records the custody argument cannot deflect."
        }
      ]
    },
    {
      id: "posthog-federal",
      categories: ["Surveillance & privacy"],
      entities: ["nds", "posthog"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "The PostHog analytics SDK — and, on realfood.gov, its session recorder — appears in the code of multiple federal .gov sites (realfood.gov, techforce.gov, trumpaccounts.gov); PostHog's own customers page listed \"Design studio of the US Government.\"",
      implication: "Third-party behavioral analytics, including session recording, embedded in federal websites. (Note: trumpaccounts.gov is Treasury's, so the common thread is the vendor, not a single owner.)",
      sources: [
        { label: "JavaScript bundle inspection", url: "" },
        { label: "PostHog customers page", url: "https://posthog.com/customers" }
      ],
      requests: [
        {
          agencyId: "omb",
          summary: "OMB — contracts & privacy reviews for PostHog on federal sites",
          subject: "FOIA Request: federal use of PostHog analytics software",
          records: "I request a copy of any contract, task order, or data-processing agreement covering the use of PostHog analytics software on the federal websites realfood.gov or techforce.gov, dated between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 4, 2026 by email to OMBFOIA@omb.eop.gov; no acknowledgment yet. A tracking number was demanded in the Jul 15 status letter; determination due ~Aug 3 (20 business days from Mon Jul 6 receipt). Expect the same custody deflection OMB issued Jul 16 on the PIAs/SORNs request (NDS = White House Office per E.O. 14338, not OMB) — if it comes, the counter is the same: narrow to records in OMB's own files."
        }
      ]
    },
    {
      id: "akash-usadf",
      categories: ["NDS takeover"],
      entities: ["nds", "usadf"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "An @ndstudio.gov address (akash@ndstudio.gov) is the CISA-registered security contact for an independent agency's domain, usadf.gov.",
      implication: "A National Design Studio staffer listed as the security contact for the U.S. African Development Foundation's own domain — with no public authorization on record.",
      sources: [
        { label: "CISA dotgov-data", url: "https://github.com/cisagov/dotgov-data" }
      ],
      requests: [
        {
          agencyId: "usadf",
          summary: "USADF — the authorization for an @ndstudio.gov security contact",
          subject: "FOIA Request: authorization for a National Design Studio security contact on usadf.gov",
          records: "I request a copy of any interagency agreement, memorandum of understanding, or written authorization permitting the National Design Studio, or any @ndstudio.gov email holder (including akash@ndstudio.gov), to serve as the registered security or administrative contact for the usadf.gov domain, in effect between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          response: "ANSWERED — filed Jul 4, 2026 by email to info@usadf.gov; final response Jul 13, 2026 from USADF (Bailey Dowling, no tracking number assigned): \"There are no documents responsive to your request.\" No charge (22 C.F.R. § 1502.7). USADF confirms in writing that NO agreement, MOU, or written authorization exists permitting NDS or any @ndstudio.gov holder (including akash@ndstudio.gov) to serve as security/administrative contact for the usadf.gov domain — the registration happened with no paper behind it, the exact absence this request was built to force onto the record."
        }
      ]
    },
    {
      id: "gebbia-coi",
      categories: ["Conflict of interest"],
      entities: ["nds", "gebbia", "tesla"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "Joe Gebbia leads the National Design Studio (effective Aug 21, 2025) while reportedly retaining an active Tesla board seat — and OGE has now confirmed in writing (Jul 7, 2026) that it holds no Form 278e, ethics agreement, waiver, or recusal for him.",
      implication: "Eleven months into a presidential appointment, the government's central ethics office has no financial disclosure on file for the design chief. Either his disclosure sits only at his home agency, he files confidentially as a Special Government Employee (never public, the standard DOGE-cohort maneuver), or he hasn't filed. The next request forces which.",
      sources: [
        { label: "Executive Order 14338", url: "" },
        { label: "FedScoop / Wikipedia (URLs pending)", url: "" },
        { label: "OGE FOIA FY 26/080 final response letter (Jul 7, 2026)", url: "" }
      ],
      requests: [
        {
          agencyId: "oge",
          summary: "OGE — Gebbia's financial disclosure + any ethics waiver",
          subject: "FOIA Request: OGE Form 278e and ethics waiver for Joe Gebbia",
          records: "I request a copy of the OGE Form 278e public financial disclosure report filed by Joe Gebbia in connection with his federal appointment, and any ethics waiver, recusal agreement, or authorization to hold outside positions issued to him, dated between August 1, 2025 and the date this request is processed.",
          ask_no_records: true,
          response: "ANSWERED — filed Jul 6, 2026 (tracking OGE FOIA FY 26/080); closed Jul 7, 2026. OGE searched and located NO responsive records, and noted 278e reports aren't processed under FOIA at all (Exemption 3 — the Ethics in Government Act, 5 U.S.C. § 13107, has its own access route). The 'no records' is the finding: no certified disclosure exists at OGE. Follow-up: OGE Form 201 to the home agency's ethics office (NDS is an EOP component — White House Office DAEO, ethics@who.eop.gov). A § 13107 request isn't FOIA, so the usual EOP FOIA shield doesn't apply; if the answer is 'confidential SGE filer,' that answer is itself the story."
        }
      ]
    },
    {
      id: "automonitor",
      categories: ["Surveillance & privacy"],
      entities: ["nds"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "The National Design Studio serves a ~540-line behavioral-tracking script (\"AutoMonitor\") from its own infrastructure (cdn.infra.ndstudio.gov), posting data to a separate pipeline (analytics.infra.ndstudio.gov), loaded on federal sites.",
      implication: "A proprietary behavioral-tracking pipeline run by a White House design office across federal websites — purpose inferred from the code; data retention and downstream use are undocumented.",
      sources: [
        { label: "Live script fetch + reverse-engineering (The Drey Dossier)", url: "" }
      ],
      requests: [
        {
          agencyId: "omb",
          summary: "OMB — privacy review/authorization for NDS tracking scripts on federal sites",
          subject: "FOIA Request: authorization and privacy review for National Design Studio tracking scripts on federal websites",
          records: "I request a copy of any privacy review, Privacy Impact Assessment, or written authorization on file permitting the National Design Studio to load behavioral-tracking or analytics scripts (including those served from cdn.infra.ndstudio.gov) onto federal agency websites, since the studio's establishment in August 2025. To keep this request narrow, I am not seeking general email correspondence; if no such authorization exists, I request written confirmation of that fact.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 4, 2026 by email to OMBFOIA@omb.eop.gov; no acknowledgment yet. A tracking number was demanded in the Jul 15 status letter; determination due ~Aug 3 (20 business days from Mon Jul 6 receipt). Expect the same custody deflection OMB issued Jul 16 on the PIAs/SORNs request (NDS = White House Office per E.O. 14338, not OMB) — if it comes, the counter is the same: narrow to records in OMB's own files."
        }
      ]
    },
    {
      id: "doj-no-client-list",
      categories: ["Human trafficking"],
      entities: ["epstein", "doj", "fbi"],
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "On July 7, 2025, the DOJ and FBI released an unsigned memo concluding — after reviewing 300+ GB of evidence — that there was no Epstein \"client list\" and reaffirming his 2019 death as suicide; the accompanying ~11 hours of jail video was missing about a minute.",
      implication: "The federal review that officially closed the case. The memo, the evidence it reviewed, and the complete unedited video are records the public can request. (The missing minute was later attributed to a nightly system reset.)",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" },
        { label: "Unlimited Hangout — First Friends, Part 2 (the First Couple's consigliere)", url: "https://unlimitedhangout.com/2025/08/investigative-series/first-friendspt2/" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the complete, unedited facility video for the date of Epstein's death",
          subject: "FOIA Request: complete unedited surveillance video referenced in the July 7, 2025 Epstein memo",
          records: "I request a copy of the complete, unedited surveillance-camera footage from the federal facility where Jeffrey Epstein died, covering the 24-hour period of his death, as referenced in the July 7, 2025 joint DOJ/FBI memorandum. I am requesting the original continuous recording, not an excerpted or compiled version.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 16, 2026 via the FBI's eFOIPA portal (efoia.fbi.gov); intake confirmation received same day, FOIPA number to follow (check status at vault.fbi.gov). Requester category not set (eFOIPA); fee waiver + expedite requested under the generic pre-Jul-17 language."
        },
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — covers the Offices of the Attorney General and Deputy Attorney General",
          summary: "DOJ — the July 7, 2025 memo + the index of evidence it reviewed",
          subject: "FOIA Request: July 7, 2025 DOJ/FBI Epstein memorandum and evidence index",
          records: "I request a copy of the final July 7, 2025 joint DOJ/FBI memorandum concerning the Jeffrey Epstein review, together with any index, inventory, or list identifying the categories of evidence reviewed in reaching its conclusions. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04058 (filed Jul 16, 2026); confirmed by the request-receipt PDF in the Hearth foia-mail folder. Subject: the final July 7, 2025 joint DOJ/FBI Epstein-review memo + evidence index. Determination pending."
        }
      ]
    },
    {
      id: "maxwell-blanche-interview",
      categories: ["Human trafficking"],
      entities: ["epstein", "maxwell", "blanche", "doj"],
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "Deputy Attorney General Todd Blanche interviewed Ghislaine Maxwell over two days in late July 2025; soon after, she was quietly moved to a minimum-security prison camp — a transfer left unexplained at the time (Blanche later cited threats to her life).",
      implication: "A senior DOJ interview of the only convicted co-conspirator, followed by an unexplained transfer. The interview records are requestable.",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" },
        { label: "Unlimited Hangout — First Friends, Part 2 (the First Couple's consigliere)", url: "https://unlimitedhangout.com/2025/08/investigative-series/first-friendspt2/" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — covers the Deputy Attorney General's office",
          summary: "DOJ — records of Blanche's late-July 2025 interview of Maxwell",
          subject: "FOIA Request: DOJ records of the July 2025 interview of Ghislaine Maxwell by Deputy AG Todd Blanche",
          records: "I request a copy of any interview memoranda, FD-302 reports, or transcripts documenting the interview of Ghislaine Maxwell conducted by Deputy Attorney General Todd Blanche over two days in late July 2025. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04059 (filed Jul 16, 2026); confirmed by the request-receipt PDF. Determination pending."
        }
      ]
    },
    {
      id: "epstein-pages-withheld",
      categories: ["Human trafficking"],
      entities: ["epstein", "doj", "massie", "ro-khanna"],
      investigator: "John Kiriakou (on Julian Dorey's podcast)",
      investigatorLinks: [
        { label: "The Deep State — Kiriakou × Dorey, Pt 1", url: "https://www.youtube.com/watch?v=eKTJ8T4D02w" }
      ],
      status: "confirmed",
      finding: "John Kiriakou says roughly 3–3.5 million additional Epstein-related pages remain withheld despite the Epstein Files Transparency Act (which he cites as passing the House 419–1 and the Senate 100–0). Corroborated Jul 2026 (Breaking Points): VP JD Vance said on Joe Rogan that DOJ \"collected 6 million documents,\" while Rep. Thomas Massie noted only ~3 million have been released — the same withholding gap, now with a total from the VP on record.",
      implication: "If a near-unanimous transparency law was enacted, the index of what was identified — and any decision to withhold — are themselves records. (Kiriakou's page figure and vote counts are on-air assertions; this request tests them against the record.)",
      sources: [
        { label: "The Deep State — Kiriakou × Dorey, Pt 1 (@1:08)", url: "https://www.youtube.com/watch?v=eKTJ8T4D02w" },
        { label: "Unlimited Hangout — First Friends: How Andrew Farkas and an Emirati Sultan Helped Epstein Build a Smuggler's Paradise", url: "https://unlimitedhangout.com/2026/03/investigative-series/first-friends-how-andrew-farkas-and-an-emirati-sultan-helped-epstein-build-a-smugglers-paradise/" },
        { label: "Breaking Points — Massie & Khanna on the Transparency Act sequel (Vance's 6M figure; Massie: only 3M released)", url: "https://www.youtube.com/watch?v=8-ug7Od3230" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — department-level determinations",
          summary: "DOJ — the records index + any withholding determination under the Transparency Act",
          subject: "FOIA Request: records identified and withheld under the Epstein Files Transparency Act",
          records: "I request a copy of the index, log, or schedule of records identified for processing under the Epstein Files Transparency Act, and any written determination withholding records from release under that Act, dated from the Act's enactment to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04060 (filed Jul 16, 2026); confirmed by the request-receipt PDF. Determination pending."
        }
      ]
    },
    {
      id: "bondi-binders",
      categories: ["Human trafficking"],
      entities: ["epstein", "bondi", "eop", "doj"],
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "On February 27, 2025, the White House handed right-wing influencers binders labeled \"the Epstein files\" in the Roosevelt Room; the material (flight logs, contact lists, summaries) had nearly all been previously released, and the binders were reportedly unvetted.",
      implication: "A staged \"release\" of mostly-public material. What was actually in the binders, who assembled them, and how they were prepared are requestable records.",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — covers the Attorney General's office",
          summary: "DOJ — the binder contents + who assembled them",
          subject: "FOIA Request: contents and preparation of the February 27, 2025 'Epstein files' binders",
          records: "I request a copy of the materials compiled into the binders labeled \"the Epstein files\" distributed at the White House on February 27, 2025, and any records identifying what was included in those binders and which Department of Justice office assembled or vetted them. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04061 (filed Jul 16, 2026); confirmed by the request-receipt PDF. Determination pending."
        }
      ]
    },
    {
      id: "epstein-privilege-memos",
      categories: ["Human trafficking"],
      entities: ["epstein", "doj", "massie", "ro-khanna"],
      investigator: "Reps. Thomas Massie & Ro Khanna (Breaking Points)",
      investigatorLinks: [
        { label: "Breaking Points — Massie & Khanna on the Epstein Files Transparency Act sequel", url: "https://www.youtube.com/watch?v=8-ug7Od3230" }
      ],
      status: "reported",
      finding: "Rep. Massie says DOJ has told Congress twice, in written notes or memos, that it is invoking the deliberative-process privilege to withhold Epstein files — the stated basis for not turning over records on why certain individuals were or were not prosecuted. The Massie–Khanna sequel bill is written specifically to strip that privilege claim.",
      implication: "A deliberative-process-privilege claim asserted to Congress is a discrete written record — the notes/memos themselves, plus any legal opinion supporting the position. They fix on paper exactly what DOJ is withholding and on what stated ground, which is the appealable core of the dispute. (Massie's account is on-air; the request tests it against the paper.)",
      sources: [
        { label: "Breaking Points — Massie & Khanna (the deliberative-process-privilege memos)", url: "https://www.youtube.com/watch?v=8-ug7Od3230" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — department-level determinations & congressional correspondence",
          summary: "DOJ — the notes/memos to Congress invoking deliberative-process privilege over Epstein files",
          subject: "FOIA Request: DOJ communications to Congress asserting deliberative-process privilege to withhold Epstein-related records",
          records: "I request copies of any written communications — notes, memoranda, or letters — sent by the Department of Justice to Congress or any congressional committee that assert or invoke the deliberative-process privilege as a basis for withholding records concerning Jeffrey Epstein or the Epstein Files Transparency Act, together with any legal memorandum or opinion supporting that assertion. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "NOT FILED — drafted Jul 18, 2026; queued for OIP via FOIA STAR."
        }
      ]
    },
    {
      id: "dialog-society-officials",
      categories: ["Conflict of interest"],
      entities: ["thiel", "bessent", "hoffman", "driscoll", "lonsdale", "palantir", "dialog-society", "treasury", "dod"],
      investigator: "Ian Carroll",
      investigatorLinks: [
        { label: "Ian Carroll — \"Recent Peter Thiel allegations\"", url: "https://www.youtube.com/watch?v=T3Vcra08-IQ" }
      ],
      status: "confirmed",
      finding: "A leaked roster of Peter Thiel's secretive, off-the-record \"Dialog\" society (exposed June 16, 2026 by Wired, from researcher maia arson crimew's leak) places sitting Cabinet officials alongside executives of the industries they regulate — e.g., Treasury Secretary Scott Bessent with data-broker chairman Auren Hoffman (SafeGraph / LiveRamp), and Army Secretary Dan Driscoll with Palantir's Joe Lonsdale, whose software runs Pentagon and ICE systems.",
      implication: "Senior executive officials convening privately, under no-attribution rules, with executives of industries they regulate — a textbook conflict-of-interest question. Attendees reportedly used personal/corporate email to keep communications outside FOIA, so the requestable records are official-travel authorizations, ethics reviews, and recusals — not emails.",
      sources: [
        { label: "Wired exposé (Jun 16 2026)", url: "" },
        { label: "Washington Times (Jun 18 2026)", url: "https://www.washingtontimes.com/news/2026/jun/18/data-leak-unmasks-members-peter-thiels-elite-secretive-dialog-society/" },
        { label: "maia arson crimew (leak)", url: "" }
      ],
      requests: [
        {
          agencyId: "treasury",
          summary: "Treasury — Bessent's travel authorization + ethics review re Dialog",
          subject: "FOIA Request: travel and ethics records re Secretary Bessent's participation in the Dialog society",
          records: "I request a copy of any official-travel authorization, ethics review, or recusal record concerning Treasury Secretary Scott Bessent's participation in the organization known as Dialog (the invitation-only society co-founded by Peter Thiel) or its retreats, from January 1, 2025 to the date this request is processed. I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "dod",
          summary: "DoD/Army — Driscoll's travel authorization + ethics review re Dialog",
          subject: "FOIA Request: travel and ethics records re Army Secretary Driscoll's participation in the Dialog society",
          records: "I request a copy of any official-travel authorization, ethics review, or recusal record concerning Secretary of the Army Dan Driscoll's participation in the organization known as Dialog (the invitation-only society co-founded by Peter Thiel) or its retreats, from January 1, 2025 to the date this request is processed. I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "feinberg-cerberus",
      categories: ["Conflict of interest"],
      entities: ["feinberg", "cerberus", "dod"],
      investigator: "Candace Owens",
      investigatorLinks: [
        { label: "Candace — Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      status: "confirmed",
      finding: "Deputy Secretary of Defense Stephen Feinberg co-founded Cerberus Capital Management, which owned the private-military contractor DynCorp (2010–2020) — a firm tied to a documented Bosnia sex-trafficking scandal exposed by whistleblower Kathryn Bolkovac. Feinberg has said he divested, but the extent of any continuing ties is unclear.",
      implication: "The Pentagon's second-in-command, a $5B Cerberus co-founder, previously owned a mercenary firm linked to a trafficking scandal. His financial-disclosure and divestiture/recusal records are exactly what federal ethics filings exist to surface.",
      sources: [
        { label: "Candace Owens, Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" },
        { label: "Cerberus (confirmation announcement)", url: "https://www.cerberus.com/media/cerberus-co-founder-steve-feinberg-confirmed-as-u-s-deputy-secretary-of-defense/" }
      ],
      requests: [
        {
          agencyId: "oge",
          summary: "OGE — Feinberg's Form 278e + divestiture/ethics agreement",
          subject: "FOIA Request: OGE Form 278e and ethics agreement for Deputy Secretary of Defense Stephen Feinberg",
          records: "I request a copy of the OGE Form 278e public financial disclosure report filed by Stephen Feinberg in connection with his appointment as Deputy Secretary of Defense, together with any ethics agreement, divestiture plan, or recusal statement filed with that appointment, dated from January 1, 2025 to the date this request is processed.",
          ask_no_records: true
        },
        {
          agencyId: "dod",
          summary: "DoD — any recusal/screening arrangement re Cerberus",
          subject: "FOIA Request: recusal and screening records for Deputy Secretary Feinberg concerning Cerberus Capital Management",
          records: "I request a copy of any recusal, screening arrangement, or ethics-screening memorandum on file at the Department of Defense governing Deputy Secretary of Defense Stephen Feinberg's involvement in matters affecting Cerberus Capital Management or its former portfolio holdings, from January 1, 2025 to the date this request is processed. I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "sam702-flight",
      categories: ["Conflict of interest"],
      entities: ["fort-huachuca", "hansell", "dod"],
      investigator: "Candace Owens",
      investigatorLinks: [
        { label: "Candace — Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      status: "reported",
      finding: "Candace Owens reports that the office of the Under Secretary of Defense for Intelligence & Security (Bradley Hansell) tasked a government flight, \"SAM702,\" with an unusual early-September 2025 itinerary — Tucson, an overnight at Fort Huachuca (an Army intelligence base), then El Paso — and that her FOIA request for its records was deferred under an \"unusual burden\" exception (queued at roughly #3,500).",
      implication: "A military aircraft's tasking order, manifest, and itinerary are ordinarily releasable records. This request seeks the flight's own records — who tasked SAM702 on those dates and where it went; the reported FOIA stonewalling is the backdrop, not the ask. (Single-source, on-air account — the request is what tests it.)",
      sources: [
        { label: "Candace Owens, Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      requests: [
        {
          agencyId: "dod",
          summary: "DoD — SAM702 tasking order, manifest, and itinerary (Sept 2025)",
          subject: "FOIA Request: tasking and manifest for military flight SAM702, September 2025",
          records: "I request a copy of the tasking order, passenger manifest, and itinerary for the military flight designated SAM702 for the period September 7–9, 2025, including records identifying the office that requested or sponsored the mission. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "election-address-vs-record",
      categories: ["Election integrity", "Surveillance & privacy"],
      entities: ["trump", "odni", "dhs", "doj"],
      investigator: "The Drey Dossier (fact-check)",
      investigatorLinks: [
        { label: "Trump Addresses the Nation: Fact-Checks + Breakdown", url: "https://www.youtube.com/watch?v=a2O9uqy1nNo" }
      ],
      status: "reported",
      finding: "In a July 2026 national address, Trump presented \u2018declassified\u2019 material to claim foreign actors compromised US elections. Drey\u2019s line-by-line fact-check surfaces that Trump\u2019s OWN 2021 declassified intelligence assessment \u2014 produced by his first-term appointees \u2014 found with high confidence that no foreign actor altered any vote, registration, ballot, tabulation, or result; that the 2020 foreign influence which did occur was Russian and aimed at helping Trump; and that voting/tabulation systems are air-gapped, ~96% paper-verifiable, with no documented flaw ever changing a US outcome. She also catches Trump attributing a DHS non-citizen-voter analysis to \u2018the FBI.\u2019",
      implication: "The address\u2019s claims are checkable against records the government already holds \u2014 above all the 2021 assessment that contradicts the new release. Whether the new \u2018declassified\u2019 claims rest on any intelligence product, or on none, is a documentary question, not a rhetorical one.",
      sources: [
        { label: "The Drey Dossier fact-check (address replayed and rebutted line by line)", url: "https://www.youtube.com/watch?v=a2O9uqy1nNo" },
        { label: "2021 ODNI declassified election-security assessment (Trump first-term)" }
      ],
      requests: [
        {
          agencyId: "odni",
          summary: "ODNI \u2014 the 2021 declassified election-security assessment (and any 2026 product behind the new claims)",
          subject: "FOIA Request: 2021 declassified election-security intelligence assessment and any 2026 assessment underlying the July 2026 address",
          records: "I request: (1) the declassified 2021 intelligence community assessment concerning foreign interference or influence in the 2020 US federal election \u2014 the assessment finding that no foreign actor altered vote counts, voter registration, ballots, tabulation, or results; and (2) any finished intelligence product, assessment, or memorandum dated in 2026 that the intelligence community produced concerning foreign compromise of US election infrastructure and that underlies the claims made in the President\u2019s July 2026 national address. If no 2026 product exists, I request written confirmation of that fact.",
          ask_no_records: true
        },
        {
          agencyId: "doj-crt",
          summary: "DOJ Civil Rights Division \u2014 the \u2018election integrity\u2019 enforcement records and site postings",
          subject: "FOIA Request: DOJ Civil Rights Division election-integrity enforcement matters (2025\u20132026)",
          records: "I request the enforcement records \u2014 complaints, notices, letters, or settlement/consent documents \u2014 for the election-integrity matters the Civil Rights Division has posted on its public website concerning Mississippi, Hawaii, and California, together with the records reflecting when each matter was initiated. Fact-check reporting indicates the site\u2019s enforcement entries carry dates pre-dated relative to their posting; I seek the underlying dated instruments. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true
        },
        {
          agencyId: "dhs",
          summary: "DHS \u2014 the ~278,000 non-citizen voter-roll review + the election-system cyber-vulnerability briefing",
          subject: "FOIA Request: DHS non-citizen voter-roll analysis and election-system cyber-vulnerability briefing materials",
          records: "I request: (1) the DHS analysis or report identifying approximately 278,000 non-citizens on US voter rolls, referenced in the President\u2019s July 2026 address; and (2) the briefing materials for the DHS Secretary\u2019s stated briefing on voting-system cyber vulnerability referenced in the same period. These are discrete, described records, not a broad search. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "posthog-no-contract",
      categories: ["Surveillance & privacy"],
      entities: ["posthog", "gsa"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "The PostHog analytics software running on multiple federal .gov sites has no government contract on record (USASpending returns zero) and no FedRAMP authorization — the cloud-security clearance normally required for software handling federal users' data.",
      implication: "Behavioral-analytics software collecting data from federal-site visitors with no visible contract and no FedRAMP authorization. The procurement trail — including sub-threshold purchase-card buys that wouldn't appear on USASpending — is requestable.",
      sources: [
        { label: "USASpending (0 results)", url: "https://www.usaspending.gov" },
        { label: "FedRAMP Marketplace (not listed)", url: "https://marketplace.fedramp.gov" }
      ],
      requests: [
        {
          agencyId: "gsa",
          summary: "GSA — any FedRAMP authorization or federal purchase record for PostHog",
          subject: "FOIA Request: FedRAMP authorization and procurement records for PostHog analytics",
          records: "I request a copy of any FedRAMP authorization package, security assessment, or authorization-to-operate (ATO) on file for the analytics software PostHog, and any record of a federal contract, task order, or purchase-card transaction for PostHog, from January 1, 2025 to the date this request is processed. If no such records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "trumprx-input-capture",
      categories: ["Surveillance & privacy"],
      entities: ["posthog", "trumprx-gov"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "trumprx.gov runs PostHog with input-masking turned OFF and persistent per-person profiles — a configuration that can capture what visitors type (e.g., drug searches) and tie it to a lasting profile. The site's own privacy-policy.txt names PostHog.",
      implication: "A federal site configured to capture visitors' typed searches and link them to persistent profiles via a third-party tool. Its privacy review, data-processing terms, and what the analytics retains are requestable.",
      sources: [
        { label: "Live JavaScript inspection", url: "" },
        { label: "trumprx.gov privacy-policy.txt", url: "" }
      ],
      requests: [
        {
          agencyId: "omb",
          summary: "OMB — privacy review / data-processing records for analytics on trumprx.gov",
          subject: "FOIA Request: privacy review and data-processing records for PostHog analytics on trumprx.gov",
          records: "I request a copy of any Privacy Impact Assessment, privacy review, or data-processing agreement governing the use of PostHog analytics (including any input-capture or session-recording features) on trumprx.gov, from January 1, 2025 to the date this request is processed. If no such records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "bondi-list-reversal",
      categories: ["Human trafficking"],
      entities: ["epstein", "bondi", "doj"],
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "On Feb 21, 2025, Attorney General Pam Bondi said an Epstein \"client list\" was \"sitting on my desk right now to review\"; less than five months later, the July 7 DOJ/FBI memo concluded no client list existed.",
      implication: "A public reversal by the Attorney General — from \"on my desk\" to \"does not exist.\" The records she was reviewing in February, and the basis for the July conclusion, are requestable from DOJ.",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" },
        { label: "Unlimited Hangout — First Friends, Part 2 (the First Couple's consigliere)", url: "https://unlimitedhangout.com/2025/08/investigative-series/first-friendspt2/" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — covers the Attorney General's office",
          summary: "DOJ — the records behind Bondi's \"on my desk\" → \"no list\" reversal",
          subject: "FOIA Request: Epstein records reviewed by the Attorney General (Feb 2025) and the basis for the July 2025 no-client-list conclusion",
          records: "I request a copy of any records reflecting the Epstein-related material the Attorney General referenced as being \"on my desk\" for review in February 2025, and any memorandum or analysis stating the basis for the July 7, 2025 conclusion that no Epstein client list exists, dated between January 1 and July 31, 2025. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04062 (filed Jul 16, 2026); confirmed by the request-receipt PDF. Determination pending."
        }
      ]
    },
    {
      id: "butler-investigation",
      categories: ["Butler shooting"],
      entities: ["fbi", "crooks", "trump", "bongino"],
      investigator: "Tucker Carlson (on Mario Nawfal), via Candace Owens",
      investigatorLinks: [
        { label: "Mario Nawfal × Tucker Carlson", url: "https://www.youtube.com/watch?v=seaUXVin4Gw" },
        { label: "Candace — Ep 348", url: "https://www.youtube.com/watch?v=WoXd4oLwd3w" }
      ],
      status: "reported",
      finding: "Tucker Carlson claimed (on Mario Nawfal's show, replayed by Candace Owens) that \"Trump shut down the investigation into Butler\" — the July 13, 2024 assassination attempt at Trump's Butler, Pennsylvania rally — attributing the account to Dan Bongino, whom he described as \"terrified.\" Carlson also said he came into possession of social-media posts attributed to shooter Thomas Matthew Crooks, from before the shooting, that the FBI had said did not exist. Candace separately raised whether the attempt had been staged.",
      implication: "Two testable records here: (1) if the federal investigation into a presidential assassination attempt was halted or curtailed, its case status and any closure directive would be on record; and (2) if the FBI identified Crooks' social-media posts after saying none existed, the records cataloguing those accounts would exist. Single-source, secondhand claims (Tucker via Candace); \"staged\" is an open question Candace polled, not a finding — these requests are what would test the assertions.",
      sources: [
        { label: "Mario Nawfal × Tucker Carlson interview", url: "https://www.youtube.com/watch?v=seaUXVin4Gw" },
        { label: "Candace Owens, Ep 348 (@1:26)", url: "https://www.youtube.com/watch?v=WoXd4oLwd3w" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — status / closure records for the Butler shooting investigation",
          subject: "FOIA Request: investigative status and any closure directive for the July 13, 2024 Butler assassination attempt",
          records: "I request a copy of any records reflecting the current investigative status of, or any directive to close, halt, or curtail, the FBI's investigation into the July 13, 2024 assassination attempt on Donald Trump in Butler, Pennsylvania — including any final case-disposition or closure memorandum. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "fbi",
          summary: "FBI — records of Thomas Matthew Crooks' social-media accounts/posts identified in the investigation",
          subject: "FOIA Request: records of Thomas Matthew Crooks' social-media accounts and posts in the Butler shooting investigation",
          records: "I request a copy of any records identifying or compiling social-media accounts or posts attributed to Thomas Matthew Crooks (the deceased July 13, 2024 Butler shooter) that were identified, collected, or analyzed during the FBI's investigation of that shooting — including any internal summary, list, or log of such accounts and posts and the date each was identified. To keep this request narrow and minimize search burden, I am not seeking general email correspondence or unrelated third parties' private information.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "flock-federal-alpr",
      categories: ["Surveillance & privacy"],
      entities: ["flock", "fbi", "doj"],
      investigator: "Tommy G (on Julian Dorey's podcast)",
      investigatorLinks: [
        { label: "Julian Dorey × Tommy G — Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" },
        { label: "Mrgunsngear — CT FOIA: 500k+ third-party accesses to one town's Flock data in 9 weeks", url: "https://x.com/Mrgunsngear/status/2078501504823017815" }
      ],
      status: "reported",
      finding: "Tommy G and tech journalist Ben Jordan investigated Flock Safety, whose automated license-plate-reader (ALPR) cameras — voted in piecemeal by local city councils and sheriffs — feed a national network, with new \"scope-creep\" updates reportedly adding audio and facial capabilities. Federal agencies (e.g., the U.S. Marshals) tap the network to locate people.",
      implication: "A privately-run national surveillance network that local bodies opt into piecemeal, increasingly queried by federal law enforcement. The federal access agreements and query/audit logs — not the local camera contracts — are the requestable federal records. (Unlimited Hangout reports ICE has no direct Flock contract and instead sources the data by making requests to local law enforcement — an indirect route that leaves exactly the policy and request records this card asks for.) A July 2026 Connecticut municipal FOIA sharpened the point: third parties — credit-card and cell-phone companies, \"alphabet agencies,\" retailers, foreign governments — accessed one town's Flock data over 500,000 times in nine weeks, and Flock \"could not guarantee\" it isn't sharing with federal agencies; CT towns also learned they can't switch the cameras off, owning neither the hardware nor the data. The document behind that number is the Flock access / network-audit log, obtainable through ordinary state and local records law — the local mirror of the federal access records this card targets, and the template for a per-jurisdiction audit-log request anywhere Flock operates.",
      sources: [
        { label: "Tommy G × Julian Dorey, Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" },
        { label: "Ben Jordan — Flock reporting", url: "" },
        { label: "OrwellDay — Cleveland Council finds a \"side door\" in Flock's architecture", url: "https://x.com/OrwellDay/status/2078464389552685440" },
        { label: "OrwellDay — Flock tracks phones via Bluetooth (demo)", url: "https://x.com/OrwellDay/status/2078128018736746692" },
        { label: "Unlimited Hangout — The Rise of the Military Retail Industrial Complex", url: "https://unlimitedhangout.com/2026/05/investigative-reports/the-military-retail-industrial-complex/" }
      ],
      requests: [
        {
          agencyId: "usms",
          component: "U.S. Marshals Service (USMS)",
          summary: "DOJ — US Marshals / FBI access agreements with Flock Safety's ALPR network",
          subject: "FOIA Request: U.S. Marshals Service and FBI access to Flock Safety's ALPR network",
          records: "I request a copy of any contract, memorandum of understanding, data-sharing agreement, or access-and-audit policy governing the U.S. Marshals Service's and/or the FBI's access to or use of Flock Safety's automated license-plate-reader (ALPR) network, in effect between January 1, 2024 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04063 (filed Jul 16, 2026); confirmed by the request-receipt PDF (USMS/FBI Flock ALPR access agreement). Determination pending."
        },
        {
          agencyId: "dhs",
          component: "ICE — Immigration and Customs Enforcement (in SecureRelease's component picker)",
          summary: "DHS/ICE — policy and request records for obtaining Flock ALPR data via local law enforcement",
          subject: "FOIA Request: ICE policy and request records concerning Flock Safety ALPR data obtained through state and local law enforcement",
          records: "I request a copy of any policy memorandum, guidance document, directive, or standard request form or template governing U.S. Immigration and Customs Enforcement's acquisition or use of automated license-plate-reader (ALPR) data from Flock Safety systems by way of requests to state or local law enforcement agencies, together with any log, register, or audit record of such requests, dated between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "us-israel-military-merger",
      categories: ["Israel / foreign influence"],
      entities: ["israel", "netanyahu", "dod", "state-dept"],
      investigator: "Tommy G (on Julian Dorey's podcast)",
      investigatorLinks: [
        { label: "Julian Dorey × Tommy G — Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" }
      ],
      status: "reported",
      finding: "Tommy G reports that proposed legislation (he cites Sections 224 and 226), co-led by Rep. Adam Smith (D) and Rep. Mike Rogers (R), would deeply integrate U.S. and Israeli military and defense-industrial operations — allowing Israeli firms to operate here, adding broad data-sharing, and reducing the requirement to notify Congress and the public about aid to Israel. Netanyahu reportedly claimed credit for the framework.",
      implication: "The bill itself sits in Congress (FOIA-exempt), but the executive-branch side is requestable: any U.S.-Israel defense-integration framework, the arms/financing records, and any provision reducing aid-notification transparency. (Proposed legislation may change; \"merger\" is Tommy G's framing; U.S.-Israel defense cooperation is longstanding and bipartisan.)",
      sources: [
        { label: "Tommy G × Julian Dorey, Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" },
        { label: "James Li (51/49) — corroborating (cites §219, formerly §224)", url: "https://www.youtube.com/watch?v=VhMAv7PkTaE" },
        { label: "Tucker Carlson on Mario Nawfal — corroborating (cites §226/224 NDAA)", url: "https://www.youtube.com/watch?v=seaUXVin4Gw" },
        { label: "Unlimited Hangout — Palestine: \"Peace to Prosperity\" Through Technocracy", url: "https://unlimitedhangout.com/2023/12/investigative-reports/palestine-peace-to-prosperity-through-technocracy/" }
      ],
      requests: [
        {
          agencyId: "dod",
          summary: "DoD / DSCA — the U.S.-Israel defense-integration framework + arms/financing records",
          subject: "FOIA Request: U.S.-Israel defense-industrial integration framework and security-assistance records",
          records: "I request a copy of any interagency agreement, memorandum of understanding, framework document, or implementation plan held by the Office of the Secretary of Defense or the Defense Security Cooperation Agency concerning the integration of U.S. and Israeli military or defense-industrial operations — including any provision permitting Israeli defense firms to operate in the United States, and any change to the notification requirements for security assistance to Israel — dated between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "state",
          summary: "State / PM — Israeli defense-firm U.S. operations + aid-notification changes",
          subject: "FOIA Request: State Department records on U.S.-Israel defense integration and aid-notification provisions",
          records: "I request a copy of any agreement, policy memorandum, or framework document held by the Bureau of Political-Military Affairs concerning the establishment or operation of Israeli defense or weapons-manufacturing firms in the United States, and any record concerning changes to congressional or public notification requirements for security assistance to Israel, dated between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "us-israel-aid-to-partnership-mou",
      categories: ["Israel / foreign influence"],
      entities: ["israel", "netanyahu", "state-dept", "dod"],
      investigator: "James Li (51/49)",
      investigatorLinks: [
        { label: "James Li (51/49) — \"We aren't just funding Israel. (It's way worse)\"", url: "https://www.youtube.com/watch?v=VhMAv7PkTaE" }
      ],
      status: "reported",
      finding: "James Li reports — and reads aloud — a letter he attributes to Israeli PM Benjamin Netanyahu, addressed to Rep. Marlin Stutzman (R-IN), endorsing a plan to \"shift the framework for U.S.-Israel defense cooperation from aid to partnership.\" The letter references a May 27, 2026 meeting in Jerusalem and a new memorandum of understanding that would draw down U.S. financial military assistance over the next decade and replace it with joint co-development, co-production, and mutual investment (advanced missile defense, AI, unmanned systems, cyber, next-gen platforms).",
      implication: "A new U.S.-Israel MOU replacing the current aid framework would be negotiated by the executive branch (State and DoD), so the draft MOU or framework document and any U.S. record of the May 27, 2026 Jerusalem meeting are requestable — even though Congress's role isn't. (The letter and its authenticity are Li's reporting; U.S.-Israel security cooperation is longstanding and bipartisan, and the current 2016 ten-year MOU runs through 2028 — a successor framework is a normal, expected negotiation.)",
      sources: [
        { label: "James Li (51/49)", url: "https://www.youtube.com/watch?v=VhMAv7PkTaE" },
        { label: "Unlimited Hangout — Isabel Maxwell: Israel's \"Back Door\" Into Silicon Valley", url: "https://unlimitedhangout.com/2020/07/investigative-reports/isabel-maxwell-israels-back-door-into-silicon-valley/" }
      ],
      requests: [
        {
          agencyId: "state",
          summary: "State / PM — the draft successor U.S.-Israel MOU + the May 27, 2026 Jerusalem meeting record",
          subject: "FOIA Request: successor U.S.-Israel defense-cooperation MOU and May 2026 Jerusalem meeting records",
          records: "I request a copy of any draft or final memorandum of understanding, framework document, or term sheet held by the Bureau of Political-Military Affairs concerning a successor to the 2016 U.S.-Israel Memorandum of Understanding on military assistance — specifically any instrument shifting U.S.-Israel defense cooperation from financial aid to co-development, co-production, or joint investment — together with any meeting record, readout, or memorandum of conversation for the May 27, 2026 meeting in Jerusalem between U.S. and Israeli officials on this subject, from January 1, 2026 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "dod",
          summary: "DoD / DSCA — the successor security-assistance framework + aid-drawdown plan",
          subject: "FOIA Request: successor U.S.-Israel security-assistance framework and aid-drawdown records",
          records: "I request a copy of any memorandum of understanding, framework document, or implementation plan held by the Office of the Secretary of Defense or the Defense Security Cooperation Agency concerning a successor to the 2016 U.S.-Israel military-assistance MOU, including any plan to draw down U.S. financial military assistance to Israel over a multi-year period and replace it with co-development, co-production, or joint-investment arrangements, from January 1, 2026 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "us-israel-intel-sharing-622",
      categories: ["Israel / foreign influence"],
      entities: ["israel", "tom-cotton", "odni", "dod"],
      investigator: "James Li (51/49) and Trita Parsi (on The Young Turks)",
      investigatorLinks: [
        { label: "James Li (51/49) — \"We aren't just funding Israel.\"", url: "https://www.youtube.com/watch?v=VhMAv7PkTaE" },
        { label: "The Young Turks — Trita Parsi on the right's turn against Israel", url: "https://www.youtube.com/watch?v=fKBdYHghWYY" }
      ],
      status: "reported",
      finding: "Both James Li and Trita Parsi (on TYT) point to Section 622 of a 192-page intelligence authorization bill, titled \"United States-Israel Intelligence Sharing Enhancement\" and attributed to Sen. Tom Cotton. It would direct the President — acting through the Director of National Intelligence and, as necessary, the Secretary of Defense — to expand intelligence sharing with the Government of Israel, while restricting any suspension or reduction of that sharing absent a specific national-security determination reported to Congress.",
      implication: "The bill text itself is a legislative product (not FOIA-able), but the executive branch already operates under existing U.S.-Israel intelligence-sharing arrangements that such a provision would lock in — and those instruments are records. A FOIA can surface whether a current intelligence-sharing agreement or MOU with Israel exists and its governing scope. (Caveat: intelligence-sharing records are frequently withheld under national-security exemptions or met with a Glomar response; this request seeks the existence and governing instrument, not classified content. The reading of Section 622 is Li's and Parsi's; the provision was in draft as reported.)",
      sources: [
        { label: "James Li (51/49)", url: "https://www.youtube.com/watch?v=VhMAv7PkTaE" },
        { label: "The Young Turks (Parsi) — cites Responsible Statecraft", url: "https://www.youtube.com/watch?v=fKBdYHghWYY" },
        { label: "Unlimited Hangout — Another Mega Group Spy Scandal? Samanage, Sabotage, and the SolarWinds Hack", url: "https://unlimitedhangout.com/2021/01/investigative-reports/another-mega-group-spy-scandal-samanage-sabotage-and-the-solarwinds-hack/" }
      ],
      requests: [
        {
          agencyId: "odni",
          summary: "ODNI — any existing U.S.-Israel intelligence-sharing agreement/MOU and its governing terms",
          subject: "FOIA Request: existing U.S.-Israel intelligence-sharing agreement or memorandum of understanding",
          records: "I request a copy of any currently effective agreement, memorandum of understanding, or written arrangement between the U.S. Intelligence Community and the Government of Israel that governs the sharing of intelligence, including any unclassified governing instrument, annex, or implementing directive identifying its scope and the conditions under which sharing may be suspended or reduced. I am requesting the governing instrument(s) and their non-exempt terms, not the underlying shared intelligence itself. To keep this request narrow, I am not seeking general email correspondence. If responsive records are withheld in full, I request a description of each withheld record and the specific exemption claimed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "trump-jr-osc-loan",
      categories: ["Conflict of interest"],
      entities: ["trump-jr", "dod"],
      investigator: "Tommy G",
      investigatorLinks: [
        { label: "Tommy G — \"Investigating How the Pentagon Wastes Trillions\"", url: "https://www.youtube.com/watch?v=ZsCUvzD_vqY" }
      ],
      status: "reported",
      finding: "Tommy G reports that a startup co-founded by Donald Trump Jr. received a roughly $626 million Pentagon award — described as the single largest loan ever issued by the Department of Defense's Office of Strategic Capital (taxpayer-funded).",
      implication: "A loan of this size, from a DoD financing office, to a venture tied to the President's son is exactly what conflict-of-interest review and award-selection records exist to document. The loan agreement, application, selection memos, and any ethics screening are requestable.",
      sources: [
        { label: "Tommy G — Pentagon waste investigation", url: "https://www.youtube.com/watch?v=ZsCUvzD_vqY" },
        { label: "Unlimited Hangout — The Secret History of Polymarket, Part 1", url: "https://unlimitedhangout.com/2026/06/investigative-series/the-secret-history-of-polymarket-part-1/" }
      ],
      requests: [
        {
          agencyId: "dod",
          summary: "DoD / Office of Strategic Capital — the loan agreement + selection + ethics review",
          subject: "FOIA Request: Office of Strategic Capital loan to a startup co-founded by Donald Trump Jr.",
          records: "I request a copy of the loan or award agreement, application, selection or scoring memoranda, and any conflict-of-interest or ethics screening for the Department of Defense Office of Strategic Capital award (reported at approximately $626 million) to a startup co-founded by Donald Trump Jr., from January 1, 2025 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "checkpoint-federal-footprint",
      categories: ["Israel / foreign influence", "Surveillance & privacy"],
      entities: ["check-point", "shlomo-kramer", "unit-8200", "israel", "gsa"],
      investigator: "Tommy G",
      investigatorLinks: [
        { label: "Tommy G — \"What Every American Should Know about Data Centers\"", url: "https://www.youtube.com/watch?v=MHJtIkfA-s8" }
      ],
      status: "reported",
      finding: "Tommy G reports that Check Point — an Israeli cybersecurity firm founded by Shlomo Kramer, a veteran of the IDF's Unit 8200 (Israel's NSA-equivalent) — serves as a security gatekeeper for nearly every top-50 Fortune 500 company (a data-center whistleblower said it monitors all employee communications), and Kramer publicly argued the U.S. should \"limit the First Amendment.\"",
      implication: "If a firm tied to a foreign signals-intelligence unit secures major U.S. infrastructure, its footprint in federal systems is a public-records question: which federal agencies use Check Point, under what authorizations, and with what data-access or monitoring scope. (Check Point is a mainstream, widely-used vendor and foreign-headquartered security vendors are common and can be FedRAMP-authorized — the request simply surfaces the federal specifics.)",
      sources: [
        { label: "Tommy G — data-centers investigation", url: "https://www.youtube.com/watch?v=MHJtIkfA-s8" },
        { label: "Unlimited Hangout — Why a Shadowy Tech Firm With Ties to Israeli Intelligence Is Running Doomsday Election Simulations", url: "https://unlimitedhangout.com/2020/01/investigative-series/why-a-shadowy-tech-firm-with-ties-to-israeli-intelligence-is-running-doomsday-election-simulations/" },
        { label: "Unlimited Hangout — Another Mega Group Spy Scandal? Samanage, Sabotage, and the SolarWinds Hack", url: "https://unlimitedhangout.com/2021/01/investigative-reports/another-mega-group-spy-scandal-samanage-sabotage-and-the-solarwinds-hack/" }
      ],
      requests: [
        {
          agencyId: "gsa",
          summary: "GSA / FedRAMP — Check Point's federal authorization + which agencies deploy it",
          subject: "FOIA Request: FedRAMP authorization and federal deployment of Check Point cybersecurity products",
          records: "I request a copy of the FedRAMP authorization package(s) and any agency authorization-to-operate (ATO) on file for Check Point Software products, including the list of federal agencies covered by each such authorization. (I am requesting the FedRAMP/ATO records themselves — discrete, catalogued documents — not every agency's deployment details.) If no such records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "save-system-voter-database",
      categories: ["Elections & voting", "Surveillance & privacy"],
      entities: ["dhs", "save-system"],
      investigator: "More Perfect Union",
      investigatorLinks: [
        { label: "More Perfect Union — \"The Shocking Billionaire Plot To Steal The Election\"", url: "https://www.youtube.com/watch?v=GUHm6MfnPvw" }
      ],
      status: "reported",
      finding: "More Perfect Union reports that a Trump executive order directs DHS to build a \"supercharged\" federal citizenship-and-voter-eligibility database (the \"SAVE System\"), forcing three federal agencies to assemble a national voter roll on a 60-day deadline — which experts say the government is not authorized by law to do and which produces false positives that flag citizens as noncitizens.",
      implication: "A federal database adjudicating who is eligible to vote — its design, legal authority, accuracy/error rates, and the agencies feeding it — are public records. (U.S. elections are constitutionally administered by the states, which sharpens the authorization question this request would document.)",
      sources: [
        { label: "More Perfect Union — election investigation", url: "https://www.youtube.com/watch?v=GUHm6MfnPvw" }
      ],
      requests: [
        {
          agencyId: "dhs",
          component: "USCIS — SAVE is a USCIS-administered program (USCIS FOIA runs through its own online account system)",
          summary: "DHS — the SAVE System / federal voter-citizenship database design + legal authority",
          subject: "FOIA Request: the SAVE System federal citizenship and voter-eligibility verification database",
          records: "I request a copy of the following records for the SAVE System (the federal citizenship/voter-eligibility verification database): its design or architecture document(s), the legal-authority memorandum supporting its use for voter eligibility, any accuracy or false-positive-rate assessment, and the interagency agreement directing its creation, from January 1, 2025 to the date this request is processed. If no such records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "doj-state-voter-data",
      categories: ["Elections & voting"],
      entities: ["doj"],
      investigator: "More Perfect Union",
      investigatorLinks: [
        { label: "More Perfect Union — \"The Shocking Billionaire Plot To Steal The Election\"", url: "https://www.youtube.com/watch?v=GUHm6MfnPvw" }
      ],
      status: "reported",
      finding: "More Perfect Union reports that the Department of Justice made unprecedented requests to states for sensitive voter information — including data on individual voters reportedly targeted for disenfranchisement — which roughly a dozen states complied with, while the administration sued 30 states plus the District of Columbia for refusing.",
      implication: "What the DOJ requested, the legal basis it asserted, and how it retains and uses voter data it obtained are federal records. (The lawsuits are public; the underlying request letters and data-handling policies are the requestable piece.)",
      sources: [
        { label: "More Perfect Union — election investigation", url: "https://www.youtube.com/watch?v=GUHm6MfnPvw" }
      ],
      requests: [
        {
          agencyId: "doj-crt",
          component: "Civil Rights Division — its Voting Section sent the state letters",
          summary: "DOJ — the request letters to states + legal basis + voter-data retention policy",
          subject: "FOIA Request: DOJ requests to states for voter-registration data and related data-handling",
          records: "I request a copy of the request letters the Department of Justice sent to U.S. states and the District of Columbia in 2025 seeking voter-registration or voter-eligibility data, the memorandum stating the legal authority asserted for those requests, and any written policy governing the retention, use, or sharing of voter data received in response, from January 1, 2025 to the date this request is processed. To keep this request narrow, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04064 (filed Jul 16, 2026); confirmed by the request-receipt PDF (DOJ letters to states for voter data). Determination pending."
        }
      ]
    },
    {
      id: "maralago-prostitute-party-tip",
      categories: ["Human trafficking"],
      entities: ["epstein", "maxwell", "trump", "mar-a-lago", "fbi"],
      investigator: "Sharlene Rochard & Molly Skye Brown (Epstein survivors) + the released Epstein files",
      investigatorLinks: [
        { label: "Rochard interview — \"The Briefing with Jen Psaki\" (MS NOW)", url: "https://www.youtube.com/watch?v=Yoi4aUZ0EDM" },
        { label: "Brown interview — Kim Iversen Show (Jun 2026)", url: "https://www.youtube.com/watch?v=OZk34l_4iZ8" },
        { label: "Raw Story coverage", url: "https://www.rawstory.com/donald-trump-jeffrey-epstein-2674617242/" }
      ],
      status: "reported",
      finding: "An FBI document in the released Epstein files records a tip describing a party \"for prostitutes\" at Mar-a-Lago tied to Donald Trump. Two Epstein survivors have separately spoken on the record: Sharlene Rochard, a former model, says she attended Mar-a-Lago parties as a young model; and Molly Skye Brown says she was lured in 2001 to an Epstein/Maxwell-connected Palm Beach party at which Ghislaine Maxwell announced the group was moving to Mar-a-Lago \"by personal invitation\" of Donald Trump — and that recently released DOJ files corroborate parts of her account.",
      implication: "The tip and any FBI follow-up are federal records. A FOIA can surface the full, unredacted document and whether the tip was ever investigated. (These are third-party tips and survivor recollections contained in or corroborated by the files, not adjudicated findings — and the survivors' broader accounts vary in verifiability; cited here only for the on-record statements that the party occurred. DOJ's July 2025 memo claimed no client list. Unlimited Hangout's First Friends series independently documents the surrounding circuitry in the same era — Epstein photographed at a 1995 Mar-a-Lago event, Trump circled in Rodriguez's black book, and the Trump–Zampolli–Brunel model-recruitment network — without mentioning this party or these survivors.)",
      sources: [
        { label: "Epstein files tip on Mar-a-Lago \"prostitute party\" (Yahoo)", url: "https://www.yahoo.com/news/articles/epstein-files-dump-reveals-tip-022850330.html" },
        { label: "Molly Skye Brown on the Kim Iversen Show (Jun 2026)", url: "https://www.youtube.com/watch?v=OZk34l_4iZ8" },
        { label: "Raw Story", url: "https://www.rawstory.com/donald-trump-jeffrey-epstein-2674617242/" },
        { label: "Unlimited Hangout — First Friends, Part 1 (Zampolli/Epstein model-recruitment network)", url: "https://unlimitedhangout.com/2025/07/investigative-series/first-friends-part1/" },
        { label: "Unlimited Hangout — First Friends, Part 2 (the First Couple's consigliere)", url: "https://unlimitedhangout.com/2025/08/investigative-series/first-friendspt2/" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the full unredacted Mar-a-Lago \"prostitute party\" tip document + any investigation",
          subject: "FOIA Request: FBI document and investigative file on the Mar-a-Lago \"prostitute party\" tip in the Epstein files",
          records: "I request a copy of the FBI document(s) referenced in the released Epstein files that record a tip describing a party \"for prostitutes\" at Mar-a-Lago, including the full unredacted record and any related lead sheet, investigative file, or disposition concerning that tip.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "epstein-cbp-officers",
      categories: ["Human trafficking"],
      entities: ["epstein", "cbp", "fbi"],
      investigator: "Unlimited Hangout (Webb & Goodwin) + the released Epstein files",
      investigatorLinks: [
        { label: "\"First Friends: How Andrew Farkas and an Emirati Sultan Helped Epstein Build a Smuggler's Paradise\"", url: "https://unlimitedhangout.com/2026/03/investigative-series/first-friends-how-andrew-farkas-and-an-emirati-sultan-helped-epstein-build-a-smugglers-paradise/" }
      ],
      status: "reported",
      finding: "Unlimited Hangout reports that the released Epstein files document Epstein's efforts to cultivate personal relationships with six U.S. customs officers in the U.S. Virgin Islands and Florida — three of them based at the USVI's main airport, Cyril E. King (STT), including one supervisor — offering free travel, financial advice, gifts, and employment opportunities; one officer solicited a \"hard-money loan\" from Epstein. Epstein reportedly sought to learn which officers would be on duty when he was traveling, and his relationship with one officer was extensive enough that the FBI opened an investigation into it in October 2019, months after his death.",
      implication: "A trafficking operation's logistics run through the border checkpoint, and these documents suggest the checkpoint was being cultivated. The FBI's October 2019 investigation and CBP's internal-integrity records are exactly the records that would show whether the government examined its own gatekeepers — and what it found. (The cultivation efforts are in the released files as reported by Unlimited Hangout; the FBI investigation's existence is reported there too, but its scope and outcome are unknown — that is what these requests test.)",
      sources: [
        { label: "Unlimited Hangout — First Friends: How Andrew Farkas and an Emirati Sultan Helped Epstein Build a Smuggler's Paradise", url: "https://unlimitedhangout.com/2026/03/investigative-series/first-friends-how-andrew-farkas-and-an-emirati-sultan-helped-epstein-build-a-smugglers-paradise/" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the October 2019 investigation of Epstein's relationship with a customs officer",
          subject: "FOIA Request: FBI records of the October 2019 investigation concerning Jeffrey Epstein's relationship with a U.S. Customs and Border Protection officer",
          records: "I request a copy of the case-opening and case-closing documentation, and any final investigative report or summary memorandum, of the Federal Bureau of Investigation's investigation opened in or around October 2019 concerning Jeffrey Epstein's relationship with a U.S. Customs and Border Protection officer, as referenced in materials released from the Epstein files. Jeffrey Epstein is deceased, extinguishing his personal-privacy interests; I am not seeking the names of the officers involved, which may be redacted. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "dhs",
          component: "CBP — Customs and Border Protection (in SecureRelease's component picker)",
          summary: "DHS/CBP — Office of Professional Responsibility records on Epstein's contacts with customs officers",
          subject: "FOIA Request: CBP Office of Professional Responsibility records concerning Jeffrey Epstein's contacts with CBP personnel",
          records: "I request a copy of any Office of Professional Responsibility (or predecessor Internal Affairs) investigation record, integrity or misconduct referral, or security referral held by U.S. Customs and Border Protection concerning Jeffrey Epstein's contacts or relationships with CBP officers stationed in the U.S. Virgin Islands (including Cyril E. King Airport) or Florida, dated between January 1, 2015 and December 31, 2020. Jeffrey Epstein is deceased, extinguishing his personal-privacy interests; I am not seeking the names of the officers involved, which may be redacted. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "doj-antisemitism-task-force",
      categories: ["Israel / foreign influence", "Civil liberties"],
      entities: ["doj", "leo-terrell", "israel"],
      investigator: "Ian Carroll",
      investigatorLinks: [
        { label: "Ian Carroll (video)", url: "https://www.youtube.com/watch?v=vkYVyuYDDmA" }
      ],
      status: "reported",
      finding: "Ian Carroll reports that Leo Terrell — a Department of Justice official who chairs the DOJ Task Force to Combat Antisemitism — publicly vowed on social media to make a private citizen \"permanently unemployable\" over the person's speech, tagging employers.",
      implication: "A federal task force, and a DOJ official invoking it to target an individual for speech, raise public-records and civil-liberties questions: the task force's charter and mandate, the criteria it applies, the individuals/organizations/cases it has acted on, and any coordination with outside advocacy groups. (Combating antisemitism is the task force's stated civil-rights mission; this request concerns its scope, targets, and transparency — not the mission itself.)",
      sources: [
        { label: "Ian Carroll (video)", url: "https://www.youtube.com/watch?v=vkYVyuYDDmA" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — the task force sits at department leadership level",
          summary: "DOJ — the antisemitism task force's charter, targets, and outside-group coordination",
          subject: "FOIA Request: charter, scope, and case activity of the DOJ Task Force to Combat Antisemitism",
          records: "I request a copy of the charter, mission statement, and operating procedures of the Department of Justice Task Force to Combat Antisemitism; any list or log of individuals, organizations, or cases it has investigated, referred, or taken action on; and any records of its coordination with outside advocacy organizations, dated from January 1, 2025 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04065 (filed Jul 16, 2026); confirmed by the request-receipt PDF. Determination pending."
        }
      ]
    },
    {
      id: "fbi-adl-relationship",
      categories: ["Civil liberties", "Surveillance & privacy"],
      entities: ["fbi", "adl", "kash-patel", "charlie-kirk"],
      investigator: "Public reporting",
      investigatorLinks: [
        { label: "Al Jazeera — FBI cuts ties with ADL", url: "https://www.aljazeera.com/news/2025/10/2/fbi-cuts-ties-with-anti-defamation-league-amid-conservative-backlash" }
      ],
      status: "confirmed",
      finding: "The FBI maintained a decades-long partnership with the Anti-Defamation League — the ADL trained FBI agents (reportedly every new agent since 2000) and fed the Bureau extremism \"tips\" for years. In October 2025, FBI Director Kash Patel terminated the relationship, accusing the ADL of \"spying on conservative groups\" after it listed Charlie Kirk's Turning Point USA as \"extremist.\"",
      implication: "A private advocacy group feeding referrals and training into federal law enforcement for decades raises core civil-liberties questions: which U.S. individuals and organizations the ADL flagged to the FBI, what the Bureau did with that information, and the basis for both the partnership and its abrupt termination. Those are federal records.",
      sources: [
        { label: "Al Jazeera (Oct 2025)", url: "https://www.aljazeera.com/news/2025/10/2/fbi-cuts-ties-with-anti-defamation-league-amid-conservative-backlash" },
        { label: "Washington Examiner", url: "https://www.washingtonexaminer.com/news/investigations/3833964/patel-ends-fbi-partnership-political-front-adl/" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — its ADL agreements, the tips/referrals the ADL provided, and the termination basis",
          subject: "FOIA Request: FBI's relationship with the Anti-Defamation League and the October 2025 termination",
          records: "I request a copy of: (1) any memorandum of understanding, partnership agreement, or information-sharing agreement between the FBI and the Anti-Defamation League in effect during 2015–2025; and (2) the records underlying FBI Director Kash Patel's October 2025 decision to terminate that relationship, including the determination or memorandum stating the basis for the finding that the ADL was \"spying on conservative groups.\" To keep this request narrow, I am not seeking the full historical body of ADL tips or general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "bondi-media-guidelines-rollback",
      categories: ["Press freedom"],
      entities: ["bondi", "doj"],
      investigator: "Ian Carroll",
      investigatorLinks: [
        { label: "\"A Free Press: DOJ goes after the first amendment\"", url: "https://www.youtube.com/watch?v=bxNNY9FtPVs" }
      ],
      status: "confirmed",
      finding: "In April 2025, Attorney General Pam Bondi issued a memo rescinding the Garland-era policy that protected journalists in leak investigations — again allowing federal investigators to pursue reporters' communications.",
      implication: "The internal DOJ guardrail requiring senior approval before subpoenaing journalists' records was rolled back by memorandum, clearing the path for the grand-jury subpoenas of Washington Post and Wall Street Journal reporters that followed.",
      sources: [
        { label: "Washington Post / AP (Apr 2025)", url: "" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — Attorney General-issued policy",
          summary: "DOJ — the Bondi memo + revised news-media guidelines (28 C.F.R. § 50.10)",
          subject: "FOIA Request: April 2025 Attorney General memorandum revising the news-media policy (28 C.F.R. § 50.10)",
          records: "I request a copy of the memorandum issued by Attorney General Pamela Bondi in or around April 2025 that rescinded or revised the Department's policy governing the use of subpoenas, search warrants, and other compulsory legal process directed at members of the news media (the policy reflected at 28 C.F.R. § 50.10), together with the current superseding policy text. This is a request for specific, discrete, catalogued policy documents — not general email correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04066 (filed Jul 16, 2026); confirmed by the request-receipt PDF. Determination pending."
        }
      ]
    },
    {
      id: "wapo-reporter-home-raid-2026",
      categories: ["Press freedom"],
      entities: ["fbi", "doj", "washington-post"],
      investigator: "Ian Carroll",
      investigatorLinks: [
        { label: "\"A Free Press: DOJ goes after the first amendment\"", url: "https://www.youtube.com/watch?v=bxNNY9FtPVs" }
      ],
      status: "confirmed",
      finding: "In January 2026 the DOJ executed a search at a Washington Post reporter's home as part of a criminal leak investigation of a government contractor already charged with disclosing national-security information.",
      implication: "A search warrant served on a working journalist's residence — an escalation beyond subpoenas — tied to an already-charged contractor leak case whose docket and warrant affidavit are matters of record.",
      sources: [
        { label: "Washington Post (Jan 2026)", url: "" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the search-warrant application, affidavit, and return for the reporter's residence",
          subject: "FOIA Request: search-warrant application and affidavit for the January 2026 search of a Washington Post reporter's residence",
          records: "I request a copy of the search-warrant application, supporting affidavit, and warrant return for the January 2026 search of the residence of a Washington Post journalist conducted in connection with a criminal investigation into the unauthorized disclosure of national-security information by a government contractor. I request only the warrant package and return — discrete, catalogued case documents — not general investigative files or email correspondence.",
          ask_no_records: true,
          filed: "PENDING — filed Jul 18, 2026 via the FBI eFOIPA portal (efoia.fbi.gov); request receipt saved to the Hearth foia-mail folder. FOIPA number to follow. This is the FBI half (the warrant package); the DOJ half below — the § 50.10 senior-official authorization — still needs FOIA STAR.",
        },
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — § 50.10 authorizations run through department leadership",
          summary: "DOJ — the senior-official authorization required to target a journalist",
          subject: "FOIA Request: news-media-policy authorization for the January 2026 search of a Washington Post reporter's residence",
          records: "I request a copy of the written authorization, approval memorandum, or certification required under the Department's news-media policy (28 C.F.R. § 50.10) for the January 2026 search of a Washington Post reporter's residence — specifically the Attorney General or designated senior-official approval documenting that the policy's requirements were satisfied. This is a request for a specific, discrete approval record, not general correspondence.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04079 (filed Jul 18, 2026); receipt PDF on the Hearth. DOJ Section 50.10 news-media authorization. Determination pending. (The FBI half was filed via eFOIPA — see the request above.)"
        }
      ]
    },
    {
      id: "iran-airman-rescue-op-2025",
      categories: ["Press freedom", "Military ops"],
      entities: ["dod", "iran", "washington-post"],
      investigator: "Ian Carroll",
      investigatorLinks: [
        { label: "\"A Free Press: DOJ goes after the first amendment\"", url: "https://www.youtube.com/watch?v=bxNNY9FtPVs" }
      ],
      status: "confirmed",
      finding: "The leak that triggered the 2026 reporter subpoenas concerned a 2025 U.S. operation — framed publicly as a downed-airman rescue — that reporters noted occurred conspicuously near Iranian nuclear facilities and reportedly ended with U.S. forces destroying their own equipment in place.",
      implication: "A large personnel-and-aircraft operation, officially a pilot rescue, sited next to nuclear facilities and ending in self-destruction of equipment — the embarrassment the leak investigation appears aimed at, more than any genuine source-protection harm. The operational core is classified, but property-accountability and cost records are a different, more disclosable category.",
      sources: [
        { label: "Washington Post / Wall Street Journal reporting (2025)", url: "" }
      ],
      requests: [
        {
          agencyId: "dod",
          summary: "DoD — equipment loss / destruction-in-place & cost records (disclosable portions only)",
          subject: "FOIA Request: equipment loss, destruction-in-place, and cost records for the 2025 personnel-recovery operation in or near Iran",
          records: "I request copies of unclassified or reasonably segregable records documenting the loss, abandonment, or deliberate destruction-in-place of U.S. government equipment during the personnel-recovery (downed-aircrew) operation conducted in or near Iran in approximately 2025 — specifically property-accountability records such as financial liability investigations of property loss (reports of survey) and any summary of the replacement or acquisition cost of the destroyed equipment. I am not requesting classified operational details, sources, methods, locations, or tactics; please release all reasonably segregable non-exempt portions, including aggregate cost figures and property-accountability summaries.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "erebor-occ-charter",
      categories: ["Conflict of interest"],
      entities: ["erebor", "occ", "jonathan-gould", "thiel", "lonsdale", "palmer-luckey"],
      investigator: "Unlimited Hangout (Webb & Goodwin)",
      investigatorLinks: [
        { label: "The Praxian Kill Chain — Part 1", url: "https://unlimitedhangout.com/2026/04/investigative-series/praxian-kill-chain-part-1/" },
        { label: "The Praxian Genocidal Kill Chain — Part 2", url: "https://unlimitedhangout.com/2026/05/investigative-series/the-praxian-genocidal-kill-chain-part-2/" }
      ],
      status: "confirmed",
      finding: "Erebor Bank — a digital-asset-focused bank founded by Palmer Luckey and Joe Lonsdale, with backing from Peter Thiel's Founders Fund, and pitched as filling the gap left by the collapse of Silicon Valley Bank — applied to the Office of the Comptroller of the Currency for a de novo national bank charter on June 11, 2025 and won conditional approval about four months later, on October 15, 2025. It was the first de novo national bank charter conditionally approved under Trump-appointed Comptroller Jonathan V. Gould.",
      implication: "An unusually fast charter for a bank whose founders and backers sit at the center of the administration's defense-tech network, granted by a newly installed Comptroller. The decision file is a named, disclosable federal record: the charter application, the OCC's licensing analysis and decision documents, and any records reflecting expedited or priority handling would show what the review actually weighed and how quickly it moved.",
      sources: [
        { label: "OCC news release NR-OCC-2025-101 — conditional approval for chartering Erebor Bank", url: "https://www.occ.gov/news-issuances/news-releases/2025/nr-occ-2025-101.html" },
        { label: "Banking Dive — Erebor Bank receives national bank charter", url: "https://www.bankingdive.com/news/erebor-bank-receives-national-bank-charter/811724/" },
        { label: "Unlimited Hangout — The Praxian Kill Chain, Part 1", url: "https://unlimitedhangout.com/2026/04/investigative-series/praxian-kill-chain-part-1/" }
      ],
      requests: [
        {
          agencyId: "occ",
          summary: "OCC — Erebor's charter application and the licensing decision file",
          subject: "FOIA Request: charter application and licensing decision records for Erebor Bank, National Association",
          records: "I request a copy of the de novo national bank charter application submitted by Erebor Bank, National Association (Columbus, Ohio) on or about June 11, 2025, together with the OCC's licensing decision documents supporting its conditional approval announced October 15, 2025 (NR-OCC-2025-101) — specifically the decision memorandum, the licensing analysis or summary of the licensing decision, the conditions imposed, and any records reflecting expedited, priority, or accelerated handling of the application. To keep this request narrow and minimize search burden, I am not seeking general email correspondence or internal deliberative drafts.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "cisa-cti-league",
      categories: ["Israel / foreign influence", "Surveillance & privacy"],
      entities: ["cisa", "cti-league", "unit-8200", "ohad-zaidenberg", "chris-krebs", "israel"],
      investigator: "Unlimited Hangout (Whitney Webb)",
      investigatorLinks: [
        { label: "Meet the IDF-Linked Cybersecurity Group Protecting US Hospitals 'Pro Bono'", url: "https://unlimitedhangout.com/2020/08/investigative-reports/meet-the-idf-linked-cybersecurity-group-protecting-us-hospitals-pro-bono/" }
      ],
      status: "reported",
      finding: "In April 2020, CISA — then led by Christopher Krebs — publicly announced a partnership with the COVID-19 CTI League, an anonymous international volunteer group co-founded by Ohad Zaidenberg, whom Unlimited Hangout identifies as a former Israeli military intelligence (Unit 8200) figure. The arrangement gave the group a working relationship with the U.S. agency responsible for defending healthcare and critical-infrastructure networks.",
      implication: "A federal cybersecurity agency taking on an information-sharing relationship with an anonymous, foreign-linked volunteer group operating around U.S. critical-infrastructure networks. Krebs announced the relationship publicly, so it isn't deniable — what's missing is the instrument: whatever agreement, onboarding, vetting, or information-sharing record memorializes the arrangement and what network access or data it involved.",
      sources: [
        { label: "Unlimited Hangout — Meet the IDF-Linked Cybersecurity Group Protecting US Hospitals 'Pro Bono' (Aug 2020)", url: "https://unlimitedhangout.com/2020/08/investigative-reports/meet-the-idf-linked-cybersecurity-group-protecting-us-hospitals-pro-bono/" }
      ],
      requests: [
        {
          agencyId: "cisa",
          component: "DHS Headquarters — covers CISA (in SecureRelease's component picker)",
          summary: "CISA — the agreement / onboarding / information-sharing record for the CTI League relationship",
          subject: "FOIA Request: CISA records memorializing its 2020 partnership or information-sharing relationship with the COVID-19 CTI League",
          records: "I request a copy of any memorandum of understanding, information-sharing agreement, onboarding or vetting record, terms of participation, or comparable instrument between the Cybersecurity and Infrastructure Security Agency (or DHS on its behalf) and the COVID-19 Cyber Threat Intelligence (CTI) League, dated between January 1, 2020 and December 31, 2021, together with any record describing what network access, data feeds, or threat-information exchange the relationship involved. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "cybereason-operation-blackout",
      categories: ["Elections & voting", "Israel / foreign influence"],
      entities: ["cybereason", "fbi", "dhs", "usss", "unit-8200", "israel"],
      investigator: "Unlimited Hangout (Whitney Webb)",
      investigatorLinks: [
        { label: "Why a Shadowy Tech Firm With Ties to Israeli Intelligence Is Running 'Doomsday' Election Simulations", url: "https://unlimitedhangout.com/2020/01/investigative-series/why-a-shadowy-tech-firm-with-ties-to-israeli-intelligence-is-running-doomsday-election-simulations/" }
      ],
      status: "reported",
      finding: "Cybereason — an Israeli-founded cybersecurity firm with Unit 8200 lineage — ran a series of tabletop exercises called 'Operation Blackout' simulating the collapse of a U.S. election, including a November 2019 iteration and an earlier July 2019 iteration in Boston. Unlimited Hangout reported that personnel from the FBI, DHS, and the U.S. Secret Service participated in the simulations, which ended with the government side unable to keep order.",
      implication: "A private, foreign-founded firm ran election-collapse war games in which federal law-enforcement and protective agencies took part. The exercise, the agencies, and the dates are all named — so the participation is a records question, not a mystery: the invitations, participation approvals, and any after-action or lessons-learned reports held by each agency would show who attended, under what authority, and what conclusions they drew.",
      sources: [
        { label: "Unlimited Hangout — Why a Shadowy Tech Firm ... Is Running 'Doomsday' Election Simulations (Jan 2020)", url: "https://unlimitedhangout.com/2020/01/investigative-series/why-a-shadowy-tech-firm-with-ties-to-israeli-intelligence-is-running-doomsday-election-simulations/" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — participation and after-action records for Cybereason's 2019 'Operation Blackout' election simulations",
          subject: "FOIA Request: FBI records of participation in Cybereason's 2019 'Operation Blackout' election simulations",
          records: "I request a copy of any invitation, participation approval or authorization, attendee list, and any after-action, lessons-learned, or trip report held by the FBI concerning the tabletop election-security exercises conducted by Cybereason known as 'Operation Blackout,' including the November 2019 exercise and the July 2019 exercise held in Boston, dated between January 1, 2019 and June 30, 2020. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "dhs",
          component: "DHS Headquarters (in SecureRelease's component picker)",
          summary: "DHS — participation and after-action records for the same Cybereason 'Operation Blackout' simulations",
          subject: "FOIA Request: DHS records of participation in Cybereason's 2019 'Operation Blackout' election simulations",
          records: "I request a copy of any invitation, participation approval or authorization, attendee list, and any after-action, lessons-learned, or trip report held by the Department of Homeland Security (including CISA) concerning the tabletop election-security exercises conducted by Cybereason known as 'Operation Blackout,' including the November 2019 exercise and the July 2019 exercise held in Boston, dated between January 1, 2019 and June 30, 2020. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "usss",
          component: "U.S. Secret Service (in SecureRelease's component picker)",
          summary: "USSS — participation and after-action records for the same Cybereason 'Operation Blackout' simulations",
          subject: "FOIA Request: U.S. Secret Service records of participation in Cybereason's 2019 'Operation Blackout' election simulations",
          records: "I request a copy of any invitation, participation approval or authorization, attendee list, and any after-action, lessons-learned, or trip report held by the U.S. Secret Service concerning the tabletop election-security exercises conducted by Cybereason known as 'Operation Blackout,' including the November 2019 exercise and the July 2019 exercise held in Boston, dated between January 1, 2019 and June 30, 2020. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "bin-sulayem-doj-redaction",
      categories: ["Human trafficking"],
      entities: ["epstein", "bin-sulayem", "doj", "blanche", "massie"],
      investigator: "Unlimited Hangout (Webb & Goodwin)",
      investigatorLinks: [
        { label: "First Friends — Part 1", url: "https://unlimitedhangout.com/2025/07/investigative-series/first-friends-part1/" },
        { label: "First Friends — How Andrew Farkas and an Emirati Sultan Helped Epstein Build a Smuggler's Paradise", url: "https://unlimitedhangout.com/2026/03/investigative-series/first-friends-how-andrew-farkas-and-an-emirati-sultan-helped-epstein-build-a-smugglers-paradise/" }
      ],
      status: "confirmed",
      finding: "In the released Epstein material, DOJ redacted the identity of the correspondent on at least one disturbing email — later identified as Sultan Ahmed bin Sulayem, the Emirati ports magnate (DP World). Rep. Thomas Massie named him publicly and Deputy Attorney General Todd Blanche confirmed the identity, which means the stated basis for the redaction no longer holds — the government withheld a name it has since acknowledged.",
      implication: "A redaction whose justification has publicly collapsed: the identity DOJ shielded is now confirmed on the record by the Deputy AG. That makes both the underlying material and the withholding decision itself requestable — the unredacted correspondence, and the disclosure/redaction determination that explains on what exemption and rationale the name was withheld in the first place.",
      sources: [
        { label: "Unlimited Hangout — First Friends, Part 1 (Jul 2025)", url: "https://unlimitedhangout.com/2025/07/investigative-series/first-friends-part1/" },
        { label: "Unlimited Hangout — First Friends: A Smuggler's Paradise (Mar 2026)", url: "https://unlimitedhangout.com/2026/03/investigative-series/first-friends-how-andrew-farkas-and-an-emirati-sultan-helped-epstein-build-a-smugglers-paradise/" }
      ],
      requests: [
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — department-level release/redaction determinations",
          summary: "DOJ — the unredacted bin Sulayem correspondence and the redaction determination behind it",
          subject: "FOIA Request: unredacted Epstein correspondence involving Sultan Ahmed bin Sulayem and the associated redaction/withholding determination",
          records: "I request a copy, in unredacted form, of the Epstein-related correspondence in which the identity of Sultan Ahmed bin Sulayem was redacted in previously released material, together with any disclosure determination, redaction log, or withholding memorandum stating the FOIA exemption(s) and rationale on which that identity was withheld. The identity has since been confirmed publicly by the Deputy Attorney General, so the basis for withholding the name no longer applies; please release all reasonably segregable non-exempt portions. To keep this request narrow, I am limiting it to the specific correspondence and the determination governing that redaction.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04080 (filed Jul 18, 2026); receipt PDF on the Hearth. Unredacted bin Sulayem correspondence + redaction determination. Determination pending."
        }
      ]
    },
    {
      id: "j6-pipe-bomb-baker",
      categories: ["January 6"],
      entities: ["fbi", "usss", "dod", "capitol-police", "task-force-orange"],
      investigator: "Steve Baker (The Blaze)",
      investigatorLinks: [
        { label: "Tucker Carlson — Steve Baker on the Lies of the J6 Pipe Bomb Case", url: "https://www.youtube.com/watch?v=D-JIqINmoSk" },
        { label: "Interview transcript", url: "https://singjupost.com/transcript-tucker-carlson-interviews-steve-baker-on-j6-pipe-bomb-case/" }
      ],
      status: "reported",
      finding: "Steve Baker reports the official J6 pipe-bomb story doesn't match the government's own records: FBI whistleblowers describe the two devices as inert training devices (\"they would have been bombs if they had been bombs\"); the FBI holds roughly 30,000 video files of the bomber but has publicly released about 30 seconds; Secret Service agents idled near the DNC device for minutes after notification with none of the standard perimeter response — after an 8–10 agent morning sweep walked past the device location (DHS OIG-24-42 independently confirmed the sweep failure and that USSS never logged the discovery as an Unusual Protective Event); and while the RNC device was found by a passerby, the Capitol Police counter-surveillance pair who then searched the DNC area walked directly to the only two spots where the hooded figure had sat the previous evening and looked nowhere else — officers whose single joint committee interview, given together and unsworn, congressional investigators called the most pre-planned and rehearsed they had ever witnessed. IMPORTANT STATUS NOTE (2026-07-04): Baker's identification of a specific ex-USCP officer was publicly disputed by the FBI, RETRACTED by The Blaze on Dec 5, 2025, and is the subject of Kerkhoff v. Blaze Media defamation litigation; CBS reported the ODNI Director's Initiative Group draft memo named an innocent federal security officer (with her SSN) and the DIG was dissolved (Jan 2026) in the fallout of that misidentification; Brian Cole Jr. was arrested Dec 4, 2025 and faces superseding terrorism/WMD charges (US v. Cole, D.D.C.). Baker maintains his claims (Tucker Carlson interview, July 2026); his dead-HSI-agent claim has no public corroboration found as of this note. The institutional-record anomalies above are independently supported by the Loudermilk/Massie congressional report and DHS OIG-24-42; the identification is not.",
      implication: "Each claim is testable against a discrete official record: the FBI Laboratory's examination report says whether the devices were functional; the Secret Service's own records say what agents did while a protectee was present; if military special-mission personnel were tasked into the crowd, a deployment or activation order exists. These requests test the institutional paper, NOT any identification. Processing reality (prior-art sweep 2026-07-04): the pending Cole prosecution means FBI investigative records will draw Exemption 7(A) categorical denials until trial — file anyway to lock queue position, citing the criminal-complaint affidavit and the Loudermilk/Massie report as public-domain waiver for already-disclosed portions; the Cole docket's 2–3 TB discovery and third-party-perpetrator defense may produce records faster than FOIA. Capitol Police records are FOIA-exempt, so requests target executive-branch parallels. Non-FOIA avenues: the US v. Reffitt trial transcript is a public court record; the claimed HSI agent death (uncorroborated) would sit in Virginia's state-records regime — a Fairfax County PD records check would confirm or kill the predicate event itself.",
      sources: [
        { label: "The Tucker Carlson Show — episode page", url: "https://tuckercarlson.com/tucker-show-steve-baker-070126" },
        { label: "Revolver News — Mike Benz's March 2021 analysis, vindicated five years on", url: "https://revolver.news/2025/12/mike-benz-and-revolver-predicted-the-black-pipe-bomber-5-years-ago/" },
        { label: "Revolver News — congressional report confirms its pipe-bomb reporting", url: "https://revolver.news/2025/01/major-congressional-report-confirms-revolver-news-pipe-bomb-reporting-raising-more-questions/" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the Laboratory examination report on both devices + chain of custody",
          subject: "FOIA Request: FBI Laboratory report of examination for the January 6, 2021 RNC and DNC suspected explosive devices",
          records: "I request a copy of the FBI Laboratory report(s) of examination for the two suspected explosive devices recovered on January 6, 2021 near the Republican National Committee headquarters (approximately 12:35 p.m.) and the Democratic National Committee headquarters (approximately 1:05 p.m.) in Washington, D.C., including findings as to device composition and functionality, together with the evidence chain-of-custody log for both devices. Substantial portions of the Laboratory's findings have already entered the public domain through the criminal complaint affidavit in United States v. Cole (D.D.C.) and the January 2025 joint interim congressional report on the pipe-bomb investigation, waiving exemption as to those portions; at minimum I request the segregable portions matching the publicly disclosed findings. These are discrete, catalogued laboratory records from a single named investigation, not a broad search. I am not seeking general email correspondence.",
          ask_no_records: true,
          priorArt: "Not released, but quoted at length in the US v. Cole complaint affidavit (justice.gov/usao-dc) and the Loudermilk/Massie joint report (cha.house.gov, Jan 2025) — public-domain-waiver ammunition. Expect 7(A) while Cole is pending; the Cole docket (CourtListener 71994556) may produce it first. Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "usss",
          component: "U.S. Secret Service (in SecureRelease's component picker)",
          summary: "Secret Service — the records underlying DHS OIG-24-42's DNC-device findings (sweep, radio, notification)",
          subject: "FOIA Request: Secret Service records reviewed in DHS OIG-24-42 concerning the January 6, 2021 DNC suspected explosive device",
          records: "I request a copy of the U.S. Secret Service records concerning the discovery of a suspected explosive device at the Democratic National Committee headquarters on January 6, 2021, as reviewed by the DHS Office of Inspector General for report OIG-24-42 (July 2024): the protective-sweep records for the DNC that morning, the radio-transmission log or transcript reflecting when agents on site were notified and the protective actions taken, and any after-action or protective-operations review of that response. OIG-24-42 found that no Unusual Protective Event record was created for this incident; if that remains the case, I request written confirmation that no UPE or incident report exists, which is itself responsive. These are discrete records of a single named incident on a single date, already identified and reviewed in a published OIG report. I am not seeking general email correspondence.",
          ask_no_records: true,
          priorArt: "DHS OIG-24-42 (Aug 2024, redacted public) already analyzes these records and found the sweep missed the device and no UPE was logged — cite it; CREW's broad June 2021 USSS J6 FOIA produced no DNC-device release. Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "dod",
          summary: "DoD — any tasking order for special-mission personnel in D.C. on January 6",
          subject: "FOIA Request: deployment or tasking orders for special-mission-unit personnel in Washington, D.C. on January 6, 2021",
          records: "I request a copy of any deployment, activation, or tasking order — and any resulting after-action report — concerning the presence in Washington, D.C. on January 6, 2021 of personnel assigned to the U.S. Army Intelligence Support Activity or any other special-mission unit headquartered at or operating from Fort Belvoir, Virginia, in plainclothes or any other capacity. This request is for the discrete order and report documents only, not general correspondence. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true
        },
        {
          agencyId: "fbi",
          summary: "FBI — the gait-recognition analysis that eliminated the earlier person of interest",
          subject: "FOIA Request: gait-analysis records used to eliminate a person of interest in the January 6 pipe-bomb investigation",
          records: "I request a copy of the gait-recognition or gait-comparison analysis report(s) prepared in the FBI's January 6, 2021 pipe-bomb investigation that were used to eliminate an earlier person of interest — reported by the Washington Post (Nov. 14, 2025) to be a gym employee whose gait resembled the suspect's. To be clear, this request concerns the FBI's own forensic analysis, not any privately produced analysis reported in the press. This is a discrete, catalogued forensic analysis from a single named investigation, not a broad search. I am not seeking general email correspondence, and I do not seek — and ask that you withhold — information identifying the eliminated individual. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          priorArt: "Existence confirmed by WaPo's Nov 14, 2025 investigation (eliminated gym-employee gait lead). DISTINCT from The Blaze's private '94–98%' analysis naming an ex-USCP officer — FBI disputed it, Blaze retracted Dec 5, 2025, now Kerkhoff v. Blaze Media litigation. Expect 7(A) while Cole is pending; Cole's third-party-perpetrator defense makes this prime discovery material. Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "odni",
          summary: "ODNI — the Director's Initiative Group pipe-bomb memo + the directive dissolving the group",
          subject: "FOIA Request: Director's Initiative Group records concerning the January 6 pipe-bomb matter and the group's dissolution",
          records: "I request a copy of (1) the draft memorandum prepared by or for the ODNI Director's Initiative Group in 2025 concerning a person of interest in the January 6, 2021 pipe-bomb investigation (reported by CBS News), with any information identifying the private individual named therein withheld — I do not seek and affirmatively ask you to redact her identity, and (2) the directive, memorandum, or order pausing, dissolving, or disestablishing the Director's Initiative Group (December 2025–January 2026). These are two discrete, identified documents, not a broad search. I am not seeking general email correspondence. If either document does not exist, I request written confirmation of that fact.",
          ask_no_records: true,
          priorArt: "No public copy of either instrument. CBS News reviewed the draft memo (reported it named an innocent federal security officer, incl. her SSN); Seth Hettena reported the DIG's Dec 2025 pause and Jan 2026 dissolution. Expect Exemptions 1 (classified draft), 5 (deliberative), 6/7(C) (the misidentified woman's PII — hence the affirmative redaction request). Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "dhs",
          component: "ICE — Immigration and Customs Enforcement (in SecureRelease's component picker)",
          summary: "DHS/ICE — the internal HSI notification memo on the agent's November 26, 2025 death",
          subject: "FOIA Request: internal HSI staff notification concerning the death of a senior special agent on or about November 26, 2025",
          records: "I request a copy of the internal staff notification memorandum or announcement issued by or within Homeland Security Investigations concerning the death of a senior HSI special agent in Fairfax County, Virginia on or about November 26, 2025. This is a single, discrete administrative document, not a broad search. I am not seeking general email correspondence, investigative files, or personnel records. If no responsive record exists, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "mkultra-declass-task-force",
      categories: ["Declassification"],
      entities: ["cia", "odni", "mkultra", "luna"],
      investigator: "House Declassification Task Force · public reporting",
      investigatorLinks: [
        { label: "Full hearing — Mind Control and Accountability (Jun 30, 2026)", url: "https://youtu.be/dpQulJS-R50" },
        { label: "Task force hearing release", url: "https://oversight.house.gov/release/luna-opens-hearing-on-mkultra-project-transparency/" }
      ],
      status: "reported",
      finding: "At the task force's June 30, 2026 MKUltra hearing, Chairwoman Anna Paulina Luna said the CIA \"is currently in the process of declassifying newly found documentation\" — records of a forgery program housed under MKUltra — and in May 2026 a CIA whistleblower testified to the Senate that roughly 40 boxes of JFK and MKUltra material were removed from ODNI while undergoing declassification review.",
      implication: "The core MKUltra research files were destroyed in 1973 on Director Helms's order, so hearings can only surface the residue — but both statements put specific, recently created paper in play. A declassification-in-progress generates decision memoranda and a document inventory; a physical removal of boxes mid-review generates transfer manifests and chain-of-custody records — or a documented absence, which is its own answer. Either way the record now exists to be asked for by name.",
      sources: [
        { label: "Washington Examiner — Luna: CIA declassifying newly discovered MKUltra documents", url: "https://www.washingtonexaminer.com/news/investigations/4630998/cia-declassifying-mkultra-documents-anna-paulina-luna/" },
        { label: "National Security Archive — MKUltra briefing book (what's released vs. destroyed)", url: "https://nsarchive.gwu.edu/briefing-book/intelligence/2026-06-29/mkultra-declassification-task-force-should-focus-real-secrets" }
      ],
      requests: [
        {
          agencyId: "cia",
          summary: "CIA — the declassification decision memo + inventory for the \"newly found\" MKUltra records",
          subject: "FOIA Request: declassification decision records and inventory for newly located MKUltra-related documents",
          records: "I request a copy of the declassification decision memorandum(s), the document inventory or manifest, and any projected release schedule for the newly located records related to Project MKULTRA — including records of the forgery program described as having been housed under MKULTRA — referenced by Rep. Anna Paulina Luna as \"currently in the process of declassif[ication]\" at the June 30, 2026 hearing of the House Task Force on the Declassification of Federal Secrets. These are discrete, recently created administrative records concerning an announced declassification action, not a broad historical search. To keep this request narrow, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "odni",
          summary: "ODNI — transfer manifests / chain of custody for the ~40 boxes removed mid-review",
          subject: "FOIA Request: transfer and chain-of-custody records for JFK/MKUltra boxes removed from ODNI during declassification review",
          records: "I request a copy of any transfer manifest, receipt, chain-of-custody record, or records-accountability document concerning the removal or transfer from ODNI facilities of boxes containing Project MKULTRA or President Kennedy assassination-related records during calendar years 2025 and 2026, as described in testimony before the Senate Homeland Security and Governmental Affairs Committee in May 2026 (the Erdman testimony and Rep. Luna's May 14, 2026 letter to the Director, published by the Committee). I further request that these records be preserved pending the processing of this request. This request is for the discrete custody and transfer documents only, not general correspondence. If no responsive records exist, I request written confirmation of that fact, including a description of the search conducted.",
          ask_no_records: true,
          priorArt: "NO PRIOR REQUEST (MuckRock: zero on the boxes/DIG). Cite the published predicate: Erdman Senate testimony + Luna's May 14, 2026 letter (hsgac.senate.gov PDF). Preservation demand added because Bloomberg/Freedom of the Press Foundation reported ODNI scrubbed hundreds of previously released FOIA docs from its site in spring 2026. Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "cia",
          summary: "CIA — Sidney Gottlieb's Germany case-officer posting records (Kinzer's unfulfilled ask, renewed on the record)",
          subject: "FOIA Request: assignment and posting records for Sidney Gottlieb's service in Germany",
          records: "I request a copy of the assignment, posting, or tour-of-duty records documenting Sidney Gottlieb's service as a case officer in Germany during the 1950s, including the assignment order and post-of-duty designation. Gottlieb is deceased and was publicly identified as MKULTRA's director decades ago; at the June 30, 2026 hearing of the House Task Force on the Declassification of Federal Secrets, historian Stephen Kinzer testified that his own FOIA request for these records was never fulfilled and urged the task force to pursue them. These are discrete personnel-assignment instruments, not a broad search. I am not seeking general email correspondence. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          priorArt: "PRIOR REQUEST EXISTS: Kinzer's own pre-2019 FOIA, never fulfilled — sworn to on the record June 30, 2026 (citable as constructive denial). No release: CIA Reading Room's Gottlieb keyword page holds clippings/Church-era material only. Anticipate CIA v. Sims (1985) on personnel names. Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "cia",
          summary: "CIA — the Victims Task Force tasking document and FINAL report (excluding the already-released progress material)",
          subject: "FOIA Request: tasking document and final report of the CIA task force assigned to identify MKUltra experiment victims",
          records: "I request a copy of (1) the tasking, charter, or initiating memorandum and (2) the final report or closing memorandum of the CIA task force assigned, following the 1977 congressional MKULTRA hearings and the Attorney General's 1978 opinion on victim notification, to identify victims of MKULTRA experiments (the effort reflected in investigators Frank Laubinger and Selmi's work under Robert H. Wiltse, special assistant to DDA John F. Blake). I am aware of, and expressly EXCLUDE from this request, the material already released in the CIA FOIA Reading Room under \"MKULTRA Notification of Unwitting Subjects\" (documents 00295568 and 00295569, including the January 18, 1979 progress report) and \"MKULTRA — Institutional Notifications\"; I seek only the initiating instrument and the final/closing document, which do not appear among the released items. These are two discrete documents from a single named internal effort, not a broad search. I am not seeking general email correspondence. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          priorArt: "PARTIAL RELEASE EXISTS: CIA Reading Room docs 00295568/00295569 ('MKULTRA Notification of Unwitting Subjects', incl. Jan 18, 1979 progress report) + 'Institutional Notifications' — pull these before filing; request re-scoped to exclude them. Task-force operational records reached researcher H.P. Albarelli (~2002), defeating any destruction claim. Adjacent MuckRock request on DDA Blake's Oct 1978 MKULTRA letter pending at CIA since 2016. Black Vault's MKUltra collection does NOT cover the task force. Prior-art sweep 2026-07-04."
        },
        {
          agencyId: "doj-crm",
          component: "Criminal Division",
          summary: "DOJ — disposition of the criminal investigation AG Bell announced into the MKUltra records destruction",
          subject: "FOIA Request: opening and disposition records for the announced investigation into the 1973 destruction of MKULTRA files",
          records: "I request a copy of the opening memorandum, case-initiation record, declination memorandum, or closing document for the criminal investigation into the 1973 destruction of Project MKULTRA records that was announced during the tenure of Attorney General Griffin Bell (circa 1977–1979). Witness testimony at the June 30, 2026 House Declassification Task Force hearing stated this announced investigation was never conducted; a documented absence of any case-opening record would itself be responsive. These are discrete case-administration documents, not a broad search. I am not seeking general email correspondence. If no responsive records exist, I request written confirmation of that fact, including a description of the search conducted.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "us-israel-dtci-executive-agent",
      categories: ["Israel / foreign influence"],
      entities: ["us-israel-dtci", "dod", "israel", "netanyahu", "massie"],
      investigator: "Kim Iversen · Responsible Statecraft",
      investigatorLinks: [
        { label: "Kim Iversen — Amendment To Halt U.S. Israel Military Merger FAILS", url: "https://www.youtube.com/watch?v=xePbbDHbGu0" },
        { label: "Responsible Statecraft", url: "https://responsiblestatecraft.org" }
      ],
      status: "reported",
      finding: "A bipartisan Khanna–Massie amendment to strip the \"United States-Israel Defense Technology Cooperation Initiative\" (the provision formerly designated Section 224) from the pending House NDAA was killed procedurally in July 2026 — the Rules Committee, after no debate, declined to rule it in order, so it never received a floor vote. The surviving provision creates an executive agent within the Department of Defense whose sole responsibility is furthering U.S.-Israeli military-tech integration \"across nearly every facet of the defense process from co-producing weapons to data fusion.\" Netanyahu has publicly described the shift from aid to full military-industrial partnership as \"my plan.\"",
      implication: "An executive-agent designation is not rhetoric — under DoD Directive 5101.1 it generates discrete, dated paper: a designation memorandum naming the office that holds the role, and a charter or terms of reference defining its scope. Whether the initiative has actually been stood up, who runs it, and how far \"data fusion\" reaches are all answerable by asking for those instruments by name — and if none exists yet, the documented absence dates the program's real start. (The Rules Committee action itself is a congressional record outside FOIA; these requests target the executive-branch implementation paper.)",
      sources: [
        { label: "Kim Iversen — full segment", url: "https://www.youtube.com/watch?v=xePbbDHbGu0" },
        { label: "Ro Khanna — statement on the blocked amendment", url: "https://x.com/RoKhanna" }
      ],
      requests: [
        {
          agencyId: "dod",
          summary: "DoD — the executive agent designation memo + charter for the Initiative",
          subject: "FOIA Request: executive agent designation and charter for the United States-Israel Defense Technology Cooperation Initiative",
          records: "I request a copy of the executive agent designation memorandum issued under DoD Directive 5101.1 (or successor issuance) for the United States-Israel Defense Technology Cooperation Initiative — the National Defense Authorization Act provision formerly designated Section 224 — together with any charter, terms of reference, or implementation directive defining the executive agent's scope and responsibilities. These are discrete, dated administrative instruments, not a broad search. I am not seeking general email correspondence. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true
        },
        {
          agencyId: "dod",
          summary: "DoD — any framework agreement executed with Israel's Ministry of Defense under the Initiative",
          subject: "FOIA Request: framework or implementing agreements under the United States-Israel Defense Technology Cooperation Initiative",
          records: "I request a copy of any framework agreement, memorandum of understanding, or implementing arrangement executed between the Department of Defense and the Israeli Ministry of Defense under or in furtherance of the United States-Israel Defense Technology Cooperation Initiative, including any arrangement governing weapons co-production or data fusion, dated from January 1, 2026 to the date this request is processed. This request is for the discrete executed agreement documents only, not negotiation correspondence. If no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "cisa-switchboarding-eip",
      categories: ["Elections & voting", "Civil liberties"],
      entities: ["cisa", "dhs", "chris-krebs", "eip", "cis"],
      investigator: "Mike Benz (Foundation for Freedom Online)",
      investigatorLinks: [
        { label: "Foundation for Freedom Online — reports", url: "https://foundationforfreedomonline.com" }
      ],
      status: "reported",
      finding: "Mike Benz's Foundation for Freedom Online documented — and House Judiciary staff reports later corroborated with internal documents — that CISA ran a \"switchboarding\" pipeline forwarding state and local election officials' reports of social-media posts to platforms for action, and helped conceive the Election Integrity Partnership (EIP), a university consortium whose mass content-flagging operation ran alongside a DHS-funded \"Misinformation Reporting Portal\" at the Center for Internet Security.",
      implication: "A federal cybersecurity agency routing content referrals to platforms — directly and through funded intermediaries — lives in discrete instruments: the internal procedure that governed switchboarding, the decision record that ended it, and the cooperative agreement that paid for the reporting portal. The House reports quote fragments of these documents; the public record should hold them whole. (The practice's existence is documented in CISA's own advisory-committee materials; its characterization is contested — these requests fetch the instruments themselves.)",
      sources: [
        { label: "House Judiciary — The Weaponization of CISA (staff report, Jun 2023)", url: "https://judiciary.house.gov/sites/evo-subsites/republicans-judiciary.house.gov/files/evo-media-document/cisa-staff-report6-26-23.pdf" },
        { label: "House Judiciary — The Weaponization of \"Disinformation\" Pseudo-Experts (EIP Jira tickets, Nov 2023)", url: "https://judiciary.house.gov/sites/evo-subsites/republicans-judiciary.house.gov/files/evo-media-document/EIP_Jira_Ticket_Staff_Report_11-6-23_Clean.pdf" }
      ],
      requests: [
        {
          agencyId: "cisa",
          component: "DHS Headquarters — covers CISA (in SecureRelease's component picker)",
          summary: "CISA — the switchboarding SOP and the decision record that ended the practice",
          subject: "FOIA Request: CISA internal procedure governing \"switchboarding\" of election-related social-media reports and the decision record ending it",
          records: "I request a copy of the standard operating procedure, process document, or internal guidance governing CISA's practice of forwarding (\"switchboarding\") reports of social-media content from state and local election officials to social-media platforms during 2018 through 2022, together with any decision memorandum or guidance documenting the discontinuation of that practice. These are discrete internal-policy documents referenced in CISA's own Cybersecurity Advisory Committee materials and in House committee reports, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "cisa",
          component: "DHS Headquarters — covers CISA (in SecureRelease's component picker)",
          summary: "CISA/DHS — the CIS cooperative agreement behind the Misinformation Reporting Portal",
          subject: "FOIA Request: DHS/CISA cooperative agreement with the Center for Internet Security concerning the Misinformation Reporting Portal",
          records: "I request a copy of the cooperative agreement, including any modifications and statements of work, between the Department of Homeland Security or CISA and the Center for Internet Security funding the Elections Infrastructure Information Sharing and Analysis Center (EI-ISAC) for the 2020 election cycle — specifically any provision, task, or deliverable concerning the \"Misinformation Reporting Portal\" or the intake and forwarding of reports about social-media content — together with any program or closeout report describing the volume or disposition of reports submitted through that portal in 2020 and 2021. This is a discrete named funding instrument, not a broad search. To keep this request narrow, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "nspm7-dhs-class-grievances",
      categories: ["Surveillance & privacy", "Civil liberties"],
      entities: ["nspm-7", "dhs"],
      investigator: "Ken Klippenstein",
      investigatorLinks: [
        { label: "kenklippenstein.com", url: "https://www.kenklippenstein.com" },
        { label: "More Perfect Union — \"We Talked To A Former Surveillance Official\"", url: "https://www.youtube.com/watch?v=RafuYcUolY4" }
      ],
      status: "reported",
      finding: "Ken Klippenstein reports he was leaked the Department of Homeland Security's strategy interpreting NSPM-7 (signed September 25, 2025), and that it introduces \"class-based or economic grievances\" as a terrorism-indicator category — alongside NSPM-7's public indicator list (anti-Christian, anti-\"traditional family,\" anti-American, anti-capitalist sentiment), with \"anti-tech sentiment\" also appearing in federal law-enforcement documents as a surveillance focal point.",
      implication: "A counterterrorism strategy that treats economic discontent as a threat indicator would sweep in constitutionally protected speech held by most of the public. The strategy is a discrete, final planning document — exactly the kind of instrument FOIA reaches. (The leak is Klippenstein's reporting; this request fetches the document itself so its language can be read rather than characterized.)",
      sources: [
        { label: "More Perfect Union video (Boguslaw, w/ Klippenstein)", url: "https://www.youtube.com/watch?v=RafuYcUolY4" },
        { label: "NSPM-7 (Sept 25, 2025, public record)", url: "" }
      ],
      requests: [
        {
          agencyId: "dhs",
          component: "DHS Headquarters — the strategy is an Office of Intelligence & Analysis / HQ product (in SecureRelease's component picker)",
          summary: "DHS — the final NSPM-7 implementation strategy (\"class-based or economic grievances\")",
          subject: "FOIA Request: DHS strategy or implementation plan for National Security Presidential Memorandum 7 (NSPM-7)",
          records: "I request a copy of the final Department of Homeland Security strategy, implementation plan, or operational guidance concerning National Security Presidential Memorandum 7 (NSPM-7, September 25, 2025), including any annex, definitions section, or indicator list that uses or defines the term \"class-based or economic grievances,\" issued between September 25, 2025 and the date this request is processed. This is a discrete, final planning document, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking general email correspondence or draft versions.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "nspm7-fbi-field-operationalization",
      categories: ["Surveillance & privacy", "Civil liberties"],
      entities: ["nspm-7", "fbi", "doj", "bondi"],
      investigator: "More Perfect Union (Daniel Boguslaw)",
      investigatorLinks: [
        { label: "\"We Talked To A Former Surveillance Official\"", url: "https://www.youtube.com/watch?v=RafuYcUolY4" }
      ],
      status: "reported",
      finding: "Daniel Boguslaw reports (documents published with Wired) that NSPM-7 investigations are already underway in FBI field offices \"from Boston to San Francisco,\" mapped in an FBI-produced document that \"was not supposed to leak,\" with briefings and intelligence reports circulating through 70+ fusion centers — and that Attorney General Pam Bondi, asked in congressional testimony whether DOJ prepared the list of groups designated as domestic terrorist organizations under NSPM-7, refused to answer yes or no.",
      implication: "Whether and how NSPM-7 was converted into bureau-wide investigative tasking — and whether a designation list of domestic organizations exists — are records questions, not rhetoric questions. The implementing directive and any designation instrument are discrete named documents. (A refusal to confirm in testimony is not a denial; a FOIA response, including a Glomar or exemption claim, is itself informative.)",
      sources: [
        { label: "More Perfect Union video", url: "https://www.youtube.com/watch?v=RafuYcUolY4" },
        { label: "Bondi congressional testimony (clip in video)", url: "" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the bureau-wide directive implementing NSPM-7 in field offices",
          subject: "FOIA Request: FBI guidance implementing National Security Presidential Memorandum 7 (NSPM-7)",
          records: "I request a copy of any bureau-wide electronic communication, directive, policy guide amendment, or implementation guidance issued to FBI field offices concerning National Security Presidential Memorandum 7 (NSPM-7, September 25, 2025), including any accompanying list or annex of threat indicators, issued between September 25, 2025 and the date this request is processed. This is a discrete implementing instrument, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking general email correspondence, case files, or records identifying investigative subjects.",
          ask_no_records: true,
          filed: "FILED — filed Jul 18, 2026 via the FBI eFOIPA portal (efoia.fbi.gov); receipt PDF on the Hearth. FOIPA number to follow."
        },
        {
          agencyId: "doj",
          component: "Office of Information Policy (OIP) — the designation authority is the Attorney General's office",
          summary: "DOJ — the NSPM-7 domestic-terrorist-organization designation instrument",
          subject: "FOIA Request: designation instrument for domestic organizations under NSPM-7",
          records: "I request a copy of any final memorandum, order, or list by which the Department of Justice designated, or proposed for designation, groups or entities as domestic terrorist organizations pursuant to National Security Presidential Memorandum 7 (NSPM-7, September 25, 2025), created between September 25, 2025 and the date this request is processed. This request seeks the designation instrument itself — a discrete named document — not investigative files or general correspondence. If any responsive record is withheld in full or in part, please cite the specific exemption claimed; if no responsive records exist, I request written confirmation of that fact.",
          ask_no_records: true,
          filed: "FILED — OIP via FOIA STAR, tracking FOIA-2026-04081 (filed Jul 18, 2026); receipt PDF on the Hearth. DOJ NSPM-7 domestic-terror designation instrument. Determination pending."
        }
      ]
    },
    {
      id: "dol-oig-intel-taskforces",
      categories: ["Surveillance & privacy", "Civil liberties"],
      entities: ["nspm-7", "dol", "dhs", "fbi", "jonathan-berry"],
      investigator: "More Perfect Union (Daniel Boguslaw)",
      investigatorLinks: [
        { label: "\"We Talked To A Former Surveillance Official\"", url: "https://www.youtube.com/watch?v=RafuYcUolY4" }
      ],
      status: "reported",
      finding: "Boguslaw reports — with ex-DHS intelligence attorney Spencer Reynolds on record — that the Department of Labor's Office of Inspector General participates in DHS joint task forces and liaisons with the FBI and other intelligence agencies, routinely appearing in DOJ enforcement press releases; DOL's current Solicitor, Jonathan Berry, wrote the Project 2025 Department of Labor chapter calling for OIG investigations of worker centers and for union investigations undertaken without any initiating complaint.",
      implication: "A worker-protection agency's watchdog embedding in counterterrorism-adjacent task forces is a structural repurposing that would live in participation agreements and delegations — discrete instruments. (Task-force participation is documented in press releases; the leap to \"intelligence arm against workers\" is the video's inference. These are the records that would confirm, bound, or refute it.)",
      sources: [
        { label: "More Perfect Union video (Reynolds on record)", url: "https://www.youtube.com/watch?v=RafuYcUolY4" },
        { label: "Project 2025, Department of Labor chapter (Jonathan Berry)", url: "https://static.project2025.org/2025_MandateForLeadership_CHAPTER-18.pdf" }
      ],
      requests: [
        {
          agencyId: "dol-oig",
          summary: "DOL-OIG — its task-force participation agreements with DHS/FBI",
          subject: "FOIA Request: DOL-OIG participation agreements with DHS task forces and FBI Joint Terrorism Task Forces",
          records: "I request a copy of any memorandum of understanding, participation agreement, or delegation authorizing the Department of Labor Office of Inspector General to participate in a Department of Homeland Security task force, an FBI Joint Terrorism Task Force, or any interagency intelligence-sharing task force, in effect between January 1, 2025 and the date this request is processed. These are discrete named instruments, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking general email correspondence, case files, or records identifying investigative subjects.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "fara-greg-brown-libya",
      categories: ["Israel / foreign influence", "Economic coercion"],
      entities: ["greg-brown", "epstein", "libya", "doj"],
      investigator: "Mike Benz (Foundation for Freedom Online)",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "Benz reads released Epstein-file emails — 42 of them, Greg Brown to Jeffrey Epstein, June 2011–June 2013 — scheming to unfreeze Libya's sovereign assets (\"$80 billion in frozen funds, 32 billion is in the US\") on a ~25% contingency, with Brown writing he has \"friends formally with MI6 and Mossad\" willing to help identify and recover the assets. Brown (Global Cast Partners LLC, Beverly Hills) appears in a DOJ FARA filing recording May 2011 payments for UN consulting tied to Kuwait's Sheikh Ali Al-Sabah, arranging meetings with members of Congress, banks, media organizations, IRI, NDI, and NED.",
      implication: "The FARA registration statement and exhibits are already public — the eFile database lookup is free and instant, no FOIA needed. What the public database doesn't show is the FARA Unit's own file: correspondence with the registrant, deficiency or inquiry letters, advisory opinions, and any enforcement review. That file is a discrete, requestable record set. (The emails are in the released Epstein tranche; the MI6/Mossad line is Brown's own claim in them; \"Epstein worked for the CIA\" is Benz's inference, not a document.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\" (reads the emails and FARA filing on screen)", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" },
        { label: "DOJ FARA eFile — public registration search (start here, no FOIA needed)", url: "https://efile.fara.gov" }
      ],
      requests: [
        {
          agencyId: "doj-nsd",
          summary: "DOJ-NSD FARA Unit — its file on the Greg Brown / Global Cast Partners registration beyond the public eFile documents",
          subject: "FOIA Request: FARA Unit records concerning registrant Global Cast Partners LLC / Greg Brown",
          records: "I request a copy of the FARA Unit's records concerning the registration of Global Cast Partners LLC and/or Greg Brown (registration activity beginning in or around May 2011, concerning consulting tied to Sheikh Ali Al-Sabah of Kuwait), other than the registration statements, supplemental statements, and exhibits already published on the FARA eFile public database — specifically: any deficiency letter, inquiry letter, or other correspondence between the FARA Unit and the registrant; any advisory opinion issued to or concerning the registrant; and any review or determination memorandum concerning the registrant's obligations, from January 1, 2011 to December 31, 2014. These are discrete registrant-file records, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking general email correspondence beyond the registrant-correspondence file described.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "treasury-frbny-revenue-custody",
      categories: ["Economic coercion"],
      entities: ["treasury", "ofac", "frbny", "venezuela", "iraq", "libya"],
      investigator: "Mike Benz (Foundation for Freedom Online), reading a New York Times feature and The Cradle",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "The NYT feature Benz reads reports that the U.S. Treasury receives the revenue from most of Venezuela's exports and disperses it gradually through the country's private banks — \"akin to parents handing out allowances to children.\" Benz pairs it with the post-2003 Iraq arrangement (all oil revenue deposited to a single Federal Reserve Bank of New York account, Baghdad sending a monthly invoice to Treasury, cash flown in on pallets because key Iraqi banks are sanctioned — reported by Charmaine Narwani in The Cradle) and Libya (~$80B frozen at the fall of Gaddafi, ~$32B of it in the U.S.).",
      implication: "Each arrangement is an instrument, not a vibe: a custody or depository agreement, an OFAC licensing framework, and a disbursement procedure. The FRBNY itself is not subject to FOIA, but Treasury's side of each arrangement is. These requests ask for the governing instruments — the cleanest way to confirm, bound, or refute the \"tranche-disbursement control\" characterization. (The Venezuela description is a single-outlet, largely anonymous-sourced NYT feature; the Iraq account arrangement has confirmed real elements; \"economic anaconda\" is Benz's framing.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\" (reads the NYT feature and The Cradle reporting)", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      requests: [
        {
          agencyId: "treasury",
          summary: "Treasury — the Venezuela export-revenue custody and disbursement instrument",
          subject: "FOIA Request: governing instrument for U.S. custody and disbursement of Venezuelan export revenue",
          records: "I request a copy of any currently effective agreement, licensing framework, general or specific license, directive, or memorandum — held by the Office of Foreign Assets Control, the Office of International Affairs, or the Fiscal Service — that governs the receipt, custody, or scheduled disbursement of revenue from Venezuelan exports (including oil) through U.S. government or Federal Reserve accounts and Venezuelan private banks, in effect between January 1, 2025 and the date this request is processed. I am requesting the governing instrument(s), not transaction-level records. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "treasury",
          summary: "Treasury — the current Iraq oil-revenue account arrangement (successor to the Development Fund for Iraq) and its disbursement procedure",
          subject: "FOIA Request: governing arrangement for Iraq oil-revenue deposits at the Federal Reserve Bank of New York",
          records: "I request a copy of the currently effective agreement or arrangement under which Government of Iraq oil revenue is deposited to an account at the Federal Reserve Bank of New York (the successor arrangement to the Development Fund for Iraq), together with any Treasury procedure, directive, or memorandum governing how disbursements from that account are requested (including any periodic invoice or request process) and approved, in effect between January 1, 2023 and the date this request is processed. I am requesting the governing instruments and procedures, not transaction-level records. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "treasury",
          summary: "Treasury/OFAC — the accounting of blocked Libyan sovereign assets held in the U.S.",
          subject: "FOIA Request: OFAC accounting of blocked Government of Libya sovereign assets",
          records: "I request a copy of any OFAC report, summary, or accounting stating the aggregate value of blocked Government of Libya sovereign assets (including Libyan Investment Authority and Central Bank of Libya assets) held within U.S. jurisdiction, together with any currently effective general license or licensing policy governing their release, for the period January 1, 2011 to the date this request is processed. Annual aggregate figures (such as those compiled for the Terrorist Assets Report or successor reporting) are responsive; I am not seeking records identifying individual private account holders. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "epstein-havana-ofac-license",
      categories: ["Economic coercion", "Human trafficking"],
      entities: ["epstein", "cuba", "ofac", "treasury", "state-dept"],
      investigator: "Mike Benz (Foundation for Freedom Online), citing Miami Herald reporting",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "Benz recounts (citing Miami Herald reporting and released Epstein emails) that Jeffrey Epstein funded a state-backed neuroscience conference in Havana held November 6–8, 2017, with the money routed through a Hong Kong academic intermediary and Sapienza University of Rome — and that the Trump State Department's Cuba Restricted List, prohibiting certain direct financial transactions, took effect November 9, 2017, one day after the conference ended. A 2009 Epstein email conceiving the conference reportedly reads \"I need to check with State Department.\"",
      implication: "A U.S. person financing a Cuban state-backed event in 2017 sits squarely in OFAC-license territory, and the one-day sanctions gap is date-anchored and testable: either a license or clearance record exists, or it doesn't — both answers matter. (The routing details and the 2009 email are reporting Benz reads on screen; \"the conference was CIA-seeded\" is his inference, not a document.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      requests: [
        {
          agencyId: "treasury",
          summary: "Treasury/OFAC — any license covering the Epstein-funded Havana conference payments",
          subject: "FOIA Request: OFAC license or determination concerning a November 2017 Havana neuroscience conference",
          records: "I request a copy of any specific license, license application, interpretive guidance, or determination issued or considered by the Office of Foreign Assets Control concerning funding for, travel to, or payments connected with a neuroscience or brain-science conference held in Havana, Cuba on or about November 6–8, 2017 — including any application or license naming Jeffrey Epstein, his foundations, a Hong Kong academic intermediary, or Sapienza University of Rome — from January 1, 2016 to December 31, 2018. This is a discrete, date-anchored event, not a broad search. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        },
        {
          agencyId: "state",
          summary: "State — any clearance or review of the conference, set against the Nov 9, 2017 Cuba Restricted List effective date",
          subject: "Freedom of Information Act/Privacy Act Request",
          records: "I request a copy of any memorandum, clearance, guidance, or determination held by the Bureau of Western Hemisphere Affairs, the Office of Economic Sanctions Policy and Implementation, or the Bureau of Educational and Cultural Affairs concerning a neuroscience or brain-science conference held in Havana, Cuba on or about November 6–8, 2017, or concerning funding of Cuban academic or medical events by Jeffrey Epstein or his foundations, from January 1, 2009 to December 31, 2018. I note the State Department's Cuba Restricted List took effect November 9, 2017; I am requesting records about this specific event and funder, not the Restricted List rulemaking file. To keep this request narrow and minimize search burden, I am not seeking general email correspondence beyond the specific clearance or review records described.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "state-ukraine-nyfed-freeze-memo",
      categories: ["Economic coercion"],
      entities: ["state-dept", "ukraine", "frbny"],
      investigator: "Mike Benz (Foundation for Freedom Online) — firsthand account",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "Benz — a former State Department official — says he personally saw an inbound State Department policy piece proposing to freeze Ukrainian government funds held at the Federal Reserve Bank of New York in order to pressure Ukraine's parliament out of a bill that would have returned school-accreditation authority from a Euro-Atlantic accrediting body to Ukraine's Ministry of Education, in the years after 2014.",
      implication: "This is a firsthand-witness claim about a specific internal document — unusually concrete for this genre. A targeted FOIA either surfaces the memo, or produces a no-records response that bounds the claim. Needle-in-a-haystack odds, but the ask is narrow enough to be answerable. (Entirely single-witness; no document has been published; the characterization of the accrediting body is Benz's.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      requests: [
        {
          agencyId: "state",
          summary: "State — the post-2014 policy memo proposing to freeze Ukraine's NY-Fed funds over the education-accreditation bill",
          subject: "Freedom of Information Act/Privacy Act Request",
          records: "I request a copy of any policy memorandum, options paper, or action memorandum held by the Bureau of European and Eurasian Affairs or the Office of the Under Secretary for Economic Growth that discusses freezing, withholding, or conditioning Government of Ukraine funds held at the Federal Reserve Bank of New York in connection with proposed Ukrainian legislation concerning school or university accreditation authority or the Ministry of Education, dated between January 1, 2014 and December 31, 2019. This is a request for a specific described policy document, not a broad subject-matter search. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "doj-epstein-bounty-hunter-memo",
      categories: ["Human trafficking", "Economic coercion"],
      entities: ["epstein", "doj", "fbi", "israel"],
      investigator: "Mike Benz (Foundation for Freedom Online)",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "In the released Epstein files, Benz surfaces a 5-page legal memo prepared for the Justice Department proposing ways to prosecute Epstein, whose background section — per Benz's on-air reading — makes a facial claim that Jeffrey Epstein \"worked for the United States government as a financial bounty hunter,\" with \"significant political connections with Israel and the US.\" The memo's author and originating agency are not identified in the released copy (Benz guesses DEA or FBI). It also notes Epstein's one-man firm Intercontinental Assets Group, formed in 1981 after he nominally left Bear Stearns.",
      implication: "The memo itself is public; what isn't public is who wrote it and what it relied on. The FOIA value is the unredacted original plus provenance — the originating component, author, and transmittal. That's a discrete record set, and even a Glomar or exemption response fixes which agency claims the record. (\"Financial bounty hunter\" is Benz's paraphrase of a memo shown but not quoted in full; \"worked for the CIA\" is his inference beyond the document.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\" (reads the memo on screen)", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the unredacted memo + records identifying its author and originating office",
          subject: "FOIA Request: five-page prosecution memorandum concerning Jeffrey Epstein and its provenance",
          records: "I request a copy of the approximately five-page legal memorandum prepared for the Department of Justice proposing potential avenues for prosecuting Jeffrey Epstein, which includes a background statement describing Epstein as having worked for the United States government in a financial asset-recovery or \"financial bounty hunter\" capacity — a version of which has been publicly released in the Epstein files tranche — together with any transmittal record, routing slip, or cover memorandum identifying its author, originating office, and date of preparation. This is a request for a specific, publicly described document and its provenance records, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking the broader investigative file.",
          ask_no_records: true
        },
        {
          agencyId: "dea",
          summary: "DEA — the same memo and provenance, if DEA-originated",
          subject: "FOIA Request: five-page prosecution memorandum concerning Jeffrey Epstein and its provenance",
          records: "I request a copy of the approximately five-page legal memorandum prepared for the Department of Justice proposing potential avenues for prosecuting Jeffrey Epstein, which includes a background statement describing Epstein as having worked for the United States government in a financial asset-recovery or \"financial bounty hunter\" capacity — a version of which has been publicly released in the Epstein files tranche — together with any transmittal record, routing slip, or cover memorandum identifying its author, originating office, and date of preparation, if this memorandum originated with or was routed through the Drug Enforcement Administration. This is a request for a specific, publicly described document and its provenance records, not a broad search. To keep this request narrow and minimize processing burden, I am not seeking the broader investigative file.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "faa-epstein-flight-records",
      categories: ["Human trafficking"],
      entities: ["epstein", "cuba"],
      investigator: "Mike Benz (Foundation for Freedom Online)",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "Benz recounts that Epstein traveled to Cuba in 2003 and met Fidel Castro, and flew Bill Clinton around Africa in 2002 — and that when researchers sought the federal flight records, \"the FAA dog ate the records.\" His argument: Cuba travel in 2003, under a Republican administration, had to be authorized — making the missing records themselves the story.",
      implication: "If the records exist, they document the trips; if they were destroyed, the disposition paperwork (what was destroyed, when, under what records schedule) is itself a record — and an improper destruction is a federal records issue. Either answer is informative. (Check overlap with already-public Epstein flight logs from litigation before filing; those are pilot logs, not FAA records, so the FAA ask is complementary rather than duplicative.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      requests: [
        {
          agencyId: "faa",
          summary: "FAA — flight records for Epstein aircraft (2002 Africa, 2003 Cuba) or the disposition paperwork if destroyed",
          subject: "FOIA Request: flight records for aircraft registered to Jeffrey Epstein or his companies, 2002–2003, and any records-disposition documentation",
          records: "I request copies of flight plans, international flight-plan filings, overflight or departure clearances, and aircraft registry records held by the FAA for aircraft registered to Jeffrey Epstein or to companies he controlled, for (1) travel to or from Cuba during calendar year 2003 and (2) travel to or from countries in Africa during calendar year 2002. If any such records have been destroyed or otherwise disposed of, I request the records-disposition documentation: the applicable records schedule, any disposal authorization, and any log recording the destruction. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "state-usaid-aba-oil-legislation",
      categories: ["Economic coercion"],
      entities: ["state-dept", "usaid", "iraq"],
      investigator: "Mike Benz (Foundation for Freedom Online)",
      investigatorLinks: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      status: "reported",
      finding: "Benz describes a recurring post-crisis pattern: USAID arrives with the American Bar Association and the World Justice Project to draft a target country's oil-revenue-management legislation — the domestic legal plumbing that routes state resource revenue into the U.S.-controlled account arrangements described in the same broadcast (Iraq's single FRBNY account being the template).",
      implication: "Rule-of-law contracting is real and documented in awards databases; whether it extended to drafting foreign oil-revenue-management statutes is checkable through the contracts and cooperative agreements themselves. USAID's records now sit with State, which makes State the FOIA target. (The \"floods ministries with bribe cash to create the oligarch class\" half of the claim is Benz's characterization, not something a contract will state; the award instruments are what's testable.)",
      sources: [
        { label: "Mike Benz — \"Hard Power.\"", url: "https://www.youtube.com/watch?v=drwU6Hh6xQk" }
      ],
      requests: [
        {
          agencyId: "state",
          summary: "State (ex-USAID records) — rule-of-law awards to ABA/WJP for drafting foreign oil-revenue-management legislation",
          subject: "Freedom of Information Act/Privacy Act Request",
          records: "I request copies of the award instruments — contracts, grants, or cooperative agreements, including statements of work — issued by USAID (whose records are now held by the Department of State) to the American Bar Association (including its Rule of Law Initiative) or the World Justice Project, under which the recipient advised on, drafted, or assisted in drafting legislation or regulations governing the management of oil, gas, or mineral revenue in Iraq or Libya, from January 1, 2003 to December 31, 2020. I am requesting the award instruments and statements of work only, not implementation reports or correspondence. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "betar-dhs-deport-list",
      categories: ["Israel / foreign influence", "Surveillance & privacy", "Civil liberties"],
      entities: ["betar", "ice", "dhs", "adl"],
      investigator: "The Intercept, Washington Post, CNN, Boston Globe — and Betar's own public statements",
      investigatorLinks: [
        { label: "The Intercept — the far-right group building a list of pro-Palestine activists to deport", url: "https://theintercept.com/2025/02/06/betar-palestine-school-activists-target-deport-trump/" },
        { label: "CNN — pro-Israel group says it gave the US a list of protesters to deport", url: "https://www.cnn.com/2025/04/02/us/israel-protesters-us-students-deport" }
      ],
      status: "reported",
      finding: "Betar US — the far-right Zionist group the ADL added to its extremist database in February 2025 (the only Jewish organization on it), and which entered a January 2026 settlement of the New York Attorney General's civil-rights investigation into bias-motivated harassment — publicly claims to have submitted the names of hundreds to thousands of pro-Palestinian students, activists, and protesters to the Trump administration, DHS, and ICE, urging their deportation under the President's executive orders. Betar spokesperson Daniel Levy told CNN in 2025: \"We submitted the names of hundreds of protesters and activists to the Trump administration/DHS urging ICE to deport them.\" Betar publicly claimed it had placed Columbia graduate Mahmoud Khalil on its \"deport list\" roughly six weeks before ICE detained him. Its posted \"Students Deport List\" named dozens of people with photos, compiled via facial-recognition and open-source databases, and contained multiple errors (cited \"offenses\" included jaywalking and a noise complaint).",
      implication: "Whether and how a designated-extremist private group's target list entered federal immigration enforcement is a records question, not a rhetorical one. If DHS or ICE received, logged, or acted on Betar's submissions, that generates agency records on the government side: the intake or correspondence from Betar, any referral or tasking for review, and any enforcement action cross-referencing the list. This is the same private-actor-feeds-federal-targeting pattern the NSPM-7 cluster tracks — here with a group a state attorney general has already found engaged in bias-motivated harassment. (Betar's submission figures are its own public statements; the government side is what these records would confirm, bound, or refute.)",
      sources: [
        { label: "Washington Post — Betar pushes on X for deporting more pro-Palestinians", url: "https://www.washingtonpost.com/technology/2025/03/29/zionist-palestinians-deportations-x/" },
        { label: "Boston Globe — is this the deportation list the Trump administration is using?", url: "https://www.bostonglobe.com/2025/04/17/metro/zionist-group-deportation-lists/" },
        { label: "Haaretz — ADL lists far-right Betar USA as a hate group", url: "https://www.haaretz.com/us-news/2025-02-21/ty-article/.premium/embraces-islamophobia-harasses-muslims-adl-lists-far-right-betar-usa-as-hate-group/00000195-2a1d-d05a-ab9f-2e1d09680000" }
      ],
      requests: [
        {
          agencyId: "dhs",
          summary: "DHS/ICE — the intake and routing records for names or lists Betar submitted for immigration enforcement",
          subject: "FOIA Request: DHS/ICE records concerning names or lists submitted by Betar for immigration enforcement",
          records: "I request records held by U.S. Immigration and Customs Enforcement and the Department of Homeland Security concerning submissions from the organization Betar (including Betar US or Betar Worldwide) that identify individuals for immigration enforcement, investigation, or removal, from January 1, 2025 to the date this request is processed. Specifically: (1) any correspondence, email, web-form submission, letter, or list of names received from Betar or persons identifying themselves as acting on its behalf; and (2) any record referring, forwarding, logging, or assigning such submissions for review within ICE or DHS. To keep this request narrow and minimize processing burden, I am NOT requesting the immigration file of any named individual — I am requesting the intake and routing records for the Betar submissions themselves. If responsive records are withheld in whole or part, please describe each withheld record and cite the specific FOIA exemption claimed.",
          ask_no_records: true
        }
      ]
    }
  ]
};
