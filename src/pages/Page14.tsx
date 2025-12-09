import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page14({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={14}
      title="TITLE & TEXT CREATOR"
      description="Create title cards, captions, and lower thirds"
    />
  );
}
