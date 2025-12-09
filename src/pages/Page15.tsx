import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page15({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={15}
      title="TITLES & CREDITS"
      description="Add professional titles, credits, and text overlays to your film."
    />
  );
}
