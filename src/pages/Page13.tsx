import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page13({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={13}
      title="VISUAL EFFECTS"
      description="Enhance your movie with stunning visual effects and filters."
    />
  );
}
