import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page17({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={17}
      title="PROJECT LIBRARY"
      description="Manage and organize all your movie projects in one place."
    />
  );
}
