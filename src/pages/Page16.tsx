import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page16({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={16}
      title="COLOR GRADE / VISUAL FX"
      description="Apply LUTs, filters, transitions, and effects"
    />
  );
}
