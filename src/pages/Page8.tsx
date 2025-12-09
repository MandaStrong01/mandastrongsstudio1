import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page8({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={8}
      title="STORYBOARD & SCENES"
      description="Visualize your movie scene by scene with detailed storyboards."
    />
  );
}
