import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page12({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={12}
      title="EDITOR DASHBOARD"
      description="Trim, crop, combine, add music, subtitles, filters with live preview"
    />
  );
}
