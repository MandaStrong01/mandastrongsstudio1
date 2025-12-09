import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page9({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={9}
      title="SCRIPT WRITING"
      description="Write your screenplay with professional formatting and tools."
    />
  );
}
