import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page17({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={17}
      title="RENDER / EXPORT"
      description="Render final movie up to 1080p, 2 hour max with progress bar"
    />
  );
}
