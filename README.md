# FOIA Around and Find Out

Independent investigators keep surfacing things in public records — who owns a federal `.gov` domain, what got built, what paperwork is missing. This tool turns those findings into **ready-to-file FOIA requests**: pick a finding, and it drafts a properly-scoped public-records request you review and submit yourself.

- **Client-side only.** Nothing you type leaves your browser. No analytics, no network calls. The "Submit" button just opens [FOIA.gov](https://www.foia.gov); you file it.
- **Narrow by default.** Every request names specific agencies, document types, subjects, and date ranges — because broad "all records about X" requests get denied as overbroad.
- **Credited.** Each finding links to the investigator who surfaced it.
- **CC0.** Fork it, mirror it, add findings. It's two files: `index.html` + `foia-data.js`.

## Add a finding
Edit `foia-data.js` → add an entry to `investigations[]` (investigator, finding, implication, sources, and the narrow `requests` it motivates). No build step.

## What's new
See [CHANGELOG.md](CHANGELOG.md) for a human-readable log of new findings, threads, and features.
