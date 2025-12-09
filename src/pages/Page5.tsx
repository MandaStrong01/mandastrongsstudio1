import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page5({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={5}
      title="PHASE 2: DEVELOPMENT"
      description="Plan your production. Create detailed scripts, storyboards, and production schedules."
    />
  );
}
