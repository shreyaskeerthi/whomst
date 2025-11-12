# WHOMST

A civic engagement web application that helps users discover which political candidates align with their policy positions through an interactive survey and data-driven 2D issue map visualization.

## Features

- **Interactive Survey**: 14 policy questions with 5-point Likert scale and importance weighting
- **Data-Driven 2D Issue Map**: Direct economic/social axis plotting with collision-aware labels
- **Smart Matching**: Weighted distance and cosine similarity calculations with normalized 0-10 scoring
- **Topic Breakdown**: Visual bars showing alignment across 8 policy topics (economy, rights, foreign, climate, housing, education, health, justice)
- **Location Filtering**: View candidates by state, city, or federal level
- **Privacy-First**: 100% client-side with localStorage persistence
- **Export Results**: Download results as JSON or export map as high-res PNG
- **Interactive Visualization**:
  - Hover to reveal candidate names and policy alignment summaries
  - Dynamic scales and tick generation from actual data
  - Grain overlay and blur backdrop legend for aesthetic polish
  - Smooth transitions and hover effects

## Political Figures

The app includes 40+ political figures across multiple levels:

- **Presidents**: Biden, Trump, Obama, Bush, Clinton
- **Congressional Leaders**: Pelosi, McConnell, Schumer, Jeffries, Johnson
- **Vice Presidents & National Leaders**: Harris, Vance, Haley, Pence, Whitmer, Ramaswamy
- **Senators**: Sanders, Warren, Cruz, Rubio, Warnock, Fetterman, and more
- **Governors**: Pritzker (IL), Newsom (CA), DeSantis (FL), Abbott (TX), Hochul (NY), Shapiro (PA), Whitmer (MI), and more
- **Local Leaders**: Adams (NYC), Bass (LA), Brandon Johnson (Chicago), and more

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Visualization**: SVG-based plotting with Canvas export
- **Algorithms**: Weighted cosine similarity and Euclidean distance
- **State Management**: React hooks with localStorage persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Development

### Project Structure

```
whomst/
├── src/
│   ├── components/
│   │   ├── Survey.tsx          # Survey interface with Likert scales
│   │   ├── IssueMap.tsx        # Data-driven 2D scatter plot
│   │   ├── Results.tsx         # Top matches and candidate details
│   │   ├── TopicBars.tsx       # Topic alignment bars
│   │   └── LocationSelector.tsx # State/city filtering
│   ├── data/
│   │   ├── questions.ts        # Policy questions with axis weights
│   │   └── candidates.ts       # 40+ political figures with positions
│   ├── lib/
│   │   ├── score.ts            # Scoring algorithms and projections
│   │   └── plotConfig.ts       # Theme and plotting configuration
│   ├── App.tsx                 # Main application coordinator
│   └── index.css               # Tailwind v4 theme
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (~240KB bundle)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
npm run build
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist/` folder to Netlify:

```bash
npx netlify-cli deploy --prod --dir=dist
```

### GitHub Pages

1. Install gh-pages:

```bash
npm install -D gh-pages
```

2. Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Set base in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/whomst/',
  plugins: [react()],
})
```

4. Deploy:

```bash
npm run deploy
```

## Customization

### Adding Questions

Edit `src/data/questions.ts`:

```typescript
{
  id: 15,
  text: "Your policy statement here",
  topic: "economy", // economy, rights, foreign, climate, housing, education, health, justice
  weights: {
    economic: -0.5,  // -1 to 1 (left vs right)
    social: 0.3,     // -1 to 1 (libertarian vs authoritarian)
    global: 0.2      // -1 to 1 (nationalist vs globalist)
  }
}
```

### Adding Candidates

Edit `src/data/candidates.ts`:

```typescript
{
  id: "unique-id",
  name: "Candidate Name",
  state: "CA",           // State abbreviation
  city: "Los Angeles",   // Optional city
  level: "federal",      // local, state, or federal
  axes: {
    economic: -5.0,      // -10 (left) to 10 (right)
    social: 3.0,         // -10 (libertarian) to 10 (authoritarian)
    global: 4.5          // -10 (nationalist) to 10 (globalist)
  },
  topics: {
    economy: -5,
    rights: -6,
    foreign: 5,
    climate: -7,
    housing: -6,
    education: -5,
    health: -6,
    justice: -3
  },
  bio: "Brief description of political background",
  url: "https://..." // optional
}
```

### Theme Configuration

Edit `src/lib/plotConfig.ts` for visualization theme:

```typescript
export const THEME = {
  colors: {
    you: '#10B981',      // User point color
    top: '#3A7CFF',      // Top 3 matches color
    other: '#6B7280',    // Other candidates color
    // ... more colors
  },
  radii: { you: 8, top: 6, other: 5 },
  padding: { top: 72, right: 72, bottom: 81, left: 81 },
  // ... more theme options
};
```

Edit `src/index.css` for global styling:

```css
@theme {
  --color-tavern-blue-500: #3A7CFF;
  --color-tavern-blue-700: #0B5CFF;
  /* ... more theme variables */
}
```

## Algorithm Details

### User Position Calculation

User position on each axis is calculated as a weighted average:

```
userAxisValue = (Σ(answer * questionWeight * importance) / Σ(importance)) * 10
```

Where:
- `answer` = user answer (-2 to 2)
- `questionWeight` = question's weight on that axis (-1 to 1)
- `importance` = question importance (0 to 2, converted to 1-3)

### Similarity Calculation

Weighted cosine similarity between user and candidate:

```
similarity = Σ(w_i * a_i * c_i) / (√Σ(w_i * a_i²) * √Σ(w_i * c_i²))
```

Where:
- `w_i` = question importance weight (1-3)
- `a_i` = user answer (-2 to 2)
- `c_i` = candidate position (-2 to 2, scaled from axes)

### Distance Calculation

Weighted Euclidean distance:

```
distance = √Σ(w_i * (a_i - c_i)²)
```

### Match Scoring

Final scores are normalized to 0-9.5 scale based on relative distances:

```
score = 9.5 - ((distance - minDistance) / range) * 9.5
```

### 2D Visualization

The Issue Map directly plots candidates using their economic (X) and social (Y) axis values. Features include:

- **Dynamic Scales**: Computed from actual data using `niceExtent()` and `niceTicks()`
- **Collision Detection**: Spiral algorithm (60 max iterations) for label placement
- **Leader Lines**: Drawn when label offset exceeds 10px
- **Responsive Design**: 16:9 on desktop, 4:3 on tablet/mobile
- **Accessibility**: Keyboard navigation, focus rings, ARIA labels

## Privacy & Data

- **No Backend**: All computation happens in the browser
- **No Tracking**: No analytics, telemetry, or external requests
- **Local Storage**: Answers saved locally (key: `tavernAnswers`)
- **Export Options**: JSON data export and PNG image export (2x DPR)

## Interactive Features

- **Hover Effects**:
  - Candidate names appear only on hover
  - Others dim to 0.6 opacity
  - Hovered candidate enlarges to 1.15x
  - Tooltip shows top 3 aligned and divergent policy topics
- **Click Behavior**:
  - Clicking top 3 matches scrolls to results section
  - Brief highlight animation on click
- **Export PNG**: High-resolution export at devicePixelRatio × 2

## License

Demo application for educational purposes. Not intended as voting advice.

**Disclaimer**: All data stored locally. No tracking. Candidate positions are approximations based on public policy positions and voting records.

© 2025 WHOMST • Experimental civic interface

## Contributing

This is a demo project. Feel free to fork and adapt for your own use cases. When adding candidates, ensure positions are researched and reflect documented policy stances.

## Support

For questions or issues, please open an issue on GitHub.
