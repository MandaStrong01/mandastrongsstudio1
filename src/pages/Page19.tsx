import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page19({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={19}
      title="PUBLISHING"
      description="Publish your movie to various platforms and social media."
    />
  );
}
