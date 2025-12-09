import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page15({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={15}
      title="AI ANIMATION LAB"
      description="Animate still images and characters with AI"
    />
  );
}
