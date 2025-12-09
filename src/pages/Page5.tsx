import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page5({ onNavigate }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(5)}
      pageNumber={5}
      onNavigate={onNavigate}
    />
  );
}
