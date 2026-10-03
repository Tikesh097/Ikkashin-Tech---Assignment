# Design Specifications

### Design Idea

While checking the current school website, I felt that a visitor has to go through a lot of information before finding what they actually need.

So I decided to keep the new design simple and organise the main experience around three important areas: **Boarding, Defence Academy (NDA), and IIT/NEET preparation**.

On the homepage, I planned three large panels for these programs. A student or parent can directly choose the program they are interested in instead of searching through multiple menu options.

### Colours

I chose green as the main colour because it works well with a school and campus-based website. I used a warm brass/golden colour for important buttons so they are easy to notice.

- Deodar Green `#16392F` – main background, hero and footer
- Moss `#2F6B57` – secondary sections and highlights
- Brass `#D29A2B` – buttons and important labels
- Mist `#E9EFEC` – light section backgrounds
- Ink `#10232B` – normal text

I also planned dark mode based on the user's system preference.

### Typography

I used **Bricolage Grotesque** for headings and buttons because it gives the website a modern look.

For normal paragraphs and information, I chose **Public Sans** because it is simple and easy to read.

Body text starts at `16px`, and heading sizes change according to the screen size using CSS `clamp()`.

I also kept long paragraphs within a reasonable width so parents and students can read them comfortably.

### Layout and Responsive Design

The main content has a maximum width of `1180px` so it does not become too stretched on large screens.

For desktop, I designed the page using a **12-column grid**.

I also considered mobile users because many parents and students may open the website from their phones.

Below `800px`:

- The three program panels appear one below another.
- The main navigation changes to a mobile menu.
- Forms change from two columns to one column.
- Cards adjust according to the available screen width.

I designed the main desktop version at **1440px** and the mobile version at **390px**.

### Main Components

Instead of creating every section differently, I planned reusable components such as:

- Program cards
- Quick links
- Notices with filters
- Sports cards
- Student achievement cards
- Admission steps
- Enquiry form
- News and event cards

This keeps the design consistent and also makes the frontend easier to maintain.

### Website Structure

I kept the homepage focused on the information that a new visitor would normally look for first.

The main pages are:

- Home
- Boarding
- Defence Academy (NDA)
- IIT/NEET
- Admissions
- Sports
- Achievements
- News & Notices
- Faculty
- Gallery
- Alumni
- Portal
- Contact

For each program page, I would show useful information such as the program details, faculty, fees, results and an **Apply Now** option.

For sports, I planned a separate Sports Hub instead of showing only a simple list. Each sport can show its team, coach, fixtures, medals and photos.

Similarly, the Achievers section can be filtered by year and program so old achievements are not lost when new ones are added.

### Accessibility

I also kept basic accessibility in mind while designing the website.

Buttons and links should be usable with a keyboard, focus should be clearly visible, images should have meaningful alternative text, and forms should have proper labels and error messages.

I would also respect the user's reduced-motion preference and try to maintain WCAG AA colour contrast.

### Figma

I will create both desktop and mobile designs in Figma using the same colours, typography and components used in the coded website.

**Figma Link:** `[Add link here]`

The final `index.html` will be used as the reference while creating the Figma design so that the design and actual implementation remain consistent.
