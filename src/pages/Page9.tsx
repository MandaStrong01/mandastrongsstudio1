import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page9({ onNavigate }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(9)}
      pageNumber={9}
      onNavigate={onNavigate}
    />
  );
}
