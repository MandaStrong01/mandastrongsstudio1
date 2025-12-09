import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page12({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={12}
      title="SOUND & MUSIC"
      description="Add soundtracks, sound effects, and audio mixing to your film."
    />
  );
}
