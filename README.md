# Tavern Research Civic Issue Map

A civic engagement web application that helps users discover which political candidates align with their policy positions through an interactive survey and 2D issue map visualization.

## Features

- **Interactive Survey**: 14 policy questions with 5-point Likert scale and importance weighting
- **2D Issue Map**: MDS-based projection showing user position and candidate similarity
- **Smart Matching**: Weighted distance and cosine similarity calculations
- **Topic Breakdown**: Visual bars showing alignment across 8 policy topics
- **Region Filtering**: View candidates from Chicago IL, Illinois, or National scope
- **Privacy-First**: 100% client-side with localStorage persistence
- **Export Results**: Download your results as JSON

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Algorithms**: Classical MDS for dimensionality reduction
- **State Management**: React hooks with localStorage

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
│   │   ├── Survey.tsx         # Survey interface with Likert scales
│   │   ├── IssueMap.tsx       # 2D scatter plot visualization
│   │   ├── Results.tsx        # Top matches and candidate details
│   │   └── TopicBars.tsx      # Topic alignment bars
│   ├── data/
│   │   ├── questions.ts       # Policy questions with weights
│   │   └── candidates.ts      # Candidate positions and bios
│   ├── lib/
│   │   └── score.ts           # Scoring and MDS projection algorithms
│   ├── App.tsx                # Main application coordinator
│   └── index.css              # Tailwind imports
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
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
  base: '/your-repo-name/',
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
  topic: "economy", // or rights, order, climate, housing, education, health, crime
  weights: { economic: -0.5, social: 0.3 } // Adjust for question alignment
}
```

### Adding Candidates

Edit `src/data/candidates.ts`:

```typescript
{
  id: "unique-id",
  name: "Candidate Name",
  region: "Chicago IL", // or "Illinois", "National"
  axes: { economic: -5.0, social: 3.0 }, // -10 to 10 scale
  topics: { /* scores for each topic */ },
  bio: "Brief description",
  url: "https://..." // optional
}
```

### Styling

The app uses Tailwind CSS v4. Modify colors in `src/index.css`:

```css
@theme {
  --color-tavern-blue: #0ea5e9; /* Change accent color */
}
```

## Algorithm Details

### Similarity Calculation

```
similarity = Σ(w_i * a_i * c_i) / (√Σ(w_i * a_i²) * √Σ(w_i * c_i²))
```

Where:
- `w_i` = question importance weight (1-3)
- `a_i` = user answer (-2 to 2)
- `c_i` = candidate position (-2 to 2, scaled from axes)

### Distance Calculation

```
distance = √Σ(w_i * (a_i - c_i)²)
```

### 2D Projection

Classical Multidimensional Scaling (MDS) projects high-dimensional policy positions into 2D space while preserving distances between points.

## Privacy & Data

- **No Backend**: All computation happens in the browser
- **No Tracking**: No analytics or telemetry
- **Local Storage**: Answers saved locally for convenience
- **Export**: Users can download their results as JSON

## License

Demo application for educational purposes. Not intended as voting advice.

© 2025 Tavern Research

## Contributing

This is a demo project. Feel free to fork and adapt for your own use cases.

## Support

For questions or issues, please open an issue on GitHub.
