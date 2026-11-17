# Decision Dashboard

A responsive decision-making application that helps users compare multiple options using weighted evaluation criteria and identify the best choice.

## Features

- Fetch initial decision data from an API.
- Validate API responses using Zod.
- Add, edit, and remove options.
- Add, edit, and remove evaluation criteria.
- Assign importance weights (1–5) to criteria.
- Rate each option against every criterion (1–5).
- Calculate weighted scores automatically.
- View rankings, winners, and score breakdowns.
- Reset changes to the original decision.
- Save and resume progress using local storage.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- TanStack Query
- Zod
- Axios
- React Router
- Lucide React

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Pratyush2312/decision-application.git
cd decision-application
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=YOUR_API_URL
```

Start the development server:

```bash
npm run dev
```

## Scoring Formula

The application calculates scores using the following formula:

**Weighted Score (%)**

```text
[Sum of (Rating × Weight) / (5 × Sum of Weights)] × 100
```

The option with the highest weighted score ranks first.

## Project Structure

```text
src/
├── app/
├── hooks/
├── lib/
├── pages/
├── store/
├── App.tsx
├── index.css
├── main.tsx
└── routes/
```

## Author

Pratyush Singh