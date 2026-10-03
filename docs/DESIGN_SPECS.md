# Design Specifications


**Concept:** a school website organised around three paths (Boarding, Defence Academy, IIT/NEET). The hero is three expanding panels, so a visitor picks their path in one click.

**Colour:** Deodar green `#16392f` (hero, footer), Moss `#2f6b57` (accents), Brass `#d29a2b` (buttons, "New" tags), Mist `#e9efec` (section backgrounds), Ink `#10232b` (text). Dark mode follows the system setting.

**Type:** Bricolage Grotesque (headings, buttons) and Public Sans (body). Scale: 16px body, headings `clamp(1.6rem, 3.5vw, 2.4rem)`, hero up to 4.2rem. Line length under 75 characters.

**Layout:** max width 1180px, 20px side padding, left-aligned. Under 800px the panels stack, navigation collapses and the form goes single column.

**Components:** program panel, quick-link bar, filterable notice list, sport tile, achiever card, admissions steps, enquiry form.

**Page map:**
- Home
- Programs: Boarding, Defence Academy (NDA), IIT/NEET (each with faculty, results, fees and apply)
- Admissions: process, dates, form, virtual tour
- Sports hub, with one page per sport (teams, coaches, fixtures, medals, gallery)
- Achievers wall (filter by year and program)
- News and notices (archive, search)
- Faculty directory
- Gallery (photo and video)
- Alumni
- Portal (parent, student, teacher, staff)
- Contact

**Figma (add your link here):** recreate the page with the tokens above using a 12-column grid at 1440px (desktop) and 390px (mobile). The coded `index.html` is the reference.

**Accessibility:** visible focus rings, reduced-motion support, semantic landmarks, buttons rather than click-only divs, WCAG AA contrast targets.

