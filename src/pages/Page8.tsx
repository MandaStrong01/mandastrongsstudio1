import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page8({ onNavigate }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(8)}
      pageNumber={8}
      onNavigate={onNavigate}
    />
  );
}
