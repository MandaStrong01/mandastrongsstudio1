import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page6({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={6}
      title="PHASE 3: PRODUCTION"
      description="Bring it to life. Execute your plan and create your movie with our production tools."
    />
  );
}
