# Approach Explanation


**Problems found:** content is years out of date (2019-20 exams, Covid notices, "Admission open 2020-21"), template placeholders are visible, and the three-school structure is not visible. IIT/NDA preparation and sports are plain lists, there are no achievements or results, admissions are weak, and nothing is shareable or SEO-ready.

**Why this structure:** visitors arrive with a goal, so the site opens with the three paths and keeps admissions, notices and the portal one click away. Sports and achievements get their own sections because they are what the school is known for.

**3,000+ students and 400+ staff:** cached server-rendered pages and a CDN absorb admission-season traffic. MongoDB indexes, pagination and rate limiting keep the API fast, and roles keep each group to its own data.

**Dynamic content:** staff use the built-in admin panel (React plus a role-protected API), with no developer needed. Notices expire on their own, achievements and events publish on a schedule.

**Digital presence:** every achievement and news item produces a shareable card and an SEO page. Share links carry Open Graph tags for rich previews, and structured data and Google Business info help local search, and the admin can turn a result into a social post in a few clicks.
