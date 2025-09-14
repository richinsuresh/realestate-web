// src/app/head.tsx
export default function Head() {
  return (
    <>
      <title>ARK Infra — Premium Real Estate</title>
      <meta name="description" content="ARK Infra — Exceptional properties crafted for living." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Manifest + theme (optional but recommended) */}
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#000000" />
    </>
  );
}
