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
      "Fee waiver: I request a waiver of all fees under 5 U.S.C. § 552(a)(4)(A)(iii). Disclosure is in the public " +
      "interest because it is likely to contribute significantly to public understanding of the operations and " +
      "activities of government — specifically, how federal digital and identity infrastructure is being built, " +
      "authorized, and used — and is not in my commercial interest. If a fee waiver is denied, please notify me " +
      "before incurring any costs over $25.",
    expedited:
      "Expedited processing: I request expedited processing under 5 U.S.C. § 552(a)(6)(E). There is an urgency to " +
      "inform the public concerning actual or alleged federal government activity that is the subject of widespread " +
      "and ongoing media attention.",
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
    { id: "state", name: "U.S. Department of State", email: null,
      portal: "https://foia.state.gov/Request/FOIA.aspx",
      submitNote: "State takes FOIA only through its own portal (foia.state.gov) or by mail — no public email intake." },
    { id: "nara", name: "National Archives and Records Administration", email: "foia@nara.gov",
      portal: "https://www.archives.gov/foia/foia-request.html",
      submitNote: "NARA accepts FOIA by email, mail, or fax." },
    { id: "gsa", name: "U.S. General Services Administration", email: null,
      portal: "https://www.gsa.gov/reference/freedom-of-information-act-foia",
      submitNote: "GSA requires its PAL portal (linked on that page) or mail — not email." },
    { id: "eac", name: "U.S. Election Assistance Commission", email: null,
      portal: "https://www.eac.gov/foia/freedom-information-act-foia",
      submitNote: "EAC accepts email/mail/fax but publishes no general FOIA mailbox — use its FOIA page for the current contact." },
    { id: "omb", name: "Office of Management and Budget", email: "OMBFOIA@omb.eop.gov",
      portal: "https://www.foia.gov",
      submitNote: "OMB accepts FOIA by email." },
    { id: "usadf", name: "U.S. African Development Foundation", email: "info@usadf.gov",
      portal: "https://www.usadf.gov/contact-us",
      submitNote: "USADF accepts FOIA by email — mark the subject line \"Freedom of Information Act Request\"." },
    { id: "oge", name: "U.S. Office of Government Ethics", email: "usoge@oge.gov",
      portal: "https://www.oge.gov",
      submitNote: "OGE accepts FOIA by email." },
    { id: "doj", name: "U.S. Department of Justice", email: null,
      portal: "https://www.justice.gov/oip/submit-and-track-request-or-appeal",
      submitNote: "DOJ takes FOIA through its FOIA STAR portal (or the relevant component's portal), not email." },
    { id: "fbi", name: "Federal Bureau of Investigation", email: null,
      portal: "https://efoia.fbi.gov",
      submitNote: "FBI takes FOIA only through its eFOIPA portal (efoia.fbi.gov); its email address is for questions only." },
    { id: "treasury", name: "U.S. Department of the Treasury", email: null,
      portal: "https://foia.treasury.gov",
      submitNote: "Treasury takes FOIA through its portal (foia.treasury.gov) or FOIA.gov." },
    { id: "dod", name: "U.S. Department of Defense", email: null,
      portal: "https://www.foia.gov",
      submitNote: "DoD routes FOIA by component — via FOIA.gov, select Office of the Secretary of Defense/Joint Staff for OSD officials, or the Department of the Army." },
    { id: "usss", name: "U.S. Secret Service", email: null,
      portal: "https://www.securerelease.us",
      submitNote: "As of Oct 2025, USSS takes FOIA only through its SecureRelease portal (securerelease.us) or by mail — no email." },
    { id: "dhs", name: "U.S. Department of Homeland Security", email: null,
      portal: "https://www.dhs.gov/foia",
      submitNote: "DHS ended email and mail FOIA intake (Jan 2026) — submit only via FOIA.gov or a DHS FOIA portal." }
  ],

  investigations: [
    {
      id: "passports-eop",
      categories: ["NDS takeover"],
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
          records: "I request a copy of the specific instrument(s) that authorized the Executive Office of the President or the National Design Studio — rather than the Department of State — to register or operate the passports.gov domain: namely, any interagency agreement, memorandum of understanding, memorandum of agreement, or delegation of authority between the Department of State and the National Design Studio (or the Executive Office of the President) concerning passports.gov, executed or in effect between January 1, 2025 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence."
        },
        {
          agencyId: "nara",
          summary: "NARA — any records schedule filed for NDS",
          subject: "FOIA Request: records schedules filed by or for the National Design Studio",
          records: "I request the following records: any records schedule, records-disposition authority, or records-management agreement filed by, for, or on behalf of the National Design Studio, dated between August 1, 2025 and the date this request is processed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "hogan-login-gov",
      categories: ["NDS takeover"],
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
          records: "I request a copy of any interagency agreement, memorandum of understanding, statement of work, or task order between the U.S. Election Assistance Commission and the National Design Studio (or the Executive Office of the President) concerning vote.gov — or any preview, replacement, or redesign of vote.gov — dated between January 1, 2026 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "no-pias-sorns",
      categories: ["Surveillance & privacy", "NDS takeover"],
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
          records: "I request the following records: any Privacy Impact Assessment (PIA) or System of Records Notice (SORN) prepared for, covering, or referencing any National Design Studio program or information system, dated between August 1, 2025 and the date this request is processed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "posthog-federal",
      categories: ["Surveillance & privacy"],
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
          ask_no_records: true
        }
      ]
    },
    {
      id: "akash-usadf",
      categories: ["NDS takeover"],
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
          ask_no_records: true
        }
      ]
    },
    {
      id: "gebbia-coi",
      categories: ["Conflict of interest"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "Joe Gebbia leads the National Design Studio (effective Aug 21, 2025) while reportedly retaining an active Tesla board seat — with no public ethics disclosure linked.",
      implication: "A presidential-appointee design chief with an unresolved private-sector tie and no visible Form 278e disclosure or ethics waiver.",
      sources: [
        { label: "Executive Order 14338", url: "" },
        { label: "FedScoop / Wikipedia (URLs pending)", url: "" }
      ],
      requests: [
        {
          agencyId: "oge",
          summary: "OGE — Gebbia's financial disclosure + any ethics waiver",
          subject: "FOIA Request: OGE Form 278e and ethics waiver for Joe Gebbia",
          records: "I request a copy of the OGE Form 278e public financial disclosure report filed by Joe Gebbia in connection with his federal appointment, and any ethics waiver, recusal agreement, or authorization to hold outside positions issued to him, dated between August 1, 2025 and the date this request is processed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "automonitor",
      categories: ["Surveillance & privacy"],
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
          records: "I request a copy of any privacy review, Privacy Impact Assessment, or written authorization permitting the National Design Studio to load behavioral-tracking or analytics scripts served from ndstudio.gov infrastructure (including cdn.infra.ndstudio.gov) onto federal agency websites, dated between August 1, 2025 and the date this request is processed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "doj-no-client-list",
      categories: ["Human trafficking"],
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "On July 7, 2025, the DOJ and FBI released an unsigned memo concluding — after reviewing 300+ GB of evidence — that there was no Epstein \"client list\" and reaffirming his 2019 death as suicide; the accompanying ~11 hours of jail video was missing about a minute.",
      implication: "The federal review that officially closed the case. The memo, the evidence it reviewed, and the complete unedited video are records the public can request. (The missing minute was later attributed to a nightly system reset.)",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — the complete, unedited facility video for the date of Epstein's death",
          subject: "FOIA Request: complete unedited surveillance video referenced in the July 7, 2025 Epstein memo",
          records: "I request a copy of the complete, unedited surveillance-camera footage from the federal facility where Jeffrey Epstein died, covering the 24-hour period of his death, as referenced in the July 7, 2025 joint DOJ/FBI memorandum. I am requesting the original continuous recording, not an excerpted or compiled version.",
          ask_no_records: true
        },
        {
          agencyId: "doj",
          summary: "DOJ — the July 7, 2025 memo + the index of evidence it reviewed",
          subject: "FOIA Request: July 7, 2025 DOJ/FBI Epstein memorandum and evidence index",
          records: "I request a copy of the final July 7, 2025 joint DOJ/FBI memorandum concerning the Jeffrey Epstein review, together with any index, inventory, or list identifying the categories of evidence reviewed in reaching its conclusions. To keep this request narrow and minimize search burden, I am not seeking general email correspondence."
        }
      ]
    },
    {
      id: "maxwell-blanche-interview",
      categories: ["Human trafficking"],
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "Deputy Attorney General Todd Blanche interviewed Ghislaine Maxwell over two days in late July 2025; soon after, she was quietly moved to a minimum-security prison camp — a transfer left unexplained at the time (Blanche later cited threats to her life).",
      implication: "A senior DOJ interview of the only convicted co-conspirator, followed by an unexplained transfer. The interview records are requestable.",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      requests: [
        {
          agencyId: "doj",
          summary: "DOJ — records of Blanche's late-July 2025 interview of Maxwell",
          subject: "FOIA Request: DOJ records of the July 2025 interview of Ghislaine Maxwell by Deputy AG Todd Blanche",
          records: "I request a copy of any interview memoranda, FD-302 reports, or transcripts documenting the interview of Ghislaine Maxwell conducted by Deputy Attorney General Todd Blanche over two days in late July 2025. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "epstein-pages-withheld",
      categories: ["Human trafficking"],
      investigator: "John Kiriakou (on Julian Dorey's podcast)",
      investigatorLinks: [
        { label: "The Deep State — Kiriakou × Dorey, Pt 1", url: "https://www.youtube.com/watch?v=eKTJ8T4D02w" }
      ],
      status: "confirmed",
      finding: "John Kiriakou says roughly 3–3.5 million additional Epstein-related pages remain withheld despite the Epstein Files Transparency Act (which he cites as passing the House 419–1 and the Senate 100–0).",
      implication: "If a near-unanimous transparency law was enacted, the index of what was identified — and any decision to withhold — are themselves records. (Kiriakou's page figure and vote counts are on-air assertions; this request tests them against the record.)",
      sources: [
        { label: "The Deep State — Kiriakou × Dorey, Pt 1 (@1:08)", url: "https://www.youtube.com/watch?v=eKTJ8T4D02w" }
      ],
      requests: [
        {
          agencyId: "doj",
          summary: "DOJ — the records index + any withholding determination under the Transparency Act",
          subject: "FOIA Request: records identified and withheld under the Epstein Files Transparency Act",
          records: "I request a copy of the index, log, or schedule of records identified for processing under the Epstein Files Transparency Act, and any written determination withholding records from release under that Act, dated from the Act's enactment to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "bondi-binders",
      categories: ["Human trafficking"],
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
          summary: "DOJ — the binder contents + who assembled them",
          subject: "FOIA Request: contents and preparation of the February 27, 2025 'Epstein files' binders",
          records: "I request a copy of the materials compiled into the binders labeled \"the Epstein files\" distributed at the White House on February 27, 2025, and any records identifying what was included in those binders and which Department of Justice office assembled or vetted them. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "dialog-society-officials",
      categories: ["Conflict of interest"],
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
      id: "fbi-kirk-tipline",
      categories: ["Kirk assassination & coverup", "NDS takeover"],
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "The National Design Studio built a preview of an \"FBI Charlie Kirk tip-line\" site (fbi-kirk-tipline.previews.ndstudio.gov, with a certificate on record) — while the public domain fbi-kirk-tipline.gov was never registered.",
      implication: "A White House design office stood up infrastructure for an FBI tip line on the Kirk case that never publicly launched. Whether it reflects a real, authorized FBI program — and who directed it — is a records question. (A preview is not a launched program; the certificate was set to expire June 11, 2026, so its renewal or lapse signals whether the program continued.)",
      sources: [
        { label: "crt.sh (cert 24970208643)", url: "https://crt.sh" },
        { label: "CISA dotgov-data", url: "https://github.com/cisagov/dotgov-data" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — records of any Charlie Kirk tip-line site/program + NDS role",
          subject: "FOIA Request: FBI \"Charlie Kirk\" tip-line website or program and any National Design Studio involvement",
          records: "I request a copy of any records concerning an FBI tip-line website or program relating to Charlie Kirk — including any site at fbi-kirk-tipline.gov or hosted on National Design Studio infrastructure — and any interagency agreement, task order, or authorization between the FBI and the National Design Studio regarding such a site, from September 1, 2025 to the date this request is processed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "kolvet-eeob-visit",
      categories: ["Kirk assassination & coverup"],
      investigator: "Candace Owens",
      investigatorLinks: [
        { label: "Candace — Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      status: "reported",
      finding: "Candace Owens reports that Andrew Kolvet, Charlie Kirk's producer, was at the White House / Eisenhower Executive Office Building the day before the DOJ released the Epstein files — while a Charlie Kirk show was pre-recorded (with Kash Patel) to make it appear he was in Arizona.",
      implication: "If a Kirk-world figure took a White House meeting the day before a major Epstein-files release, entry records would document it. Strong caveat: courts have ruled White House visitor logs held by the Secret Service are often NOT agency records subject to FOIA, so this may be denied on that ground (EEOB-tenant agencies like OMB are a separate avenue). Single-source, on-air account.",
      sources: [
        { label: "Candace Owens, Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      requests: [
        {
          agencyId: "usss",
          summary: "Secret Service — EEOB/White House entry records for Andrew Kolvet",
          subject: "FOIA Request: White House complex / EEOB access records for Andrew Kolvet",
          records: "I request a copy of any entry, exit, visitor, or access records for Andrew Kolvet at the White House complex and the Eisenhower Executive Office Building on the date of, and the day before, the Department of Justice's public release of the Epstein files (please insert the specific calendar date before filing). I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "dod-erika-messaging",
      categories: ["Kirk assassination & coverup"],
      investigator: "Candace Owens",
      investigatorLinks: [
        { label: "Candace — Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      status: "reported",
      finding: "Candace Owens alleges the Department of Defense (\"Department of War\") orchestrated messaging to artificially boost Erika Kirk to the #1 social-media trend; she cites no documentary evidence.",
      implication: "A claim that a federal department ran a domestic messaging/influence effort around a private individual. If true, public-affairs guidance or social-media records would exist. Single-source, on-air allegation with no evidence shown — this request is what would confirm or refute it.",
      sources: [
        { label: "Candace Owens, Ep 352", url: "https://www.youtube.com/watch?v=3QJqtW_NOSI" }
      ],
      requests: [
        {
          agencyId: "dod",
          summary: "DoD — any public-affairs/social-media activity re Erika Kirk",
          subject: "FOIA Request: Department of Defense public-affairs or social-media records concerning Erika Kirk",
          records: "I request a copy of any public-affairs guidance, social-media activity log, or messaging directive concerning Erika Kirk issued by or within the Department of Defense, from September 1, 2025 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "posthog-no-contract",
      categories: ["Surveillance & privacy"],
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
      investigator: "The New York Times",
      investigatorLinks: [
        { label: "NYT — Haberman & Swan (Jun 2026)", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      status: "confirmed",
      finding: "On Feb 21, 2025, Attorney General Pam Bondi said an Epstein \"client list\" was \"sitting on my desk right now to review\"; less than five months later, the July 7 DOJ/FBI memo concluded no client list existed.",
      implication: "A public reversal by the Attorney General — from \"on my desk\" to \"does not exist.\" The records she was reviewing in February, and the basis for the July conclusion, are requestable from DOJ.",
      sources: [
        { label: "NYT — Haberman & Swan, Jun 10 2026", url: "https://www.nytimes.com/2026/06/10/magazine/trump-epstein-files-white-house-vance-doj.html" }
      ],
      requests: [
        {
          agencyId: "doj",
          summary: "DOJ — the records behind Bondi's \"on my desk\" → \"no list\" reversal",
          subject: "FOIA Request: Epstein records reviewed by the Attorney General (Feb 2025) and the basis for the July 2025 no-client-list conclusion",
          records: "I request a copy of any records reflecting the Epstein-related material the Attorney General referenced as being \"on my desk\" for review in February 2025, and any memorandum or analysis stating the basis for the July 7, 2025 conclusion that no Epstein client list exists, dated between January 1 and July 31, 2025. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "butler-investigation",
      categories: ["Butler shooting"],
      investigator: "Candace Owens (citing Tucker Carlson)",
      investigatorLinks: [
        { label: "Candace — Ep 348", url: "https://www.youtube.com/watch?v=WoXd4oLwd3w" }
      ],
      status: "reported",
      finding: "Tucker Carlson claimed (on Mario Nawfal's show, replayed by Candace Owens) that \"Trump shut down the investigation into Butler\" — the July 13, 2024 assassination attempt at Trump's Butler, Pennsylvania rally — and that Dan Bongino was \"terrified.\" Candace raised whether the attempt had been staged.",
      implication: "If the federal investigation into a presidential assassination attempt was halted or curtailed, its case status and any closure directive would be on record. Single-source, secondhand claim (Tucker via Candace); \"staged\" is an open question she polled, not a finding — this request is what would test the \"shut it down\" assertion.",
      sources: [
        { label: "Candace Owens, Ep 348 (@1:26)", url: "https://www.youtube.com/watch?v=WoXd4oLwd3w" }
      ],
      requests: [
        {
          agencyId: "fbi",
          summary: "FBI — status / closure records for the Butler shooting investigation",
          subject: "FOIA Request: investigative status and any closure directive for the July 13, 2024 Butler assassination attempt",
          records: "I request a copy of any records reflecting the current investigative status of, or any directive to close, halt, or curtail, the FBI's investigation into the July 13, 2024 assassination attempt on Donald Trump in Butler, Pennsylvania — including any final case-disposition or closure memorandum. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "flock-federal-alpr",
      categories: ["Surveillance & privacy"],
      investigator: "Tommy G (on Julian Dorey's podcast)",
      investigatorLinks: [
        { label: "Julian Dorey × Tommy G — Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" }
      ],
      status: "reported",
      finding: "Tommy G and tech journalist Ben Jordan investigated Flock Safety, whose automated license-plate-reader (ALPR) cameras — voted in piecemeal by local city councils and sheriffs — feed a national network, with new \"scope-creep\" updates reportedly adding audio and facial capabilities. Federal agencies (e.g., the U.S. Marshals) tap the network to locate people.",
      implication: "A privately-run national surveillance network that local bodies opt into piecemeal, increasingly queried by federal law enforcement. The federal access agreements and query/audit logs — not the local camera contracts — are the requestable federal records.",
      sources: [
        { label: "Tommy G × Julian Dorey, Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" },
        { label: "Ben Jordan — Flock reporting", url: "" }
      ],
      requests: [
        {
          agencyId: "doj",
          summary: "DOJ — US Marshals / FBI access agreements with Flock Safety's ALPR network",
          subject: "FOIA Request: U.S. Marshals Service and FBI access to Flock Safety's ALPR network",
          records: "I request a copy of any contract, memorandum of understanding, data-sharing agreement, or access-and-audit policy governing the U.S. Marshals Service's and/or the FBI's access to or use of Flock Safety's automated license-plate-reader (ALPR) network, in effect between January 1, 2024 and the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "us-israel-military-merger",
      categories: ["Israel / foreign influence"],
      investigator: "Tommy G (on Julian Dorey's podcast)",
      investigatorLinks: [
        { label: "Julian Dorey × Tommy G — Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" }
      ],
      status: "reported",
      finding: "Tommy G reports that proposed legislation (he cites Sections 224 and 226), co-led by Rep. Adam Smith (D) and Rep. Mike Rogers (R), would deeply integrate U.S. and Israeli military and defense-industrial operations — allowing Israeli firms to operate here, adding broad data-sharing, and reducing the requirement to notify Congress and the public about aid to Israel. Netanyahu reportedly claimed credit for the framework.",
      implication: "The bill itself sits in Congress (FOIA-exempt), but the executive-branch side is requestable: any U.S.-Israel defense-integration framework, the arms/financing records, and any provision reducing aid-notification transparency. (Proposed legislation may change; \"merger\" is Tommy G's framing; U.S.-Israel defense cooperation is longstanding and bipartisan.)",
      sources: [
        { label: "Tommy G × Julian Dorey, Ep 437", url: "https://www.youtube.com/watch?v=WoIgX-i2hSs" }
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
      id: "trump-jr-osc-loan",
      categories: ["Conflict of interest"],
      investigator: "Tommy G",
      investigatorLinks: [
        { label: "Tommy G — \"Investigating How the Pentagon Wastes Trillions\"", url: "https://www.youtube.com/watch?v=ZsCUvzD_vqY" }
      ],
      status: "reported",
      finding: "Tommy G reports that a startup co-founded by Donald Trump Jr. received a roughly $626 million Pentagon award — described as the single largest loan ever issued by the Department of Defense's Office of Strategic Capital (taxpayer-funded).",
      implication: "A loan of this size, from a DoD financing office, to a venture tied to the President's son is exactly what conflict-of-interest review and award-selection records exist to document. The loan agreement, application, selection memos, and any ethics screening are requestable.",
      sources: [
        { label: "Tommy G — Pentagon waste investigation", url: "https://www.youtube.com/watch?v=ZsCUvzD_vqY" }
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
      investigator: "Tommy G",
      investigatorLinks: [
        { label: "Tommy G — \"What Every American Should Know about Data Centers\"", url: "https://www.youtube.com/watch?v=MHJtIkfA-s8" }
      ],
      status: "reported",
      finding: "Tommy G reports that Check Point — an Israeli cybersecurity firm founded by Shlomo Kramer, a veteran of the IDF's Unit 8200 (Israel's NSA-equivalent) — serves as a security gatekeeper for nearly every top-50 Fortune 500 company (a data-center whistleblower said it monitors all employee communications), and Kramer publicly argued the U.S. should \"limit the First Amendment.\"",
      implication: "If a firm tied to a foreign signals-intelligence unit secures major U.S. infrastructure, its footprint in federal systems is a public-records question: which federal agencies use Check Point, under what authorizations, and with what data-access or monitoring scope. (Check Point is a mainstream, widely-used vendor and foreign-headquartered security vendors are common and can be FedRAMP-authorized — the request simply surfaces the federal specifics.)",
      sources: [
        { label: "Tommy G — data-centers investigation", url: "https://www.youtube.com/watch?v=MHJtIkfA-s8" }
      ],
      requests: [
        {
          agencyId: "gsa",
          summary: "GSA / FedRAMP — Check Point's federal authorization + which agencies deploy it",
          subject: "FOIA Request: FedRAMP authorization and federal deployment of Check Point cybersecurity products",
          records: "I request a copy of any FedRAMP authorization package or authorization-to-operate (ATO) on file for Check Point Software products, and any record identifying federal agencies that have procured or deployed Check Point cybersecurity products and the data-access or monitoring scope of those deployments, from January 1, 2023 to the date this request is processed. If no such records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "save-system-voter-database",
      categories: ["Elections & voting", "Surveillance & privacy"],
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
          summary: "DHS — the SAVE System / federal voter-citizenship database design + legal authority",
          subject: "FOIA Request: the SAVE System federal citizenship and voter-eligibility verification database",
          records: "I request a copy of records concerning the SAVE System or any federal citizenship- and voter-eligibility verification database, including its design or architecture documents, the legal-authority memorandum supporting its creation and use for voter eligibility, any accuracy or false-positive-rate assessment, and any interagency agreement directing its creation, from January 1, 2025 to the date this request is processed. If no such records exist, I request written confirmation of that fact.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "doj-state-voter-data",
      categories: ["Elections & voting"],
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
          agencyId: "doj",
          summary: "DOJ — the request letters to states + legal basis + voter-data retention policy",
          subject: "FOIA Request: DOJ requests to states for voter-registration data and related data-handling",
          records: "I request a copy of records concerning the Department of Justice's 2025 requests to U.S. states and the District of Columbia for voter-registration or voter-eligibility data, including the request letters, the legal authority asserted, and any policy governing the retention, use, or sharing of voter data received in response, from January 1, 2025 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "maralago-prostitute-party-tip",
      categories: ["Human trafficking"],
      investigator: "Sharlene Rochard (Epstein survivor) + the released Epstein files",
      investigatorLinks: [
        { label: "Rochard interview — \"The Briefing with Jen Psaki\" (MS NOW)", url: "https://www.youtube.com/watch?v=Yoi4aUZ0EDM" },
        { label: "Raw Story coverage", url: "https://www.rawstory.com/donald-trump-jeffrey-epstein-2674617242/" }
      ],
      status: "reported",
      finding: "An FBI document in the released Epstein files records a tip describing a party \"for prostitutes\" at Mar-a-Lago tied to Donald Trump. Epstein survivor Sharlene Rochard, a former model, has said on the record that she attended Mar-a-Lago parties as a young model.",
      implication: "The tip and any FBI follow-up are federal records. A FOIA can surface the full, unredacted document and whether the tip was ever investigated. (This is a third-party tip/allegation contained in the files, not an adjudicated finding; DOJ's July 2025 memo claimed no client list.)",
      sources: [
        { label: "Epstein files tip on Mar-a-Lago \"prostitute party\" (Yahoo)", url: "https://www.yahoo.com/news/articles/epstein-files-dump-reveals-tip-022850330.html" },
        { label: "Raw Story", url: "https://www.rawstory.com/donald-trump-jeffrey-epstein-2674617242/" }
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
      id: "doj-antisemitism-task-force",
      categories: ["Israel / foreign influence", "Civil liberties"],
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
          summary: "DOJ — the antisemitism task force's charter, targets, and outside-group coordination",
          subject: "FOIA Request: charter, scope, and case activity of the DOJ Task Force to Combat Antisemitism",
          records: "I request a copy of the charter, mission statement, and operating procedures of the Department of Justice Task Force to Combat Antisemitism; any list or log of individuals, organizations, or cases it has investigated, referred, or taken action on; and any records of its coordination with outside advocacy organizations, dated from January 1, 2025 to the date this request is processed. To keep this request narrow and minimize search burden, I am not seeking general email correspondence.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "fbi-adl-relationship",
      categories: ["Civil liberties", "Surveillance & privacy"],
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
          records: "I request a copy of records concerning the FBI's relationship with the Anti-Defamation League, including: any memorandum of understanding or partnership agreement; the tips, referrals, or reports the ADL provided to the FBI about U.S. individuals or organizations; ADL-provided training materials; and any records supporting the October 2025 decision to terminate the relationship, including the basis for the determination that the ADL was \"spying on conservative groups,\" from January 1, 2015 to the date this request is processed.",
          ask_no_records: true
        }
      ]
    }
  ]
};
