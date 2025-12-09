import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page11({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={11}
      title="EDITING SUITE"
      description="Edit your footage with professional tools and effects."
    />
  );
}
