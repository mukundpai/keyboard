# KeyMaster Pro - UI/UX Design Guidelines

## Color System

### Primary Palette
- **Background**: #1A1A1A (dark)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #AAAAA (70% opacity)
- **Text Muted**: #666666 (50% opacity)
- **Accent**: #4ECDC4 (cyan)
- **Accent Light**: #76E4E0
- **Accent Dark**: #3BA39C

### Semantic Colors
- **Success**: #4ade80 (green)
- **Error**: #ff6b6b (red)
- **Warning**: #fbbf24 (amber)
- **Info**: #3b82f6 (blue)

---

## Typography

### Font Families
- **Display**: Syncopate (headings, large text)
- **Serif**: Merriweather (body text)
- **Mono**: Space Mono (code, typing area)
- **Sans**: Inter (UI, labels)

### Font Sizes
- **H1**: 3.5rem (56px) — Page title
- **H2**: 2.25rem (36px) — Section title
- **H3**: 1.5rem (24px) — Subsection
- **Body**: 1rem (16px) — Default text
- **Small**: 0.875rem (14px) — Captions, hints
- **Tiny**: 0.75rem (12px) — Labels

### Font Weights
- **Light**: 300 — Subtle text
- **Regular**: 400 — Body text
- **Medium**: 500 — Labels, buttons
- **Semibold**: 600 — Emphasized text
- **Bold**: 700 — Headings

---

## Spacing System

### Base Unit: 4px

```
xs: 4px (1 unit)
sm: 8px (2 units)
md: 16px (4 units)
lg: 24px (6 units)
xl: 32px (8 units)
2xl: 48px (12 units)
3xl: 64px (16 units)
```

**Usage:**
- Padding: md (16px) for most containers
- Margin: lg (24px) between sections
- Gap: sm (8px) between items in lists

---

## Component Patterns

### Buttons

**Primary Button**
- Background: Accent color
- Text: White
- Padding: 12px 24px
- Border radius: 8px
- Hover: Lighter shade

**Secondary Button**
- Background: Accent with 20% opacity
- Text: Accent color
- Border: 1px Accent/30%
- Padding: 12px 24px
- Border radius: 8px

**Ghost Button**
- Background: Transparent
- Text: Text Primary
- Border: 1px Border/20%
- Padding: 12px 24px
- Hover: Background 5%

### Input Fields

- **Height**: 40px
- **Padding**: 12px
- **Border**: 1px solid Border/20%
- **Border radius**: 6px
- **Focus**: Border Accent, shadow
- **Error**: Border red-500

### Cards

- **Background**: Background/50% (semi-transparent)
- **Border**: 1px solid Border/10%
- **Padding**: 24px
- **Border radius**: 12px
- **Shadow**: `0 4px 6px rgba(0,0,0,0.1)`

### Modals

- **Max width**: 500px
- **Padding**: 24px
- **Border radius**: 12px
- **Backdrop**: Black/50% blur
- **Animation**: Fade + Scale

---

## Animations

### Timing
- **Quick**: 150ms — Buttons, hovers
- **Standard**: 300ms — Modals, transitions
- **Slow**: 500ms — Page transitions

### Easing
- **Standard**: cubic-bezier(0.4, 0, 0.2, 1)
- **Enter**: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Exit**: cubic-bezier(0.17, 0.55, 0.55, 1)

### Common Patterns
- **Fade**: opacity 0 → 1
- **Slide**: transform translateY(20px) → (0)
- **Scale**: scale(0.95) → (1)
- **Fade + Slide**: Combined

---

## Responsive Breakpoints

```
Mobile: < 640px (default)
Tablet: 640px - 1024px (sm)
Desktop: > 1024px (md)
Large: > 1280px (lg)
```

### Responsive Strategy
1. Mobile first approach
2. Adjust typography for screen size
3. Stack layouts on mobile
4. Grid layouts on desktop
5. Test all breakpoints

---

## Accessibility (WCAG 2.1 AA)

### Contrast Ratios
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Keyboard Navigation
- All interactive elements: Tab-able
- Focus indicator: Visible and clear
- No keyboard traps
- Logical tab order

### Screen Readers
- All images: Alt text
- Buttons/links: Descriptive labels
- Form labels: Associated
- ARIA labels where needed
- Semantic HTML

### Motion
- Respect prefers-reduced-motion
- No auto-playing videos/animations
- Meaningful animations only
- Stagger delays < 300ms

---

## Error Handling

### Error Messages
- **Location**: Inline or toast
- **Color**: Error color (#ff6b6b)
- **Icon**: X or AlertCircle
- **Text**: Clear, actionable
- **Duration**: 5 seconds for toast

### Empty States
- **Icon**: Relevant illustration
- **Heading**: "No results" or "Empty"
- **Description**: What to do next
- **CTA**: Action button (optional)

### Loading States
- **Animation**: Spinner or skeleton
- **Duration**: < 3 seconds ideal
- **Message**: "Loading..." with context
- **Cancellable**: Option to stop if long

---

## Dark Mode

### Implementation
- Use CSS custom properties
- Provide light/dark color sets
- Respect system preference
- Allow manual override

### Dark Mode Colors
- Background: #1A1A1A
- Surface: #2A2A2A
- Text: #FFFFFF
- Border: rgba(255,255,255,0.1)

---

## Performance

### Image Optimization
- Use WebP where supported
- Lazy load below the fold
- Responsive images (srcset)
- Max width: 1920px
- Compression: 80% quality

### CSS/JS
- Critical CSS inline
- Defer non-critical JS
- Code splitting by route
- Minify and gzip enabled
- Tree-shake unused code

### Caching
- Static assets: 1 year
- HTML: No cache
- API responses: Based on TTL
- Service worker: Update strategies

---

## Interactions

### Hover States
- Button: Slightly brighter/darker
- Link: Underline appears
- Card: Subtle lift (shadow increase)
- Duration: 150ms

### Focus States
- Visible ring (4px)
- Color: Accent
- Offset: 2px
- Ring: rgba(accent, 0.5)

### Active States
- Slightly pressed appearance
- Color: Darker shade
- No delay

---

## Content Guidelines

### Tone
- **Professional yet approachable**
- Encouraging (not condescending)
- Clear and concise
- Action-oriented

### Microcopy
- Buttons: Verb-led ("Create race", "Submit score")
- Placeholders: Help text, not labels
- Error messages: What went wrong + how to fix
- Success messages: Confirmation + next step

### Writing Style
- Active voice preferred
- Second person ("You're crushing it!")
- Avoid jargon
- Keep sentences short

---

## Internationalization (i18n)

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)
- German (de)

### RTL Consideration
- Layout should support RTL
- Don't hardcode text directions
- Test Arabic/Hebrew in future

---

## Browser Support

### Minimum Versions
- Chrome: 90+
- Firefox: 88+
- Safari: 14+
- Edge: 90+

### Graceful Degradation
- CSS Grid: Works on all
- Flexbox: Works on all
- Grid-auto-flow: Fallback available
- New APIs: Feature detection

---

## Testing Checklist

- [ ] Lighthouse audit passed
- [ ] Mobile responsiveness verified
- [ ] Touch targets ≥ 44×44px
- [ ] Color contrast verified
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Form validation clear
- [ ] Error handling tested
- [ ] Edge cases handled
- [ ] Cross-browser tested

---

**Last Updated:** May 8, 2026
