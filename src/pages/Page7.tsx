import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page7({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={7}
      title="CHARACTER DEVELOPMENT"
      description="Create compelling characters that drive your story forward."
    />
  );
}
