import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page13({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={13}
      title="SOUND & VOICE STUDIO"
      description="Background music, voiceover, and AI speech generation"
    />
  );
}
