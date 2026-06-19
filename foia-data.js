/* FOIA Around and Find Out — data
 * Pure data, no dependencies. Drives index.html.
 * Model: investigations[] (a credited finding + the narrow FOIA requests it motivates).
 * Every request is NARROW BY DEFAULT — named entities, specific document types, date ranges —
 * because broad "all records about X" requests get soft-denied as overbroad.
 * The human reviews and submits via FOIA.gov. Placeholders: {{NAME}} {{EMAIL}} {{ADDRESS}} {{DATE}}
 */
const FOIA = {
  meta: {
    product: "FOIA Around, Find Out",
    tagline: "Independent investigators found these things in public records. A FOIA request makes the government hand over the official paperwork that would prove it. Pick a finding — we'll draft the request.",
    statute: "Freedom of Information Act, 5 U.S.C. § 552",
    portal: "https://www.foia.gov",
    submit_note: "Email is the fast path — it opens a message already addressed and written, so you just review and hit send. You can also file at the federal portal, FOIA.gov, but heads-up: it's a maze of forms, fields, and click-throughs, and the link just drops you on its landing page with no sense of the process. Use email wherever it's offered below.",
    narrowing_note: "Each request is deliberately narrow — specific agency, specific document types, named subjects, and a date range. Broad requests (\"all records about X\") are routinely denied as overbroad; narrow ones get answered. Edit before sending if you want to tighten further.",
    do_not: "This tool only drafts a letter — it submits nothing and collects nothing you type. Don't fire identical mass copies at one office; agencies deprioritize duplicates. Pick the angle that fits you."
  },

  /* Reusable paragraphs appended to every generated request. */
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

  /* Agencies referenced by investigations. Submit through FOIA.gov (pick the agency there). */
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
      submitNote: "OMB accepts FOIA by email." }
  ],

  /* Each investigation: a credited finding + the narrow requests that would surface the records behind it. */
  investigations: [
    {
      id: "passports-eop",
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
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
          summary: "State Dept — its agreements & communications with NDS about passports.gov",
          subject: "FOIA Request: Department of State records concerning the National Design Studio and passports.gov",
          records: "I request the following records: all interagency agreements, memoranda of understanding (MOUs), and email communications between the U.S. Department of State and the National Design Studio — or any office within the Executive Office of the President — concerning the domain passports.gov or any subdomain of passports.gov, created or sent between January 1, 2025 and the date this request is processed.",
          ask_no_records: true
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
          records: "I request the following records: all detail agreements, memoranda of understanding, appointment or onboarding records, and reimbursable-detail paperwork concerning the assignment of Greg Hogan from the National Design Studio to login.gov or the Technology Transformation Service, dated between January 1, 2026 and the date this request is processed."
        },
        {
          agencyId: "gsa",
          summary: "GSA — plans to extend login.gov to passports & driver's licenses",
          subject: "FOIA Request: login.gov expansion to passport and driver's-license verification",
          records: "I request the following records: all planning documents, requirement specifications, and internal communications concerning the expansion of login.gov identity verification to cover U.S. passports or state driver's licenses, created between January 1, 2026 and the date this request is processed."
        }
      ]
    },
    {
      id: "vote-gov-preview",
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
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
          records: "I request the following records: all communications, interagency agreements, and project or design documents between the U.S. Election Assistance Commission and the National Design Studio — or any office within the Executive Office of the President — concerning vote.gov or any preview, replacement, or redesign of vote.gov, created between January 1, 2026 and the date this request is processed.",
          ask_no_records: true
        }
      ]
    },
    {
      id: "no-pias-sorns",
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
      investigator: "The Drey Dossier",
      investigatorLinks: [
        { label: "NDS servers map", url: "https://thedreydossier.github.io/NDS_servers_map/" },
        { label: "Substack", url: "https://thedreydossier.substack.com" }
      ],
      status: "confirmed",
      finding: "The PostHog analytics SDK — and, on realfood.gov, its session recorder — appears in the code of multiple federal .gov sites (realfood.gov, techforce.gov, trumpaccounts.gov).",
      implication: "Third-party behavioral analytics, including session recording, embedded in federal websites. (Note: trumpaccounts.gov is Treasury's, so the common thread is the vendor, not a single owner.)",
      sources: [
        { label: "JavaScript bundle inspection", url: "" }
      ],
      requests: [
        {
          agencyId: "omb",
          summary: "OMB — contracts & privacy reviews for PostHog on federal sites",
          subject: "FOIA Request: federal use of PostHog analytics software",
          records: "I request the following records: all contracts, task orders, procurement records, data-processing agreements, and privacy reviews concerning the use of PostHog analytics software (including any session-recording features) on federal .gov websites, dated between January 1, 2025 and the date this request is processed.",
          ask_no_records: true
        }
      ]
    }
  ]
};
