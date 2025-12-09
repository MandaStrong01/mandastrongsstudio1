import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page14({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={14}
      title="COLOR GRADING"
      description="Perfect the look and feel of your movie with professional color grading."
    />
  );
}
