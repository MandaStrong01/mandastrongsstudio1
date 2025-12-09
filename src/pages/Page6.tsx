import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page6({ onNavigate }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(6)}
      pageNumber={6}
      onNavigate={onNavigate}
    />
  );
}
