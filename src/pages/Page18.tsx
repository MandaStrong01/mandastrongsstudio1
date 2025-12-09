import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page18({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={18}
      title="COLLABORATION"
      description="Share and collaborate on projects with your team."
    />
  );
}
