import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page20({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={20}
      title="ANALYTICS"
      description="Track views, engagement, and performance of your published films."
    />
  );
}
