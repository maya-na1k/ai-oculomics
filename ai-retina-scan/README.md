# RetinaScan AI v2
AI-powered retinal biomarker analysis prototype for diabetic retinopathy, cardiovascular, kidney, and neurodegenerative risk screening.

## Features
- Upload retinal (fundus) image
- Simulated AI analysis (DR, CVD, CKD, Neuro)
- Grad-CAM inspired interpretability layer
- Beautiful Tailwind UI for hackathon demos

## Quick Start
```bash
npm install
npm run dev
```
Open at **http://localhost:5173**

## Deployment
```bash
npm run build
vercel
```

## Data Sources
- EyePACS / DRIVE / MESSIDOR datasets
- UK Biobank (CVD biomarkers)
- ADNI OCT datasets (Neuro markers)
