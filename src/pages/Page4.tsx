import PageTemplate from './PageTemplate';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page4({ onNavigate }: PageProps) {
  return (
    <PageTemplate
      onNavigate={onNavigate}
      pageNumber={4}
      title="PHASE 1: STORY & CONCEPT"
      description="Develop your vision. Start by defining your movie's core concept, characters, and storyline."
    />
  );
}
